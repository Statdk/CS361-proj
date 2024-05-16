import * as db from "./db.mjs";

function selectResult(element) {
  let resultBin = document.getElementById("results");
  if (resultBin !== null) {
    for (const result of resultBin.children) {
      result.classList.remove("selected");
    }
  } else {
    console.log("Where bin?");
  }

  element.classList.add("selected");
}

function setImage(imageName) {
  try {
    let preview = document.getElementById("preview");
    let source = document.getElementById("ImageSRC");

    preview.setAttribute("src", "");
    preview.setAttribute("src", `https://cdn.warframestat.us/img/${imageName}`);
    source.innerText = `Image From "https://cdn.warframestat.us/img/${imageName}"`;
  } catch (error) {
    console.error(`Unable to set image ${error}`);
  }
}

function setDataEquipment(data) {
  dataField.innerHTML = `
    <table class="centerData">
    <tr>
      <th colspan="4">Equipment Stats</th>
    </tr>
    <tr>
      <th>Type:</th>
      <td>${data.category} ${data.type}</td>
      <th>Mastery Requirement:</th>
      <td>${data.masteryReq}</td>
    </tr>
    <tr>
      <th>Trigger Type:</th>
      <td>${data.trigger === undefined ? "N/A" : data.trigger}</td>
      <th></th>
      <td></td>
    </tr>
    <tr>
      <th>Accuracy:</th>
      <td>${data.accuracy === undefined ? "N/A" : data.accuracy}</td>
      <th>Status Chance:</th>
      <td>${data.procChance}%</td>
    </tr>
    <tr>
      <th>Crit Multiplier:</th>
      <td>${data.criticalMultiplier}x</td>
      <th>Crit Chance:</th>
      <td>${data.criticalChance * 100}%</td>
    </tr>
  </table>
  <table class="dataTable dmgTable">
    <tr>
      <th colspan="3">Damage Types</th>
    </tr>
    <tr>
      <th>Puncture</th>
      <th>Impact</th>
      <th>Slash</th>
      <th>Total</th>
    </tr>
    <tr>
      <td>${data.damage.puncture}</td>
      <td>${data.damage.impact}</td>
      <td>${data.damage.slash}</td>
      <td>${data.totalDamage}</td>
    </tr>
  </table>
    `;
}

function sortRewards(dataRewards) {
  const rewards = { common: [], uncommon: [], rare: [] };

  for (const item of dataRewards) {
    if (item.chance > 20) {
      rewards.common.push(item);
    } else if (item.chance > 5) {
      rewards.uncommon.push(item);
    } else {
      rewards.rare.push(item);
    }
  }

  return rewards;
}

function concatLocations(locations) {
  let html = "";

  for (const mission of locations) {
    html += `
      <tr>
        <td>${mission.rarity}</td>
        <td>${mission.chance * 100}%</td>
        <td>${mission.location}</td>
      </tr>
    `;
  }

  return html;
}

function setDataRelic(data) {
  const rewards = sortRewards(data.rewards);

  let html = `
  <table class="alignRight">
  <tr>
    <th colspan="3">${data.name}</th>
  </tr>
  <tr>
    <th colspan="3">Drops</th>
  </tr>
  <tr>
    <th>Common</th>
    <th>Uncommon</th>
    <th>Rare</th>
  </tr>
  <tr>
    <td>${rewards.common[0].item.name}</td>
    <td>${rewards.uncommon[0].item.name}</td>
    <td>${rewards.rare[0].item.name}</td>
  </tr>
  <tr>
    <td>${rewards.common[1].item.name}</td>
    <td>${rewards.uncommon[1].item.name}</td>
    <td></td>
  </tr>
  <tr>
    <td>${rewards.common[2].item.name}</td>
    <td></td>
    <td></td>
  </tr>
</table>
  <div class="locTableWrap scrolly">
  <table class="centerData" id="locTable">
    <tr>
      <th colspan="4">Locations</th>
    </tr>
    <tr>
      <th>Rarity</th>
      <th>Odds</th>
      <th>Location</th>
    </tr>`;

  data.locations.sort((a, b) => {
    return b.chance - a.chance;
  });

  html += concatLocations(data.locations);

  html += `</table></div>`;

  dataField.innerHTML = html;
}

function setDataFields(type, data) {
  let dataField = document.getElementById("dataField");

  if (dataField === null) {
    throw "No dataField";
  }

  if (type == "equipment") {
    setDataEquipment(data);
  } else if (type == "relics") {
    setDataRelic(data);
  } else {
    throw `Unrecognized type: ${type}`;
  }
}

