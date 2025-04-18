window.onload = function () {
    for (let i = 0; i < 16; i++) document.querySelector("#box2048").innerHTML += "<li></li>";
    liElements = document.querySelectorAll("#box2048>li");
    mainTagElement = document.querySelector("#main");
    minElement = document.querySelectorAll(".showDiv")[0].children[0];
    secElement = document.querySelectorAll(".showDiv")[0].children[2];
    stepElement = document.querySelectorAll(".showDiv")[1].children[0];
    [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)].forEach(position => dataArray[Math.floor(position / 4)][position % 4] = Math.ceil(Math.random() * 10) * 2 % 4 + 2);
    console.log("dataArray", dataArray);
    assignFunc(liElements);
    pageStyleFunc();
    dyeingFunc(liElements);
    // game2048Algorithm(dataArray)
    // info = navigator.userAgent;
    // isPhone = /mobile/i.test(info); // if it's a mobile device, isPhone = true
}

window.onkeyup = function (event) {
    let key = event.code;
    switch (key) {
        case "KeyW": case "ArrowUp": dirFunc("up"); break;
        case "KeyS": case "ArrowDown": dirFunc("down"); break;
        case "KeyA": case "ArrowLeft": dirFunc("left"); break;
        case "KeyD": case "ArrowRight": dirFunc("right"); break;
    }
    console.log(`${key} pressed|time: ${new Date().toLocaleTimeString()}`);
}

window.addEventListener("resize", pageStyleFunc);

dataArray = new Array(4).fill(["", "", "", ""])
let liBGC = { "2": "198, 202, 185, .3", "4": "186, 188, 170, .3", "8": "173, 164, 155, .3", "16": "161, 150, 140, .3", "32": "148, 136, 125, .3", "64": "136, 122, 110, .3", "128": "123, 108, 95, .3", "256": "111, 94, 80, .3", "512": "98, 80, 65, .3", "1024": "86, 66, 50, .3", "": "86, 66, 50, .3" };
currentScore = 0;
currentMaxNumber = 0;
isstart = false;

