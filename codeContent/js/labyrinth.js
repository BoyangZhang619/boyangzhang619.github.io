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
    dataArray = new Array(_width).fill([]).map(() => new Array(_width).fill({
        isWall: true,
        isVisited: null,
        isStartPoint: null,
        isEndPoint: null
    }));
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
    console.log("vreateStartEnd", _switchNum);
    switch (_switchNum %= 4) {
        case 0: return [[1, (_width + 1) / 2], [_width - 2, (_width + 1) / 2]];//up,down
        case 1: return [[_width - 2, (_width + 1) / 2], [1, (_width + 1) / 2]];//down,up
        case 2: return [[(_width + 1) / 2, 1], [(_width + 1) / 2, _width - 2]];//left,right
        case 3: return [[(_width + 1) / 2, _width - 2], [(_width + 1) / 2, 1]];//right,left
    }
}
function createPath(_width, _startPoint, _endPoint) {
    let _currentPoint = _startPoint;
    let _switchNum = -1;
    let _pathAllowed = 1;
    let _pathAllowedNum = 0;
    do {
        //detect the quantity of path-allowed directions
        if (_currentPoint[0] > 1) {
            _pathAllowed *= 2;
            _pathAllowedNum += 1;
        }//up
        if (_currentPoint[0] < _width - 2) {
            _pathAllowed *= 3;
            _pathAllowedNum += 1;
        }//down
        if (_currentPoint[1] > 1) {
            _pathAllowed *= 5;
            _pathAllowedNum += 1;
        }//left
        if (_currentPoint[1] < _width - 2) {
            _pathAllowed *= 7;
            _pathAllowedNum += 1;
        }//right
        do {
            _switchNum = Math.floor(Math.random() * 10)
        } while (_switchNum > (_pathAllowedNum * 2 - 1))
        console.log("createPath:", _switchNum);
        //connect right dir and num
        //......
        switch (_switchNum %= _pathAllowedNum) {
            case 0: createPathUp(); break;
            case 1: createPathDown(); break;
            case 2: createPathLeft(); break;
            case 3: createPathRight(); break;
        }
        _pathAllowed = 0;
    } while (true)


    function createPathUp(params) {
        if (_currentPoint[0] > 1) {//make sure that current point isnt at edge
            _currentPoint[0] -= 2;
            for (let i = 1; i <= 2; i++)dataArray[_currentPoint[0] - i][_currentPoint[1]].isWall = false;
        }
    }
    function createPathDown(params) {

    }
    function createPathLeft(params) {

    }
    function createPathRight(params) {

    }
    function switchNumRevalue(_times, _allowedDir) {

    }
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