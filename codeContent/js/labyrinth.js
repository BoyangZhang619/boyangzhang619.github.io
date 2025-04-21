window.onload = () => {
    initialCreate(49)
}
class ValueError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValueError";
    }
}
function initialCreate(_width) {
    try {
        if (_width >= 200 || _width <= 9) {
            alert("Width must be between 11 and 199.");
            throw new ValueError("Width must be between 11 and 199.")
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
        // document.querySelector("#box").appendChild(document.querySelector(".labyrinthRow"));
    }
    mainTagElement = document.querySelector("#main");
    liElements = document.querySelectorAll(".labyrinthCell");
    pageStyleFunc(_width);
    createLabyrinth(_width);
}
function createLabyrinth(_width) {
    // Create the labyrinth structure
    const [_startPoint, _endPoint] = createStartEnd(_width);
    dataArray[_startPoint[0]][_startPoint[1]].isStartPoint = true;
    dataArray[_startPoint[0]][_startPoint[1]].isWall = false;
    dataArray[_endPoint[0]][_endPoint[1]].isEndPoint = true;
    createPath(_width, _startPoint, _endPoint);
    // Call the pathfinding algorithm with the labyrinth data
    // pathfindingAlgorithm(dataArray, _width);
    document.querySelector("#wait").style.display = "none";
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
    let _currentPoint = _startPoint;
    let _path = "#";//start with "#",following 0,1,2,3 for up,down,left,right
    let _isCreating = true;
    let _switchNum = -1;
    let _pathAllowed = 1;
    let _pathAllowedNum = 0;
    do {
        console.log("path:",_path);
        console.log("current coordinate:",_currentPoint);
        //detect the quantity of path-allowed directions
        if (_currentPoint[0] > 1 && dataArray[_currentPoint[0] - 2][_currentPoint[1]].isWall) {
            _pathAllowed *= 2;
            _pathAllowedNum += 1;
        }//up
        if (_currentPoint[0] < _width - 2 && dataArray[_currentPoint[0] + 2][_currentPoint[1]].isWall) {
            _pathAllowed *= 3;
            _pathAllowedNum += 1;
        }//down
        if (_currentPoint[1] > 1 && dataArray[_currentPoint[0]][_currentPoint[1] - 2].isWall) {
            _pathAllowed *= 5;
            _pathAllowedNum += 1;
        }//left
        if (_currentPoint[1] < _width - 2 && dataArray[_currentPoint[0]][_currentPoint[1] + 2].isWall) {
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
                if (dataArray[i][j].isWall) {
                    document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgb(248, 247, 240)";
                    document.querySelector(`#cell-${i}-${j}`).style.color = "rgba(86, 66, 50, 0.685)";
                    document.querySelector(`#cell-${i}-${j}`).innerText = "";
                } else {
                    document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgba(86, 66, 50, 0.685)";
                    document.querySelector(`#cell-${i}-${j}`).style.color = "rgb(248, 247, 240)";
                    document.querySelector(`#cell-${i}-${j}`).innerText = dataArray[i][j].isStartPoint ? "S" : dataArray[i][j].isEndPoint ? "E" : dataArray[i][j].isVisited ? _path : "";
                }
            }
        }
    }
    dyeingFunc();
}
function pageStyleFunc(_width) {
    if (parseInt(window.getComputedStyle(mainTagElement.children[0]).width) < parseInt(window.getComputedStyle(mainTagElement.children[0]).height)) {
        document.querySelectorAll("#box>ul").forEach(elem => elem.style.height = `${70 / _width}vw`)
        liElements.forEach(elem => elem.style.width = elem.style.lineHeight = `${70 / _width}vw`);//70vw / width
        liElements.forEach(elem => elem.style.fontSize = `${70 / _width}vw`);// 1/3 of 17.5vw
    } else {
        document.querySelectorAll("#box>ul").forEach(elem => elem.style.height = `calc(${100 / _width}vh - ${7.5 / _width}vw)`)
        liElements.forEach(elem => elem.style.width = elem.style.lineHeight = `calc(${100 / _width}vh - ${7.5 / _width}vw)`);//(100vh - 7.5vw) / width
        liElements.forEach(elem => elem.style.fontSize = `calc(${100 / (_width * 3)}vh - ${7.5 / (_width * 3)}vw)`);// 1/3 of (100vh - 7.5vw)/width
    }
}