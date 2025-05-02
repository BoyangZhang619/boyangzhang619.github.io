window.onload = () => {
    boxWidth = 10;// means 25 blocks in a row and 25 blocks in a column
    minesCount = 16;// means 49 mines in total
    creatingBoxIndex = 0;
    isMapCreated = false;
    isClickAllowed = true;
    isDbClickAllowed = false;
    isRightClickAllowed = false;
    initialCreate(boxWidth);
}
window.addEventListener("resize", () => { pageStyleFunc(boxWidth) });
document.querySelector("#box").addEventListener("click", (event) => {
    console.log("click");
    event.preventDefault();
    if (!isClickAllowed) return;
    if (event.target.className == "cell") {
        let cellId = event.target.id.split("-");
        let row = parseInt(cellId[1]);
        let column = parseInt(cellId[2]);
        if (!isMapCreated) return createMineMap(row, column);
        if (dataArray[row][column].isShow || dataArray[row][column].isFlagged || dataArray[row][column].isQuestion) return;
        if (dataArray[row][column].isMine) alert("Game Over!");
        if (dataArray[row][column].isMine) return isGameOver("gameover");
        showEmpty(row, column);
        isGameOver();
    }
});

document.querySelector("#box").addEventListener("dblclick", (event) => {
    console.log("dbclick");
    event.preventDefault();
    if (!isDbClickAllowed) return;
    if (event.target.className == "cell") {
        let cellId = event.target.id.split("-");
        let row = parseInt(cellId[1]);
        let column = parseInt(cellId[2]);
        console.log(row, column);
        if (dataArray[row][column].isShow == true) {
            let mineCount = 0;
            if (row > 0 && column > 0) if (dataArray[row - 1][column - 1].isFlagged) mineCount++;
            if (row > 0) if (dataArray[row - 1][column].isFlagged) mineCount++;
            if (row > 0 && column < boxWidth - 1) if (dataArray[row - 1][column + 1].isFlagged) mineCount++;
            if (column > 0) if (dataArray[row][column - 1].isFlagged) mineCount++;
            if (column < boxWidth - 1) if (dataArray[row][column + 1].isFlagged) mineCount++;
            if (row < boxWidth - 1 && column > 0) if (dataArray[row + 1][column - 1].isFlagged) mineCount++;
            if (row < boxWidth - 1) if (dataArray[row + 1][column].isFlagged) mineCount++;
            if (row < boxWidth - 1 && column < boxWidth - 1) if (dataArray[row + 1][column + 1].isFlagged) mineCount++;
            if (mineCount == dataArray[row][column].isNumber) {
                if (row > 0 && column > 0) if (dataArray[row - 1][column - 1].isShow == null && dataArray[row - 1][column - 1].isFlagged != true) showEmpty(row - 1, column - 1);
                if (row > 0) if (dataArray[row - 1][column].isShow == null && dataArray[row - 1][column].isFlagged != true) showEmpty(row - 1, column);
                if (row > 0 && column < boxWidth - 1) if (dataArray[row - 1][column + 1].isShow == null && dataArray[row - 1][column + 1].isFlagged != true) showEmpty(row - 1, column + 1);
                if (column > 0) if (dataArray[row][column - 1].isShow == null && dataArray[row][column - 1].isFlagged != true) showEmpty(row, column - 1);
                if (column < boxWidth - 1) if (dataArray[row][column + 1].isShow == null && dataArray[row][column + 1].isFlagged != true) showEmpty(row, column + 1);
                if (row < boxWidth - 1 && column > 0) if (dataArray[row + 1][column - 1].isShow == null && dataArray[row + 1][column - 1].isFlagged != true) showEmpty(row + 1, column - 1);
                if (row < boxWidth - 1) if (dataArray[row + 1][column].isShow == null && dataArray[row + 1][column].isFlagged != true) showEmpty(row + 1, column);
                if (row < boxWidth - 1 && column < boxWidth - 1) if (dataArray[row + 1][column + 1].isShow == null && dataArray[row + 1][column + 1].isFlagged != true) showEmpty(row + 1, column + 1);
            }
        }
    }
});