function dirFunc(_dir) {
    // move the numbers in the array according to the direction
    if (!isstart) isstart = true;
    if (["up", "down", "left", "right"].includes(_dir)) stepElement.textContent -= -1;
    switch (_dir) {
        case "up": dirUp(); break;
        case "down": dirDown(); break;
        case "left": dirLeft(); break;
        case "right": dirRight(); break;
    }
    function dirUp() {
        for (let levelA = 0; levelA < 4; levelA++) {
            for (let levelB = 0; levelB < 3; levelB++) {
                for (let levelC = 0; levelC < 3 - levelB; levelC++) {
                    if (dataArray[levelB][levelA] == dataArray[levelB + levelC + 1][levelA] && dataArray[levelB][levelA] != "") {
                        dataArray[levelB][levelA] *= 2;
                        currentScore -= -dataArray[levelB][levelA];
                        currentMaxNumber = Math.max(currentMaxNumber, dataArray[levelB][levelA]);
                        dataArray[levelB + levelC + 1][levelA] = "";
                        levelB++;
                        break;
                    }
                    if (dataArray[levelB][levelA] != "" && dataArray[levelB + levelC + 1][levelA] != "") break;
                }
            }
        }
        for (let levelC = 0; levelC < 3; levelC++)
            for (let levelA = 0; levelA < 4; levelA++)
                for (let levelB = 0; levelB < 3; levelB++) {
                    if (dataArray[levelB][levelA] != "") {
                        dataArray[levelB][levelA] = dataArray[levelB][levelA]
                    } else {
                        dataArray[levelB][levelA] = dataArray[levelB + 1][levelA];
                        dataArray[levelB + 1][levelA] = "";
                    }
                }
    }

    function dirDown() {
        for (let levelA = 0; levelA < 4; levelA++) {
            for (let levelB = 3; levelB > 0; levelB--) {
                for (let levelC = 0; levelC < levelB; levelC++) {
                    if (dataArray[levelB][levelA] == dataArray[levelB - levelC - 1][levelA] && dataArray[levelB][levelA] != "") {
                        dataArray[levelB][levelA] *= 2;
                        currentScore -= -dataArray[levelB][levelA];
                        currentMaxNumber = Math.max(currentMaxNumber, dataArray[levelB][levelA]);
                        dataArray[levelB - levelC - 1][levelA] = "";
                        levelB--;
                        break;
                    }
                    if (dataArray[levelB][levelA] != "" && dataArray[levelB - levelC - 1][levelA] != "") break;
                }
            }
        }
        for (let levelC = 0; levelC < 3; levelC++)
            for (let levelA = 0; levelA < 4; levelA++)
                for (let levelB = 3; levelB > 0; levelB--) {
                    if (dataArray[levelB][levelA] != "") {
                        dataArray[levelB][levelA] = dataArray[levelB][levelA]
                    } else {
                        dataArray[levelB][levelA] = dataArray[levelB - 1][levelA];
                        dataArray[levelB - 1][levelA] = "";
                    }
                }
    }
    function dirLeft() {
        for (let levelA = 0; levelA < 4; levelA++) {
            for (let levelB = 0; levelB < 3; levelB++) {
                for (let levelC = 0; levelC < 3 - levelB; levelC++) {
                    if (dataArray[levelA][levelB] == dataArray[levelA][levelB + levelC + 1] && dataArray[levelA][levelB] != "") {
                        dataArray[levelA][levelB] *= 2;
                        currentScore -= -dataArray[levelB][levelA];
                        currentMaxNumber = Math.max(currentMaxNumber, dataArray[levelB][levelA]);
                        dataArray[levelA][levelB + levelC + 1] = "";
                        levelB++;
                        break;
                    }
                    if (dataArray[levelA][levelB] != "" && dataArray[levelA][levelB + levelC + 1] != "") break;
                }
            }
        }
        for (let levelC = 0; levelC < 3; levelC++)
            for (let levelA = 0; levelA < 4; levelA++)
                for (let levelB = 0; levelB < 3; levelB++) {
                    if (dataArray[levelA][levelB] != "") {
                        dataArray[levelA][levelB] = dataArray[levelA][levelB]
                    } else {
                        dataArray[levelA][levelB] = dataArray[levelA][levelB + 1];
                        dataArray[levelA][levelB + 1] = "";
                    }
                }
    }
    function dirRight() {
        for (let levelA = 0; levelA < 4; levelA++) {
            for (let levelB = 3; levelB > 0; levelB--) {
                for (let levelC = 0; levelC < levelB; levelC++) {
                    if (dataArray[levelA][levelB] == dataArray[levelA][levelB - levelC - 1] && dataArray[levelA][levelB] != "") {
                        dataArray[levelA][levelB] *= 2;
                        currentScore -= -dataArray[levelB][levelA];
                        currentMaxNumber = Math.max(currentMaxNumber, dataArray[levelB][levelA]);
                        dataArray[levelA][levelB - levelC - 1] = "";
                        levelB--;
                        break;
                    }
                    if (dataArray[levelA][levelB] != "" && dataArray[levelA][levelB - levelC - 1] != "") break;
                }
            }
        }
        for (let levelC = 0; levelC < 3; levelC++)
            for (let levelA = 0; levelA < 4; levelA++)
                for (let levelB = 3; levelB > 0; levelB--) {
                    if (dataArray[levelA][levelB] != "") {
                        dataArray[levelA][levelB] = dataArray[levelA][levelB]
                    } else {
                        dataArray[levelA][levelB] = dataArray[levelA][levelB - 1];
                        dataArray[levelA][levelB - 1] = "";
                    }
                }
    }
    // plus the new numbers to the array
    let emptyAmount = 0;
    let emptyAmountClone = 0;
    for (let i = 0; i < 16; i++)if (dataArray[Math.floor(i / 4)][i % 4] == "") emptyAmount++;
    emptyAmountClone = emptyAmount ? emptyAmount : 0;
    if (emptyAmount == 0) emptyAmountClone = 0;

    emptyAmount -= Math.ceil(Math.random() * emptyAmount);
    for (let i = 0; i < 16; i++) {
        if (dataArray[Math.floor(i / 4)][i % 4] == "") {
            if (emptyAmount == 0) {
                dataArray[Math.floor(i / 4)][i % 4] = Math.ceil(Math.random() * 10) * 2 % 4 + 2;
                break;
            }
            emptyAmount--;
        }
    }
    // assign the numbers to the li elements
    assignFunc(liElements);
    // dye the li elements according to the numbers
    dyeingFunc(liElements);
    // check if the game is over
    if (emptyAmountClone == 0) isover();
}

