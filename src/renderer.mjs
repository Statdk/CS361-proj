import * as db from "./db.mjs"

function select(currElement, type, data) {
  let resultBin = document.getElementById("results");
  if (resultBin !== null) {
    for (const result of resultBin.children) {
      result.classList.remove("selected");
    }
  }
  else {
    console.log("Where bin?");
  }

  currElement.classList.add("selected");
  if (type == undefined && data == undefined) {
    return;
  }

  console.log(data);

  try {
    let preview = document.getElementById("preview");
    let source = document.getElementById("ImageSRC");

    preview.setAttribute("src", "");
    preview.setAttribute("src", `https://cdn.warframestat.us/img/${data.imageName}`);
    source.innerText = `Image From "https://cdn.warframestat.us/img/${data.imageName}"`;
  } catch (error) {
    console.error(`Unable to set image ${error}`);
  }

  /*
Type: Primary Rifle | Mastery Requirement: 8
Max Rank: 30        | Trigger Type: auto


Accuracy: 200       | Crit Chance: 30%
Fire Rate: 5.7/s    | Crit Multiplier: 3.0x
Multishot: 1        | Status Chance: 30%


Damage Types:

 Puncture    | Impact     | Slash
        2.8  |      28    |     39.2

Total: 70
   */

  try {
    let dataField = document.getElementById("dataField");
    if (dataField === null) {
      throw "No dataField";
    }
    if (type == "equipment") {
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
    } else if (type == "relics") {
      let common = [];
      let uncommon = [];
      let rare = [];

      for (const reward of data.rewards) {
        if (reward.chance > 20) {
          common.push(reward);
        } else if (reward.chance > 5) {
          uncommon.push(reward);
        } else {
          rare.push(reward)
        }
      }

      let gonnaBeHTML = `
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
        <td>${common[0].item.name}</td>
        <td>${uncommon[0].item.name}</td>
        <td>${rare[0].item.name}</td>
      </tr>
      <tr>
        <td>${common[1].item.name}</td>
        <td>${uncommon[1].item.name}</td>
        <td></td>
      </tr>
      <tr>
        <td>${common[2].item.name}</td>
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
        </tr>`
      // <tr>
      //   <td>${data.locations[0].missionType}</td>
      //   <td>${data.locations[0].node}</td>
      //   <td>${data.locations[0].rotations}</td>
      //   <td>${data.locations[0].chance * 100}%</td>
      // </tr>
      // <button onclick="
      // console.log('HELP');
      // let locTable = document.getElementById('locTable');
      // console.log(locTable);
      // locTable.style.display = 'none';
      // this.style.display = 'none';
      // ">Hide Table</button>

      data.locations.sort((first, second) => { return second.chance - first.chance });

      for (const mission of data.locations) {
        gonnaBeHTML += `
          <tr>
            <td>${mission.rarity}</td>
            <td>${mission.chance * 100}%</td>
            <td>${mission.location}</td>
          </tr>
        `;
      }

      gonnaBeHTML += `</table></div>`

      dataField.innerHTML = gonnaBeHTML;

    } else {
      throw `Unrecognized type: ${type}`;
    }
  } catch (error) {
    console.error(`Unable to set dataField: ${error}`);
  }
}

/*
<div class="resultItem" onclick="select(this)">
  <div>ItemName</div>
  <div>MR</div>
</div>
*/

/**
 * Connect buttons to their functions and
 *  attach listeners to their events.
 */
function connectButtons() {
  let searchBtn = document.getElementById("searchBtn");
  let searchField = document.getElementById("searchField");
  let searchType = document.getElementById("searchType");
  let isPrime = document.getElementById("isPrime");
  let isVaulted = document.getElementById("isVaulted");
  let results = document.getElementById("results");
  let helpBtn = document.getElementById("helpBtn");
  let preview = document.getElementById("preview");

  searchBtn.onclick = async () => {
    let prevImg = preview.getAttribute("src");

    let type = searchType.value;
    /** @type {[{}]} */
    let data;


    console.log(type);

    if (type == "equipment") {
      preview.setAttribute("src", "./loading.gif");
      data = await db.getEquip(isPrime.checked);
      if (data == undefined) {
        preview.setAttribute("src", prevImg);
        return;
      }

      if (searchField.value !== "") {
        data = db.filter(data, "name", searchField.value);
      }

      console.log(data);

      results.innerHTML = "";
      let gonnaBeHTML = "";

      for (const item of data) {
        gonnaBeHTML += `
<div class="resultItem" onclick='select(this, "${type}", ${JSON.stringify(
          item
        )})'>
<div>${item.name}</div>
<div>MR${item.masteryReq}</div>
</div>
`;
      }

      results.innerHTML = gonnaBeHTML;
    } else if (type == "relics") {
      preview.setAttribute("src", "./loading.gif");

      data = await db.getRelics();
      if (data == undefined) {
        preview.setAttribute("src", prevImg);
        return;
      }


      if (searchField.value !== "") {
        data = db.filter(data, "name", searchField.value);
      }

      data = db.filter(data, "vaulted", isVaulted.checked);

      console.log(data);

      results.innerHTML = "";
      let gonnaBeHTML = "";

      for (const relic of data) {
        gonnaBeHTML += `
<div class="resultItem" onclick='select(this, "${type}", ${JSON.stringify(
          relic
        )})'>
<div>${relic.name}</div>
<div>${relic.vaulted ? "" : ""}</div>
</div>
        `;
      }

      results.innerHTML = gonnaBeHTML;
    } else {
      console.error(`Unrecognized type: ${type}`);
    }

    preview.setAttribute("src", prevImg);
  };

  searchField.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
      searchBtn.click();
    }
  });

  helpBtn.onclick = () => {
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
    New searches will clear the search box!
    `);
  };

  searchType.oninput = () => {
    let type = searchType.value;
    let isPrimeLabel = document.getElementById("isPrimeLabel");
    let isVaultedLabel = document.getElementById("isVaultedLabel");

    if (type === "relics") {
      isPrimeLabel.classList.add("unavailable");
      isPrime.disabled = true;

      isVaultedLabel.classList.remove("unavailable");
      isVaulted.disabled = false;
    }
    else {
      isPrimeLabel.classList.remove("unavailable");
      isPrime.disabled = false;

      isVaultedLabel.classList.add("unavailable");
      isVaulted.disabled = true;
    }

    searchBtn.click();
  }

  isPrime.oninput = () => {
    searchBtn.click();
  }

  isVaulted.oninput = () => {
    searchBtn.click();
  }
}

connectButtons();

window.select = select;

console.log(ejs);