document.querySelector("#box").addEventListener("contextmenu", (event) => {
    event.preventDefault();
    if (!isRightClickAllowed) return;
    if (event.target.className == "cell") {
        if (!isMapCreated) return;
        let cellId = event.target.id.split("-");
        let row = parseInt(cellId[1]);
        let column = parseInt(cellId[2]);
        if (dataArray[row][column].isShow == true) return;
        if (dataArray[row][column].isFlagged == null && dataArray[row][column].isFlagged == null && dataArray[row][column].isQuestion == null) {
            dataArray[row][column].isFlagged = true;
            document.querySelector(`#cell-${row}-${column}`).textContent = "🚩";
        } else if (dataArray[row][column].isFlagged == true && dataArray[row][column].isQuestion == null) {
            dataArray[row][column].isQuestion = true;
            dataArray[row][column].isFlagged = null;
            document.querySelector(`#cell-${row}-${column}`).textContent = "❓";
        } else if (dataArray[row][column].isQuestion == true) {
            dataArray[row][column].isQuestion = null;
            document.querySelector(`#cell-${row}-${column}`).textContent = "";
        }
    }
})

function initialCreate(_width,_setOfWidthAndMinesCount = null) {
    if(_width === null){
        _setOfWidthAndMinesCount = _setOfWidthAndMinesCount.split(",");
        boxWidth = parseInt(_setOfWidthAndMinesCount[0]);
        minesCount = parseInt(_setOfWidthAndMinesCount[1]);
        _width = boxWidth;
    }
    dataArray = new Array(_width).fill([]).map(() => new Array(_width));
    for (let i = 0; i < _width; i++)for (let j = 0; j < _width; j++)dataArray[i][j] = {
        isEmpty: null,
        isNumber: null,
        isMine: null,
        isFlagged: null,
        isShow: null,
        isQuestion: null
    };
    document.querySelector("#box").innerHTML = "";
    creatingBoxIndex = 0;
    let promise = new Promise(resolve => {
        setTimeout(() => resolve())
    });
    promise.then(creatingBlocks());
    function creatingBlocks() {
        console.log(boxWidth);
        document.querySelector("#wait").textContent = `Please Wait A Moment(${((creatingBoxIndex + 1) / boxWidth * 100).toFixed(0)}%)`;
        let row = document.createElement("ul");
        row.className = "row";
        row.id = `row-${creatingBoxIndex}`;
        for (let i = 0; i < boxWidth; i++) {
            let cell = document.createElement("li");
            cell.className = "cell";
            cell.id = `cell-${creatingBoxIndex}-${i}`;
            row.appendChild(cell);
        }
        document.querySelector("#box").appendChild(row);
        for (let i = 0; i < boxWidth; i++) {
            document.querySelector(`#cell-${creatingBoxIndex}-${i}`).style.backgroundColor = "rgb(132, 117, 106)";
        }
        creatingBoxIndex++;
        if (creatingBoxIndex < boxWidth) {
            setTimeout(creatingBlocks, 0);
        } else {
            document.querySelector("#wait").style.display = "none";
            document.querySelector("#box").style.display = "block";
            pageStyleFunc(boxWidth);
        }
    }
}

function createMineMap(_row, _column) {
    // make sure the first click is not a mine
    if (_row > 0 && _column > 0) for (let i = _row - 1; i <= _row; i++) for (let j = _column - 1; j <= _column; j++)  dataArray[i][j].isMine = false;
    if (_row > 0 && _column < boxWidth - 1) for (let i = _row - 1; i <= _row; i++) for (let j = _column; j <= _column + 1; j++)dataArray[i][j].isMine = false;
    if (_row < boxWidth - 1 && _column > 0) for (let i = _row; i <= _row + 1; i++) for (let j = _column - 1; j <= _column; j++)dataArray[i][j].isMine = false;
    if (_row < boxWidth - 1 && _column < boxWidth - 1) for (let i = _row; i <= _row + 1; i++) for (let j = _column; j <= _column + 1; j++)dataArray[i][j].isMine = false;
    // create mines
    let unputtedMines = minesCount;
    do {
        let currentRow = Math.floor(Math.random() * boxWidth);
        let currentColumn = Math.floor(Math.random() * boxWidth);
        if (dataArray[currentRow][currentColumn].isMine == null) {
            dataArray[currentRow][currentColumn].isMine = true;
            unputtedMines--;
        }
    } while (unputtedMines > 0)
    // create numbers
    for (let i = 0; i < boxWidth; i++) {
        for (let j = 0; j < boxWidth; j++) {
            if (!dataArray[i][j].isMine) {
                let mineCount = 0;
                if (i > 0 && j > 0) if (dataArray[i - 1][j - 1].isMine) mineCount++;
                if (i > 0) if (dataArray[i - 1][j].isMine) mineCount++;
                if (i > 0 && j < boxWidth - 1) if (dataArray[i - 1][j + 1].isMine) mineCount++;
                if (j > 0) if (dataArray[i][j - 1].isMine) mineCount++;
                if (j < boxWidth - 1) if (dataArray[i][j + 1].isMine) mineCount++;
                if (i < boxWidth - 1 && j > 0) if (dataArray[i + 1][j - 1].isMine) mineCount++;
                if (i < boxWidth - 1) if (dataArray[i + 1][j].isMine) mineCount++;
                if (i < boxWidth - 1 && j < boxWidth - 1) if (dataArray[i + 1][j + 1].isMine) mineCount++;
                if (mineCount == 0) {
                    dataArray[i][j].isEmpty = true;
                    continue;
                }
                dataArray[i][j].isNumber = mineCount;
            }
        }
    }
    isMapCreated = true;
    isDbClickAllowed = true;
    isRightClickAllowed = true;
    showEmpty(_row, _column);
    isGameOver();
}