function dyeingFunc(liElements) {
    liElements.forEach(elem => {
        if (elem.textContent in liBGC) elem.style.backgroundColor = `rgba(${liBGC[elem.textContent]})`;
    })
}

function assignFunc(liElements) {
    for (let i = 0; i < 16; i++)  liElements[i].textContent = dataArray[Math.floor(i / 4)][i % 4];
}

function isover() {
    for (let levelA = 0; levelA < 4; levelA++)for (let levelB = 0; levelB < 3; levelB++) {
        if (dataArray[levelA][levelB] == dataArray[levelA][levelB + 1]) return;
        if (dataArray[levelB][levelA] == dataArray[levelB + 1][levelA]) return;
        if (levelA == 3 && levelB == 2) {
            alert("Game over");
            infoT();
            console.log(infoTransfer);
            isstart = false;
            break;
        }
    }
}

function pageStyleFunc() {
    if (parseInt(window.getComputedStyle(mainTagElement.children[0]).width) < parseInt(window.getComputedStyle(mainTagElement.children[0]).height)) {
        liElements.forEach(elem => elem.style.width = elem.style.lineHeight = "17.5vw");//70vw / 4
        liElements.forEach(elem => elem.style.fontSize = "calc(17.5vw / 3)");// 1/3 of 17.5vw
    } else {
        liElements.forEach(elem => elem.style.width = elem.style.lineHeight = "calc(25vh - 1.875vw)");//(100vh - 7.5vw) / 4
        liElements.forEach(elem => elem.style.fontSize = "calc((25vh - 1.875vw) / 3)");// 1/3 of 25vh - 1.875vw
    }
}

function restart() {
    for (i = 0, dataArray = []; i < 4; dataArray[i] = ["", "", "", ""], i++);
    [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)].forEach(position => dataArray[Math.floor(position / 4)][position % 4] = Math.ceil(Math.random() * 10) * 2 % 4 + 2);
    console.log("restart:dataArray", dataArray);
    assignFunc(liElements);
    pageStyleFunc();
    dyeingFunc(liElements);
    isstart = false;
    secElement.textContent = 0;
    minElement.textContent = 0;
    stepElement.textContent = 0;
    currentMaxNumber = 0;
    currentScore = 0;
}

function infoT() {
    let times = Object.keys(infoTransfer.gI.game2048).length;
    infoTransfer.gI.game2048[`c${times}`] = {
        "s": +stepElement.textContent,//step
        "t": +minElement.textContent * 60 - -secElement.textContent,//time
        "mN": currentMaxNumber,//max number
        "bS": currentScore,//best score
        "iS": 1,//is start
        "iO": 1,//is over 
        "dA": JSON.stringify(dataArray),//data array
    }
}

function pause() {
    isstart = isstart ? false : true;
}

let timer = setInterval(() => {
    if (isstart) {
        secElement.textContent -= -1;
        if (secElement.textContent == 60) {
            secElement.textContent = 0;
            minElement.textContent -= -1;
        }
    }
}, 1000);