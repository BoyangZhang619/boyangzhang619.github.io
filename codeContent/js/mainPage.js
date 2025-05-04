window.onload = function () {
    ["record", "account", "language", "theme", "about", "help"].forEach((elem) => settings(elem, true));// Initialization,create all the element
    info = navigator.userAgent;
    alert(info);
    isPhone = /mobile/i.test(info); // if it's a mobile device, isPhone = true
    // if (isPhone) return confirm("This page is not supported on mobile devices. Please use a computer to access it.") ? document.querySelector("html").innerHTML = "there is nothing" : alert("Exactly, you have to use a computer to access it.") ? document.querySelector("html").innerHTML = "there is nothing" : null;
    if (localStorage.getItem("isInfoTransferOpen") === null) {// localStorage
        localStorage.setItem("allUsers", JSON.stringify({ "_currentUser": "undefined" }));
        localStorage.setItem("userDevice", JSON.stringify({ "isPhone": isPhone }));
        localStorage.setItem("isInfoTransferOpen", "of course!");
    }
    if (JSON.parse(localStorage.getItem("allUsers"))["_currentUser"] !== "undefined") {
        document.querySelector("#login").style.display = "none";
        // if the user name is not empty, hide the login part
        isLogin = true;
        document.querySelector("#hello").textContent = `Hello, ${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}`;
        document.querySelector("#hello").style.display = "block";
        // JSON.parse(localStorage.getItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-${}`)).gameInfo.totalTimes
    } else {
        document.querySelector("#login").style.display = "block";
    }
}
let isLogin = false;
let selectGameType = "";
// for (let key in infoTransfer.gI) infoTransfer.gI[key].c0 = { mN: 0, bS: 0 }//mN=max number,bS=best score
// for decrease the capacity of the code, I will replace some words with a single letter
function recordChanged(type) {
    if (!isLogin) return alert("Please login to get your record.");
    switch (type) {
        case "game2048": showGame2048Record(1); break;
        case "labyrinth": showLabyrinthRecord(1); break;
        case "mineClearance": showMineClearanceRecord(1); break;
        case "klotski": showKlotskiRecord(1); break;
        default: console.log("why can you get this case?"); break;
    }
    document.querySelector(".recordNav>li>ul").addEventListener("click", (event) => {
        if (event.target.tagName === "LI") {
            recordNavCompute(event.target.textContent, document.querySelectorAll(".recordNav>li>ul>li").length, document.querySelectorAll(".recordNav>li>ul>li")[document.querySelectorAll(".recordNav>li>ul>li").length - 1].textContent);
        }
    })
    function showGame2048Record(_page) {
        let _temporaryString = `<h1 class="interpElem">Record of game2048</h1><hr/><ul class="recordList">`;
        let _game2048Record = JSON.parse(localStorage.getItem(JSON.parse(localStorage.getItem("allUsers"))["_currentUser"] + "-game2048-" + _page));
        for (i = Object.keys(_game2048Record.record).length - 1; i > 0; i--) {
            recordTypeKey = Object.keys(_game2048Record.record)[i];
            _temporaryString += `<li class="recordListChoice interpElem">
            <div>Step<hr/><strong>${_game2048Record.record[recordTypeKey].s}</strong></div>
            <div>Time<hr/><strong>${_game2048Record.record[recordTypeKey].t}</strong></div>
            <div>Score<hr/><strong>${_game2048Record.record[recordTypeKey].bS}</strong></div>
            <div>Num<hr/><strong>${_game2048Record.record[recordTypeKey].mN}</strong></div>
            <div>Data<hr/><div id="recordListDateSearch" onclick="alert('Write time: ${_game2048Record.record[recordTypeKey].dT}\\nFinal array:${_game2048Record.record[recordTypeKey].dA}')">click</div></div>
            </li>`;
        }
        _temporaryString += `<li class="recordListChoice interpElem" style="line-height:15vh" onclick="selectGame(null,'game2048');selectGame(null,0);">let's play more!</li></ul>`;
        _temporaryString += "<ul class='recordNav'><li class='pre'>pre</li><li><ul>";
        for (i = 1; i <= _game2048Record.gameInfo.totalPages; i++) {
            if (i == 6) break;
            _temporaryString += "<li></li>";
        }
        --i;
        _temporaryString += "</ul></li><li class='next'>next</li></ul>";
        document.querySelector("#recordContent").innerHTML = _temporaryString;
        document.querySelectorAll(".recordNav>li>ul>li").forEach(elem => {
            elem.style.margin = `.5vw calc(${(31 - 4 * i) / (2 * i)}vw - ${20 / (2 * i)}px)`;
        });
        recordNavCompute(1, i, _game2048Record.gameInfo.totalPages)
        _temporaryString = null;
    }
    function showLabyrinthRecord(_page) {
        let _temporaryString = `<h1 class="interpElem">Record of labyrinth</h1><hr/><ul class="recordList">`;
        let _labyrinthRecord = JSON.parse(localStorage.getItem(JSON.parse(localStorage.getItem("allUsers"))["_currentUser"] + "-labyrinth-" + _page));
        for (i = Object.keys(_labyrinthRecord.record).length - 1; i > 0; i--) {
            recordTypeKey = Object.keys(_labyrinthRecord.record)[i];
            _temporaryString += `<li class="recordListChoice interpElem">
            <div>Step<hr/><strong>${_labyrinthRecord.record[recordTypeKey].s}</strong></div>
            <div>Time<hr/><strong>${_labyrinthRecord.record[recordTypeKey].t}</strong></div>
            <div>Width<hr/><strong>${_labyrinthRecord.record[recordTypeKey].w}</strong></div>
            <div>Score<hr/><strong>${_labyrinthRecord.record[recordTypeKey].bS}</strong></div>
            <div>Data<hr/><div id="recordListDateSearch" onclick="alert('Write time: ${_labyrinthRecord.record[recordTypeKey].dT}')">click</div></div>
            </li>`;
        }
        _temporaryString += `<li class="recordListChoice interpElem" style="line-height:15vh" onclick="selectGame(null,'labyrinth');selectGame(null,0);">let's play more!</li></ul>`;
        document.querySelector("#recordContent").innerHTML = _temporaryString;
        _temporaryString = null;
    }
    function showMineClearanceRecord(_page) {
        let _temporaryString = `<h1 class="interpElem">Record of mineClearance</h1><hr/><ul class="recordList">`;
        let _mineClearanceRecord = JSON.parse(localStorage.getItem(JSON.parse(localStorage.getItem("allUsers"))["_currentUser"] + "-mineClearance-" + _page));
        for (i = Object.keys(_mineClearanceRecord.record).length - 1; i > 0; i--) {
            recordTypeKey = Object.keys(_mineClearanceRecord.record)[i];
            let _isOver = _mineClearanceRecord.record[recordTypeKey].iO === true ? "WIN" : "FAIL";
            _temporaryString += `<li class="recordListChoice interpElem">
            <div>Time<hr/><strong>${_mineClearanceRecord.record[recordTypeKey].t}</strong></div>
            <div>Width<hr/><strong>${_mineClearanceRecord.record[recordTypeKey].w}</strong></div>
            <div>Mines<hr/><strong>${_mineClearanceRecord.record[recordTypeKey].mC}</strong></div>
            <div>Result<hr/><strong>${_isOver}</strong></div>
            <div>Data<hr/><div id="recordListDateSearch" onclick="alert('Write time: ${_mineClearanceRecord.record[recordTypeKey].dT}')">click</div></div>
            </li>`;
        }
        _temporaryString += `<li class="recordListChoice interpElem" style="line-height:15vh" onclick="selectGame(null,'mineClearance');selectGame(null,0);">let's play more!</li></ul>`;
        document.querySelector("#recordContent").innerHTML = _temporaryString;
        _temporaryString = null;
    }
    function showKlotskiRecord(_page) {
        let _temporaryString = `<h1 class="interpElem">Record of klotski</h1><hr/><ul class="recordList">`;
        let _klotskiRecord = JSON.parse(localStorage.getItem(JSON.parse(localStorage.getItem("allUsers"))["_currentUser"] + "-klotski-" + _page));
        for (i = Object.keys(_klotskiRecord.record).length - 1; i > 0; i--) {
            recordTypeKey = Object.keys(_klotskiRecord.record)[i];
            _temporaryString += `<li class="recordListChoice interpElem">
            <div>Step<hr/><strong>${_klotskiRecord.record[recordTypeKey].s}</strong></div>
            <div>Time<hr/><strong>${_klotskiRecord.record[recordTypeKey].t}</strong></div>
            <div>Width<hr/><strong>${_klotskiRecord.record[recordTypeKey].w}</strong></div>
            <div>Score<hr/><strong>${_klotskiRecord.record[recordTypeKey].bS}</strong></div>
            <div>Data<hr/><div id="recordListDateSearch" onclick="alert('Write time: ${_klotskiRecord.record[recordTypeKey].dT}')">click</div></div>
            </li>`;
        }
        _temporaryString += `<li class="recordListChoice interpElem" style="line-height:15vh" onclick="selectGame(null,'klotski');selectGame(null,0);">let's play more!</li></ul>`;
        document.querySelector("#recordContent").innerHTML = _temporaryString;
        _temporaryString = null;
    }
}
function recordNavCompute(_currentPage = 1, _showedPagesNum, _allPages) {
    console.log(_currentPage, _showedPagesNum, _allPages)
    let _lis = document.querySelectorAll(".recordNav>li>ul>li")
    if (_allPages <= 5) {
        _lis.forEach((elem, index) => elem.textContent = index + 1);
        _lis.forEach(elem => elem.style.backgroundColor = "rgba(240, 248, 255, 0.825)");
        _lis[_currentPage - 1].style.backgroundColor = "rgba(86, 66, 50, 0.375)"
    }
    if (_allPages > 5 && _currentPage <= 3) {
        _lis[0].textContent = 1;
        _lis[1].textContent = 2;
        _lis[2].textContent = 3;
        _lis[3].textContent = Math.floor((3 + Number(_allPages)) / 2);
        _lis[4].textContent = _allPages;
        _lis.forEach(elem => elem.style.backgroundColor = "rgba(240, 248, 255, 0.825)");
        _lis[_currentPage - 1].style.backgroundColor = "rgba(86, 66, 50, 0.375)"
    }
    if (_allPages > 5 && _currentPage >= _allPages - 2) {
        _lis[0].textContent = 1;
        _lis[1].textContent = Math.floor((Number(_allPages) - 1) / 2);
        _lis[2].textContent = _allPages - 2;
        _lis[3].textContent = _allPages - 1;
        _lis[4].textContent = _allPages;
        _lis.forEach(elem => elem.style.backgroundColor = "rgba(240, 248, 255, 0.825)");
        _lis[4 - (_allPages - _currentPage)].style.backgroundColor = "rgba(86, 66, 50, 0.375)"
    }
    if (_allPages > 5 && _currentPage < _allPages - 2 && _currentPage > 3) {
        _lis[0].textContent = 1;
        _lis[1].textContent = Math.floor((Number(_currentPage) + 1) / 2);
        _lis[2].textContent = _currentPage;
        _lis[3].textContent = Math.floor((Number(_currentPage) + Number(_allPages)) / 2);
        _lis[4].textContent = _allPages;
        _lis.forEach(elem => elem.style.backgroundColor = "rgba(240, 248, 255, 0.825)");
        _lis[2].style.backgroundColor = "rgba(86, 66, 50, 0.375)"
    }
}
function langChanged(type) {
    if (!isLogin) return alert("Please login to change the language.");
    let _userInfo = JSON.parse(localStorage.getItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-info`));
    _userInfo.language = type;
    localStorage.setItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-info`, JSON.stringify(_userInfo));
    // there will be a language change function in the future
    console.log(`language is changed to ${type},however, there is no language change function now`);
}
function themeChanged(type) {
    if (!isLogin) return alert("Please login to change the theme.");
    let _userInfo = JSON.parse(localStorage.getItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-info`));
    _userInfo.theme = type;
    localStorage.setItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-info`, JSON.stringify(_userInfo));
    // there will be a theme change function in the future
    console.log(`theme is changed to ${type},however, there is no theme change function now`);
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
        if (JSON.parse(localStorage.getItem("allUsers"))["_currentUser"] !== "undefined") helloPart.style.display = "block";
        else loginPart.style.display = "block";
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
    if (!type && selectGameType !== "") window.open(`./codeContent/html/${selectGameType}.html`, "_self");
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
    let _username = document.querySelector("#username").value;
    let _password = document.querySelector("#password").value;
    if (_username.replaceAll(" ", "") === "" || _password.replaceAll(" ", "") === "") return alert("Please enter your username and password.");
    try { if (JSON.parse(localStorage.getItem("allUsers"))[_username] === null || atob(JSON.parse(localStorage.getItem("allUsers"))[_username]) !== _password || _username == "_currentUser" || _username == "undefined") return alert("Username or password is incorrect or haven't registered. Please try again."); }
    catch { return alert("Username or password is incorrect or haven't registered. Please try again.."); }
    let _allUsers = JSON.parse(localStorage.getItem("allUsers"));
    _allUsers["_currentUser"] = _username;
    localStorage.setItem("allUsers", JSON.stringify(_allUsers));
    document.querySelector("#login").style.display = "none";
    document.querySelector("#hello").textContent = `Hello, ${_username}`;
    document.querySelector("#hello").style.display = "block";
    isLogin = true;
}

