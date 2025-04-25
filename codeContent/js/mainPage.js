window.onload = function () {
    ["record", "language", "theme", "about", "help"].forEach((elem) => settings(elem, true));// Initialization,create all the element
    info = navigator.userAgent;
    isPhone = /mobile/i.test(info); // if it's a mobile device, isPhone = true
    if (isPhone) return confirm("This page is not supported on mobile devices. Please use a computer to access it.") ? document.querySelector("html").style.display = "none" : null;
    if (infoTransfer.uN !== "") {
        document.querySelector("#login").style.display = "none";
        // if the user name is not empty, hide the login part
        document.querySelector("#hello").textContent+=infoTransfer.uN;
        document.querySelector("#hello").style.display = "block";
    }
}
let selectGameType = "";
let infoTransfer = {
    l: "English",//language
    t: "light",//theme
    uN: "",//user name
    pw: "",//password
    gI: {//game info
        "game2048": {},
        "klotski": {},
        "labyrinth": {},
        "mineClearance": {}
    }
}
for (let key in infoTransfer.gI) infoTransfer.gI[key].c0 = { mN: 0, bS: 0 }//mN=max number,bS=best score
// for decrease the capacity of the code, I will replace some words with a single letter
function recordChanged(type) {
    switch (type) {
        case "game2048": showGame2048Record(); break;
        case "labyrinth": showLabyrinthRecord(); break;
        case "mineClearance": showMineClearanceRecord(); break;
        case "klotski": showKlotskiRecord(); break;
        default: console.log("why can you get this case?"); break;
    }
    function showGame2048Record() {
        let _temporaryString = `<h1 class="interpElem">Record of game2048</h1><hr/><ul class="recordList">`;
        for (i = 0; i < Object.keys(infoTransfer.gI.game2048).length - 1; i++) {
            recordTypeKey = Object.keys(infoTransfer.gI.game2048)[i + 1];
            _temporaryString += `<li class="recordListChoice interpElem">
            <div>Step<hr/><strong>${infoTransfer.gI.game2048[recordTypeKey].s}</strong></div>
            <div>Time<hr/><strong>${infoTransfer.gI.game2048[recordTypeKey].t}</strong></div>
            <div>Score<hr/><strong>${infoTransfer.gI.game2048[recordTypeKey].bS}</strong></div>
            <div>Num<hr/><strong>${infoTransfer.gI.game2048[recordTypeKey].mN}</strong></div>
            <div>Data<hr/><div id="recordListDateSearch" onclick="alert('Write time: ${infoTransfer.gI.game2048[recordTypeKey].dT}\\nFinal array:${infoTransfer.gI.game2048[recordTypeKey].dA}')">click</div></div>
            </li>`;
        }
        _temporaryString += `<li class="recordListChoice interpElem" style="line-height:15vh" onclick="selectGame(null,'game2048');selectGame(null,0);">let's play more!</li></ul>`;
        document.querySelector("#recordContent").innerHTML = _temporaryString;
        _temporaryString = null;
    }
    function showLabyrinthRecord() {
        let _temporaryString = `<h1 class="interpElem">Record of labyrinth</h1><hr/><ul class="recordList">`;
        for (i = 0; i < Object.keys(infoTransfer.gI.labyrinth).length - 1; i++) {
            recordTypeKey = Object.keys(infoTransfer.gI.labyrinth)[i + 1];
            _temporaryString += `<li class="recordListChoice interpElem">
            <div>Step<hr/><strong>${infoTransfer.gI.labyrinth[recordTypeKey].s}</strong></div>
            <div>Time<hr/><strong>${infoTransfer.gI.labyrinth[recordTypeKey].t}</strong></div>
            <div>Width<hr/><strong>${infoTransfer.gI.labyrinth[recordTypeKey].w}</strong></div>
            <div>Score<hr/><strong>${infoTransfer.gI.labyrinth[recordTypeKey].bS}</strong></div>
            <div>Data<hr/><div id="recordListDateSearch" onclick="alert('Write time: ${infoTransfer.gI.labyrinth[recordTypeKey].dT}')">click</div></div>
            </li>`;
        }
        _temporaryString += `<li class="recordListChoice interpElem" style="line-height:15vh" onclick="selectGame(null,'labyrinth');selectGame(null,0);">let's play more!</li></ul>`;
        document.querySelector("#recordContent").innerHTML = _temporaryString;
        _temporaryString = null;

    }
    function showMineClearanceRecord() {
        document.querySelector("#recordContent").innerHTML = `<h1 class="interpElem">Record of mineClearance</h1><hr/>${["best score", "max number"].map(recordType => `<div class="recordChoice interpElem" onclick='recordChanged("${recordType}")'>${recordType}</div>`).join("")}`;
    }
    function showKlotskiRecord() {
        document.querySelector("#recordContent").innerHTML = `<h1 class="interpElem">Record of klotski</h1><hr/>${["best score", "max number"].map(recordType => `<div class="recordChoice interpElem" onclick='recordChanged("${recordType}")'>${recordType}</div>`).join("")}`;
    }
}
function langChanged(type) {
    infoTransfer.language = type;
    // there will be a language change function in the future
    console.log(`language is changed to ${type}`);
}
function themeChanged(type) {
    infoTransfer.theme = type;
    // there will be a theme change function in the future
    console.log(`theme is changed to ${type}`);
}

