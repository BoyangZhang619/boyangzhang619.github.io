window.onload = () => {
    boxWidth = 49;
    isStart = false;
    minElement = document.querySelectorAll(".showDiv")[0].children[0];
    secElement = document.querySelectorAll(".showDiv")[0].children[2];
    stepElement = document.querySelectorAll(".showDiv")[1].children[0];
    dyeingFunction = new Function();
    currentPoint = [null, null];
    initialCreate(boxWidth);
}
window.addEventListener("resize", () => { pageStyleFunc(boxWidth) });
window.onkeydown = function (event) {
    if (currentPoint[0] == null || currentPoint[1] == null) return;
    let key = event.code;
    switch (key) {
        case "KeyW": case "ArrowUp": go("up"); break;
        case "KeyS": case "ArrowDown": go("down"); break;
        case "KeyA": case "ArrowLeft": go("left"); break;
        case "KeyD": case "ArrowRight": go("right"); break;
    }
    console.log(`${key} pressed|time: ${new Date().toLocaleTimeString()}`);
}
class ValueError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValueError";
    }
}
function initialCreate(_width) {
    stepElement.textContent = 0;
    secElement.textContent = 0;
    minElement.textContent = 0;
    isStart = false;
    currentPoint = [null, null];
    try {
        if (_width >= 76 || _width <= 9) {
            alert("Width must be between 11 and 75.");
            throw new ValueError("Width must be between 11 and 75.")
        }
        if ((_width - 1) % 2 !== 0) {
            alert("Width must be an odd number.");
            throw new ValueError("Width must be an odd number");
        }
    } catch (error) {
        if (error instanceof ValueError)
            console.error(error.stack);
        return;
    } finally {
        document.querySelector("#boxWHnum").value = "";
    }
    document.querySelector("#box").innerHTML = ""; // Clear the previous labyrinth
    // Create the labyrinth with the given _width(height=_width)
    dataArray = new Array(_width).fill([]).map(() => new Array(_width));
    for (let i = 0; i < _width; i++)for (let j = 0; j < _width; j++)dataArray[i][j] = {
        isWall: true,
        isVisited: null,//for pathfinding algorithm
        isStartPoint: null,
        isEndPoint: null
    };
    for (let i = 0; i < _width; i++) {
        let row = document.createElement("ul");
        row.className = "labyrinthRow";
        row.id = `row-${i}`;
        document.querySelector("#box").appendChild(row);
        for (let j = 0; j < _width; j++) {
            let cell = document.createElement("li");
            cell.className = "labyrinthCell";
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
    }
    pageStyleFunc(_width);
    createLabyrinth(_width);
}
function createLabyrinth(_width) {
    // Create the labyrinth structure
    const [_startPoint, _endPoint] = createStartEnd(_width);
    dataArray[_startPoint[0]][_startPoint[1]].isStartPoint = true;
    dataArray[_endPoint[0]][_endPoint[1]].isWall = false;
    dataArray[_endPoint[0]][_endPoint[1]].isEndPoint = true;
    createPath(_width, _startPoint, _endPoint);
    // Call the pathfinding algorithm with the labyrinth data
    // pathfindingAlgorithm(dataArray, _width);
    document.querySelector("#wait").style.display = "none";
    currentPoint = _startPoint;
    dataArray[currentPoint[0]][currentPoint[1]].isVisited = "start";
}
function createStartEnd(_width) {
    let _switchNum = -1;
    do {
        _switchNum = Math.floor(Math.random() * 10)
    } while (_switchNum > 7)
    switch (_switchNum %= 4) {
        case 0: return [[1, (_width - 1) / 2], [_width - 2, (_width - 1) / 2]];//up,down
        case 1: return [[_width - 2, (_width - 1) / 2], [1, (_width - 1) / 2]];//down,up
        case 2: return [[(_width - 1) / 2, 1], [(_width - 1) / 2, _width - 2]];//left,right
        case 3: return [[(_width - 1) / 2, _width - 2], [(_width - 1) / 2, 1]];//right,left
    }
}
function createPath(_width, _startPoint, _endPoint) {
    let _currentPoint = _endPoint;
    let _path = "#";//start with "#",following 0,1,2,3 for up,down,left,right
    let _isCreating = true;
    let _switchNum = -1;
    let _pathAllowed = 1;
    let _pathAllowedNum = 0;
    do {
        console.log("path:", _path);
        console.log("current coordinate:", _currentPoint);
        //detect the quantity of path-allowed directions
        if (_currentPoint[0] > 2 && dataArray[_currentPoint[0] - 2][_currentPoint[1]].isWall) {
            _pathAllowed *= 2;
            _pathAllowedNum += 1;
        }//up
        if (_currentPoint[0] < _width - 3 && dataArray[_currentPoint[0] + 2][_currentPoint[1]].isWall) {
            _pathAllowed *= 3;
            _pathAllowedNum += 1;
        }//down
        if (_currentPoint[1] > 2 && dataArray[_currentPoint[0]][_currentPoint[1] - 2].isWall) {
            _pathAllowed *= 5;
            _pathAllowedNum += 1;
        }//left
        if (_currentPoint[1] < _width - 3 && dataArray[_currentPoint[0]][_currentPoint[1] + 2].isWall) {
            _pathAllowed *= 7;
            _pathAllowedNum += 1;
        }//right
        if (_pathAllowedNum == 0) {
            pathRetreat();
            continue;
        }
        do {
            _switchNum = Math.floor(Math.random() * 10)
        } while (_switchNum > (_pathAllowedNum * 2 - 1))
        //connect right dir and num
        //......
        let _remainder = _switchNum % _pathAllowedNum;
        [2, 3, 5, 7].forEach((elem, index) => {
            if (_pathAllowedNum !== 4 && _pathAllowed % elem !== 0) {
                _remainder = _remainder >= index ? _remainder + 1 : _remainder;
                _pathAllowedNum += 1;
            }
        });
        switch (_remainder) {
            case 0: createPathUp(); break;
            case 1: createPathDown(); break;
            case 2: createPathLeft(); break;
            case 3: createPathRight(); break;
        }
        _pathAllowed = 1;
        _pathAllowedNum = 0;
    } while (_isCreating)
    dyeingFunc();
    dyeingFunction = dyeingFunc;
    function createPathUp() {
        for (let i = 1; i <= 2; i++)dataArray[_currentPoint[0] - i][_currentPoint[1]]["isWall"] = false;
        _currentPoint[0] -= 2;
        _path += "0";
    }
    function createPathDown() {
        for (let i = 1; i <= 2; i++)dataArray[_currentPoint[0] + i][_currentPoint[1]]["isWall"] = false;
        _currentPoint[0] += 2;
        _path += "1";
    }
    function createPathLeft() {
        for (let i = 1; i <= 2; i++)dataArray[_currentPoint[0]][_currentPoint[1] - i]["isWall"] = false;
        _currentPoint[1] -= 2;
        _path += "2";
    }
    function createPathRight() {
        for (let i = 1; i <= 2; i++)dataArray[_currentPoint[0]][_currentPoint[1] + i]["isWall"] = false;
        _currentPoint[1] += 2;
        _path += "3";
    }
    //obviously,these above four funcs could be replaced to a more complex func,for easier maintain,we dont use that
    function pathRetreat() {
        switch (_path[_path.length - 1]) {
            case "0": _currentPoint[0] += 2; _path = _path.slice(0, -1); break;
            case "1": _currentPoint[0] -= 2; _path = _path.slice(0, -1); break;
            case "2": _currentPoint[1] += 2; _path = _path.slice(0, -1); break;
            case "3": _currentPoint[1] -= 2; _path = _path.slice(0, -1); break;
            case "#": _isCreating = false; break;
        }
    }
    function dyeingFunc() {
        for (let i = 0; i < _width; i++) {
            for (let j = 0; j < _width; j++) {
                if (dataArray[i][j].isStartPoint) {
                    document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgb(142, 129, 35)"
                    document.querySelector(`#cell-${i}-${j}`).innerText = "S";
                } else if (dataArray[i][j].isEndPoint) {
                    document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgb(86, 66, 50)"
                    document.querySelector(`#cell-${i}-${j}`).innerText = "E";
                } else if (dataArray[i][j].isWall) {
                    document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgba(86, 66, 50, 0.685)"
                } else if (dataArray[i][j].isVisited) {
                    document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgba(175, 161, 58, 0.5)"
                } else {
                    [
                        ["backgroundColor", "rgb(248, 247, 240)"],
                        ["innerText", dataArray[i][j].isStartPoint ? "S" : dataArray[i][j].isEndPoint ? "E" : dataArray[i][j].isVisited ? _path : ""]
                    ].forEach(([key, value]) => { document.querySelector(`#cell-${i}-${j}`).style[key] = value; });
                }
            }
        }
    }
}
function pageStyleFunc(_width) {
    console.log(_width)
    if (parseInt(window.getComputedStyle(document.querySelector("#main").children[0]).width) < parseInt(window.getComputedStyle(document.querySelector("#main").children[0]).height)) {
        [["--width", _width], ["--paramA", 0], ["--paramB", 70]].forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });
    } else {
        [["--width", _width], ["--paramA", 100], ["--paramB", -7.5]].forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });
    }
}
function go(_direction) {
    isStart = isStart ? isStart : true;
    // check if the point have arrived at the end point
    if (dataArray[currentPoint[0]][currentPoint[1]].isEndPoint) {
        alert("You have reached the end point!");
        infoT();
        isStart = false;
        return;
    }
    switch (_direction) {
        case "up":
            if (dataArray[currentPoint[0] - 1][currentPoint[1]].isWall) return;
            dataArray[currentPoint[0] - 1][currentPoint[1]].isVisited = "up";
            stepElement.textContent -= -1;
            currentPoint[0] -= 1;
            dyeingFunction();
            break;
        case "down":
            if (dataArray[currentPoint[0] + 1][currentPoint[1]].isWall) return;
            dataArray[currentPoint[0] + 1][currentPoint[1]].isVisited = "down";
            stepElement.textContent -= -1;
            currentPoint[0] += 1;
            dyeingFunction();
            break;
        case "left":
            if (dataArray[currentPoint[0]][currentPoint[1] - 1].isWall) return;
            dataArray[currentPoint[0]][currentPoint[1] - 1].isVisited = "left";
            stepElement.textContent -= -1;
            currentPoint[1] -= 1;
            dyeingFunction();
            break;
        case "right":
            if (dataArray[currentPoint[0]][currentPoint[1] + 1].isWall) return;
            dataArray[currentPoint[0]][currentPoint[1] + 1].isVisited = "right";
            stepElement.textContent -= -1;
            currentPoint[1] += 1;
            dyeingFunction();
            break;
    }
}

function restart() {
    document.querySelector("#box").innerHTML = ""; // Clear the previous labyrinth
    initialCreate(boxWidth);
}

function infoT() {
    let times = Object.keys(infoTransfer.gI.labyrinth).length;
    infoTransfer.gI.labyrinth[`c${times}`] = {
        "s": +stepElement.textContent,//step
        "t": +minElement.textContent * 60 - -secElement.textContent,//time
        "mN": null,//max number
        "bS": null,//best score
        "iS": 1,//is start
        "iO": 1,//is over 
        // "dA": JSON.stringify(dataArray),//data array//too much data
    }
}

function pause() {
    isStart = isStart ? false : true;
}

function timerFunc(){
    if(!isStart) return;
    secElement.textContent -= -1;
    if (secElement.textContent == 60) {
        secElement.textContent = 0;
        minElement.textContent -= -1;
    }
}
timer = setInterval(timerFunc, 1000);