function register() {
    let _username = document.querySelector("#username").value;
    let _password = document.querySelector("#password").value;
    let _isUsernameExist = !!JSON.parse(localStorage.getItem("allUsers"))[_username];
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[a-zA-Z0-9]{6,}$/;
    if (_username.replaceAll(" ", "") === "" || _password.replaceAll(" ", "") === "") return alert("Please enter your username and password.");
    if (_isUsernameExist) return alert("This username already exists. Please choose another one or login this account.");
    else if (!passwordRegex.test(_password)) return alert("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
    let _allUsers = JSON.parse(localStorage.getItem("allUsers"));
    _allUsers[_username] = btoa(_password);
    localStorage.setItem("allUsers", JSON.stringify(_allUsers));
    ["game2048", "labyrinth", "mineClearance", "klotski"].forEach((elem) => {
        localStorage.setItem(`${_username}-${elem}-1`, JSON.stringify({ "gameInfo": { "totalTimes": 0, "totalPages": 1, "defaultWidth": null }, "record": { "times0": { "this one isn't a record": "undefined" } } }));
    });
    localStorage.setItem(`${_username}-info`, JSON.stringify({ "language": "English", "theme": "light" }));
    document.querySelector("#password").value = "";
    alert("you have registered successfully! Please login to continue.");
    // there will be some thing about register
}

function logout() {
    if (!isLogin) return alert("Please login to logout.");
    let _allUsers = JSON.parse(localStorage.getItem("allUsers"));
    _allUsers["_currentUser"] = "undefined";
    localStorage.setItem("allUsers", JSON.stringify(_allUsers));
    document.querySelector("#login").style.display = "block";
    document.querySelector("#hello").style.display = "none";
    isLogin = false;
}

function deleteAccount() {
    if (!isLogin) return alert("Please login to delete your account.");
    let _allUsers = JSON.parse(localStorage.getItem("allUsers"));
    ["game2048", "labyrinth", "mineClearance", "klotski"].forEach((elem) => {
        for (let i = 1; i <= JSON.parse(localStorage.getItem(`${_allUsers["_currentUser"]}-${elem}-1`)).gameInfo.totalPages; i++)
            localStorage.removeItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-${elem}-${i}`);
    });
    delete _allUsers[JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]];
    _allUsers["_currentUser"] = "undefined";
    localStorage.setItem("allUsers", JSON.stringify(_allUsers));
    localStorage.removeItem(`${JSON.parse(localStorage.getItem("allUsers"))["_currentUser"]}-info`);
    document.querySelector("#login").style.display = "block";
    document.querySelector("#hello").style.display = "none";
    isLogin = false;
}