function partsSwitch() {
    let selectGamePart = document.querySelector("#selectGamePart");
    let settingPart = document.querySelector("#settingPart");
    let loginPart = document.querySelector("#login");
    let helloPart = document.querySelector("#hello");
    if (window.getComputedStyle(settingPart).display === "none") {
        selectGamePart.style.display = "none";
        loginPart.style.display = "none";
        helloPart.style.display = "none";
        settingPart.style.display = "block";
        return console.log("settingPart is displayed");
    } else {
        selectGamePart.style.display = "block";
        helloPart.style.display = "block";
        // else loginPart.style.display = "block";
        settingPart.style.display = "none";
        settings("other", true)
        return console.log("selectGamePart is displayed");
    }
}

function settings(type, _isInitialization = false, _aboutSentence, _helpSentence) {
    _aboutSentence = _aboutSentence || "This is a simple webpage.The only one creater is me, who is a student in SZPU university. I am learning web development and this is my first project. I hope you like it!";
    _helpSentence = _helpSentence || "This is a simple webpage.If you have any question about this webpage,please enter <a href='http://chat.deepseek.com' target='_blank'>this page</a>.";
    document.querySelectorAll("#main>main>div[id$=Content]").forEach((elem) => {
        elem.style.display = "none";
    });
    if (!_isInitialization) document.querySelector(`#${type}Content`).style.display = "block";
    switch (type) {
        case "record": record(); break;
        case "language": language(); break;
        case "theme": theme(); break;
        case "about": about(); break;
        case "help": help(); break;
        default: console.log("why can you get this case?"); break;
    }
    function record() {
        document.querySelector("#recordContent").innerHTML = `<h1 class="interpElem">Record</h1><hr/>${["game2048", "labyrinth", "mineClearance", "klotski"].map(recordGameType => `<div class="recordChoice interpElem" onclick='recordChanged("${recordGameType}")'>${recordGameType}</div>`).join("")}`;
    }
    function language() {
        document.querySelector("#languageContent").innerHTML = `<h1 class="interpElem">Language</h1><hr/>${["English", "Chinese", "Copperplate"].map(langType => `<div class="languageChoice interpElem" onclick='langChanged("${langType}")'>${langType}</div>`).join("")}`;
    }
    function theme() {
        document.querySelector("#themeContent").innerHTML = `<h1 class="interpElem">Theme</h1><hr/>${["light", "dark"].map(themeType => `<div class="themeChoice interpElem" onclick='themeChanged("${themeType}")'>${themeType}</div>`).join("")}`;
    }
    function about() {
        document.querySelector("#aboutContent").innerHTML = `<h1 class="interpElem">About</h1><hr/><p class="interpElem">${_aboutSentence}</p>`;
    }
    function help() {
        document.querySelector("#helpContent").innerHTML = `<h1 class="interpElem">help</h1><hr/><p class="interpElem">${_helpSentence}</p>`;
    }
    return console.log(`${type} function is called`);
}


function selectGame(self, type = 1) {
    selectGameType = type ? type : selectGameType;
    if (!type && selectGameType !== "") window.open(`./codeContent/html/${selectGameType}.html?${JSON.stringify(infoTransfer)}`, "_self");
    if (type) buttonDown(self);
    function buttonDown(self) {
        if (self === null) return;
        document.querySelectorAll("#aside li").forEach((elem) => {
            elem.style.boxShadow = "2px 2px 10px 1px rgba(86, 66, 50, 0.685)";
        });
        self.style.boxShadow = ".5px .5px 3px 1px rgba(86, 66, 50, 0.877)";
    }
    return console.log(`game type is ${selectGameType}`);
}

function login() {
    infoTransfer.uN = document.querySelector("#username").value;
    infoTransfer.pw = document.querySelector("#password").value;
}
function register() {
    // there will be some thing about register
}