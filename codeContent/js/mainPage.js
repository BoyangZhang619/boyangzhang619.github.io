window.onload = function () {
    ["record", "language", "theme", "about", "help"].forEach((elem) => settings(elem, true));// Initialization,create all the element
	// info = navigator.userAgent;
	// isPhone = /mobile/i.test(info); // if it's a mobile device, isPhone = true
}
let selectGameType = "";
let infoTransfer = {
    l: "English",//language
    t: "light",//theme
    uN: "",//user name
    pw: "",//password
    gI: {//game info
        "game2048":{},
        "klotski":{},
        "labyrinth":{},
        "mineClearance":{}
    }
}
for (let key in infoTransfer.gI)infoTransfer.gI[key].c0={ mN: 0,bS: 0}//mN=max number,bS=best score
// for decrease the capacity of the code, I will replace some words with a single letter
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
    if (window.getComputedStyle(settingPart).display === "none") {
        selectGamePart.style.display = "none";
        loginPart.style.display = "none";
        settingPart.style.display = "block";
        return console.log("settingPart is displayed");
    } else {
        selectGamePart.style.display = "block";
        loginPart.style.display = "block";
        settingPart.style.display = "none";
        settings("other",true)
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
    if (!type && selectGameType !=="") window.open(`./codeContent/html/${selectGameType}.html?${JSON.stringify(infoTransfer)}`, "_self");
    if (type) buttonDown(self);
    function buttonDown(self) {
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