function showEmpty(_row, _column) {
    if (dataArray[_row][_column].isMine) alert("Game Over!2");
    if (dataArray[_row][_column].isMine) return isGameOver("gameover");
    if (dataArray[_row][_column].isNumber) {
        document.querySelector(`#cell-${_row}-${_column}`).textContent = dataArray[_row][_column].isNumber;
        document.querySelector(`#cell-${_row}-${_column}`).style.backgroundColor = "rgb(248, 247, 240)";
    }
    showEmptyRecursion(_row, _column);
    function showEmptyRecursion(_row, _column) {
        if (dataArray[_row][_column].isShow) return;
        dataArray[_row][_column].isShow = true;
        document.querySelector(`#cell-${_row}-${_column}`).style.backgroundColor = "rgb(248, 247, 240)";
        if (dataArray[_row][_column].isNumber) {
            document.querySelector(`#cell-${_row}-${_column}`).textContent = dataArray[_row][_column].isNumber;
            return;
        }
        if (_row > 0 && _column > 0) showEmptyRecursion(_row - 1, _column - 1);
        if (_row > 0) showEmptyRecursion(_row - 1, _column);
        if (_row > 0 && _column < boxWidth - 1) showEmptyRecursion(_row - 1, _column + 1);
        if (_column > 0) showEmptyRecursion(_row, _column - 1);
        if (_column < boxWidth - 1) showEmptyRecursion(_row, _column + 1);
        if (_row < boxWidth - 1 && _column > 0) showEmptyRecursion(_row + 1, _column - 1);
        if (_row < boxWidth - 1) showEmptyRecursion(_row + 1, _column);
        if (_row < boxWidth - 1 && _column < boxWidth - 1) showEmptyRecursion(_row + 1, _column + 1);
    }
}

function showAll() {
    for (let i = 0; i < boxWidth; i++) for (let j = 0; j < boxWidth; j++) {
        dataArray[i][j].isShow = true;
        document.querySelector(`#cell-${i}-${j}`).style.backgroundColor = "rgb(248, 247, 240)";
        if (dataArray[i][j].isMine) document.querySelector(`#cell-${i}-${j}`).textContent = "💣";
        else if (dataArray[i][j].isNumber !== null) document.querySelector(`#cell-${i}-${j}`).textContent = dataArray[i][j].isNumber;
    }
}
function isGameOver(_result = null) {
    if (_result === "gameover") {
        showAll();
        alert("Game Over!");
    }
    if (_result === null) {
        let isAllShow = true;
        for (let i = 0; i < boxWidth; i++) {
            for (let j = 0; j < boxWidth; j++) {
                if (dataArray[i][j].isShow == null && !dataArray[i][j].isMine) {
                    isAllShow = false;
                    break;
                }
            }
            if (!isAllShow) break;
        }
        if (isAllShow) {
            showAll();
            alert("You Win!");
        }
    }
}
function pageStyleFunc(_width) {
    if (parseInt(window.getComputedStyle(document.querySelector("#main").children[0]).width) < parseInt(window.getComputedStyle(document.querySelector("#main").children[0]).height)) {
        document.querySelector("#box").style.margin = "calc(50vh - 38.75vw) auto";
        [["--width", _width], ["--paramA", 0], ["--paramB", 70]].forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });
    } else {
        document.querySelector("#box").style.margin = "0 auto";
        [["--width", _width], ["--paramA", 100], ["--paramB", -7.5]].forEach(([key, value]) => { document.documentElement.style.setProperty(key, value); });
    }
}