function selectItem(currElement, type, data) {
  selectResult(currElement);

  if (type == undefined && data == undefined) {
    return;
  }

  console.log(data); // Provide some logging

  setImage(data.imageName);

  setDataFields(type, data);
}

function collectDOM() {
  const buttons = {
    searchBtn: document.getElementById("searchBtn"),
    helpBtn: document.getElementById("helpBtn"),
  };
  const fields = {
    isPrime: document.getElementById("isPrime"),
    isVaulted: document.getElementById("isVaulted"),
    results: document.getElementById("results"),
    preview: document.getElementById("preview"),
    searchField: document.getElementById("searchField"),
    searchType: document.getElementById("searchType"),
  };
  return { buttons: buttons, fields: fields };
}

async function searchEquipment(fields) {
  fields.preview.setAttribute("src", "./loading.gif");

  let data = await db.getEquip(fields.isPrime.checked);
  if (data == undefined) {
    fields.preview.setAttribute("src", prevImg);
    return;
  }

  if (fields.searchField.value !== "") {
    data = db.filter(data, "name", searchField.value);
  }

  console.log(data);

  fields.results.innerHTML = "";
  let html = "";

  for (const item of data) {
    html += `
    <div class="resultItem" onclick='select(this, "equipment", ${JSON.stringify(
      item
    )})'>
      <div>${item.name}</div>
      <div>MR${item.masteryReq}</div>
    </div>`;
  }

  fields.results.innerHTML = html;
}

async function searchRelics(fields) {
  fields.preview.setAttribute("src", "./loading.gif");

  let data = await db.getRelics();
  if (data == undefined) {
    fields.preview.setAttribute("src", prevImg);
    return;
  }

  if (fields.searchField.value !== "") {
    data = db.filter(data, "name", fields.searchField.value);
  }

  data = db.filter(data, "vaulted", fields.isVaulted.checked);

  console.log(data);

  fields.results.innerHTML = "";
  let html = "";

  for (const relic of data) {
    html += `
    <div class="resultItem" onclick='select(this, "relics", ${JSON.stringify(
      relic
    )})'>
      <div>${relic.name}</div>
      <div></div>
    </div>`;
  }

  fields.results.innerHTML = html;
}

function connectSearchBtn(searchBtn, fields) {
  searchBtn.onclick = async () => {
    let prevImg = fields.preview.getAttribute("src");

    let type = fields.searchType.value;
    /** @type {[{}]} */
    let data;

    console.log(type);

    if (type == "equipment") {
      await searchEquipment(fields);
    } else if (type == "relics") {
      await searchRelics(fields);
    } else {
      console.error(`Unrecognized type: ${type}`);
    }

    fields.preview.setAttribute("src", prevImg);
  };
}

function connectHelpBtn(button) {
  button.onclick = () => {
    alert(`
    Welcome to the Warframe Search Tool!\n\n
    Viewing Equipment:\n
    1. To get started, enter an item name in the search box and press enter.\n
    2. Any matching equipment items will be shown in list form below.\n
    3. Clicking on one will bring its details to the right side of the screen for your viewing pleasure.\n\n
    Viewing Relics:\n
    1. From the drop down menu, select relics from the list.\n
    2. As you did with the equipment, enter a search term in the search box and press enter.\n
    3. Matching entries will be shown below, click on one to view drops and location information!\n\n
    Notes:\n
    Press control then z to undo typing in the seach box.\n
    New searches will clear the search box!`);
  };
}

function updateSearchType(searchBtn) {
  let type = searchType.value;
  let isPrimeLabel = document.getElementById("isPrimeLabel");
  let isVaultedLabel = document.getElementById("isVaultedLabel");

  if (type === "relics") {
    isPrimeLabel.classList.add("unavailable");
    isPrime.disabled = true;

    isVaultedLabel.classList.remove("unavailable");
    isVaulted.disabled = false;
  } else {
    isPrimeLabel.classList.remove("unavailable");
    isPrime.disabled = false;

    isVaultedLabel.classList.add("unavailable");
    isVaulted.disabled = true;
  }

  searchBtn.click();
}

function connectCheckBoxes(buttons, fields) {
  fields.searchType.oninput = () => {
    updateSearchType(buttons.searchBtn);
  };

  fields.isPrime.oninput = () => {
    searchBtn.click();
  };

  fields.isVaulted.oninput = () => {
    searchBtn.click();
  };
}

function connectButtons() {
  const elements = collectDOM();

  connectSearchBtn(elements.buttons.searchBtn, elements.fields);

  searchField.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      searchBtn.click();
    }
  });

  connectHelpBtn(helpBtn);

  connectCheckBoxes(elements.buttons, elements.fields);
}

connectButtons();

window.select = selectItem;
