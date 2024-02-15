/**
 * Placeholder data until the microservice is implemented
 */
function getData(type) {
  if (type == "equipment") {
    return {
      results: [
        {
          name: "Braton",
          category: "Primary",
          type: "Rifle",
          masteryReq: 1,
          imageName: "https://cdn.warframestat.us/img/braton.png",
          maxRank: 30,
          trigger: "auto",
          accuracy: 200,
          criticalChance: 0.3,
          criticalMultiplier: 3,
          damage: {
            puncture: 2.8,
            impact: 28,
            slash: 39.2,
          },
          totalDamage: 70,
          firerate: 5.7,
          procChance: 0.3,
          multiShot: 1,
        },
        {
          name: "Braton Prime",
          category: "Primary",
          type: "Rifle",
          masteryReq: 8,
          imageName: "https://cdn.warframestat.us/img/braton-prime.png",
          maxRank: 30,
          trigger: "auto",
          accuracy: 200,
          criticalChance: 0.3,
          criticalMultiplier: 3,
          damage: {
            puncture: 2.8,
            impact: 28,
            slash: 39.2,
          },
          totalDamage: 70,
          firerate: 9.58,
          procChance: 0.26,
          multiShot: 1,
        },
      ],
    };
  } else if (type == "relics") {
    return {
      results: [
        {
          name: "Axi G11",
          locations: [
            {
              node: "Apollo, Lua",
              missionType: "Disruption",
              rotations: "B",
              chance: 0.1429,
            },
          ],
          rewards: {
            common: [
              "Shade Prime Cerebrum",
              "Forma Blueprint",
              "Orthos Prime Handle",
            ],
            uncommon: ["Afuris Prime Link", "Braton Prime Blueprint"],
            rare: ["Grendel Prime Systems Blueprint"],
          },
          vaulted: false,
          imageName: "https://cdn.warframestat.us/img/axi-exceptional.png",
        },
      ],
    };
  } else {
    console.error(`Unknown type: ${type}`);
    return undefined;
  }
}

function select(currElement, type, data) {
  let resultBin = document.getElementById("results");
  for (const result of resultBin.children) {
    result.classList.remove("selected");
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
    preview.setAttribute("src", data.imageName);
    source.innerText = `Image From "${data.imageName}"`;
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
      <th>Max Rank:</th>
      <td>${data.maxRank}</td>
      <th>Trigger Type:</th>
      <td>${data.trigger}</td>
    </tr>
    <tr>
      <th>Accuracy:</th>
      <td>${data.accuracy}</td>
      <th>Crit Chance:</th>
      <td>${data.criticalChance * 100}%</td>
    </tr>
    <tr>
      <th>Fire Rate:</th>
      <td>${data.firerate}/s</td>
      <th>Crit Multiplier:</th>
      <td>${data.criticalChance}x</td>
    </tr>
    <tr>
      <th>Multishot:</th>
      <td>${data.multiShot}</td>
      <th>Status Chance:</th>
      <td>${data.procChance}%</td>
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
    </tr>
    <tr>
      <td>${data.damage.puncture}</td>
      <td>${data.damage.impact}</td>
      <td>${data.damage.slash}</td>
    </tr>
  </table>
    `;
    } else if (type == "relics") {
      dataField.innerHTML = `
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
        <td>${data.rewards.common[0]}</td>
        <td>${data.rewards.uncommon[0]}</td>
        <td>${data.rewards.rare[0]}</td>
      </tr>
      <tr>
        <td>${data.rewards.common[1]}</td>
        <td>${data.rewards.uncommon[1]}</td>
        <td></td>
      </tr>
      <tr>
        <td>${data.rewards.common[2]}</td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <button onclick="
      console.log('HELP');
      let locTable = document.getElementById('locTable');
      console.log(locTable);
      locTable.style.display = 'none';
      this.style.display = 'none';
      ">Hide Table</button>
    <table class="centerData" id="locTable">
      <tr>
        <th colspan="4">Locations</th>
      </tr>
      <tr>
        <th>Mission Type</th>
        <th>Node</th>
        <th>Rotation</th>
        <th>Odds</th>
      </tr>
      <tr>
        <td>${data.locations[0].missionType}</td>
        <td>${data.locations[0].node}</td>
        <td>${data.locations[0].rotations}</td>
        <td>${data.locations[0].chance * 100}%</td>
      </tr>
    </table>
      `;
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
  let results = document.getElementById("results");
  let helpBtn = document.getElementById("helpBtn");

  searchBtn.onclick = () => {
    let type = searchType.value;
    let data;
    data = getData(type);

    console.log(type);
    if (type == "equipment") {
      results.innerHTML = "";
      for (const item of data.results) {
        results.innerHTML += `
<div class="resultItem" onclick='select(this, "${type}", ${JSON.stringify(
          item
        )})'>
<div>${item.name}</div>
<div>MR${item.masteryReq}</div>
</div>
`;
      }
    } else if (type == "relics") {
      results.innerHTML = "";
      for (const relic of data.results) {
        results.innerHTML += `
<div class="resultItem" onclick='select(this, "${type}", ${JSON.stringify(
          relic
        )})'>
<div>${relic.name}</div>
<div>${relic.vaulted ? "Vaulted" : "Unvaulted"}</div>
</div>
        `;
      }
    } else {
      console.error(`Unrecognized type: ${type}`);
    }
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
}

connectButtons();

console.log(ejs);
