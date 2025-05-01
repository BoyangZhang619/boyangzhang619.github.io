window.onload = () => {
    boxWidth = 50;// means 25 blocks in a row and 25 blocks in a column
    minesCount = 300;// means 99 mines in total
    creatingBoxIndex = 0;
    isMapCreated = false;
    initialCreate(boxWidth);
}

window.addEventListener("resize", () => { pageStyleFunc(boxWidth) });
document.querySelector("#box").addEventListener("click", (event) => {
    if (event.target.className == "cell") {
        let cellId = event.target.id.split("-");
        let row = parseInt(cellId[1]);
        let column = parseInt(cellId[2]);
        if (dataArray[row][column].isEmpty == null) {
            dataArray[row][column].isEmpty = true;
            if (!isMapCreated) createMineMap(row, column);
        } else if (dataArray[row][column].isEmpty == true) {
            dataArray[row][column].isEmpty = false;
        }
    }
});
window.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    if (event.target.className == "cell") {
        if (!isMapCreated) return;
        let cellId = event.target.id.split("-");
        let row = parseInt(cellId[1]);
        let column = parseInt(cellId[2]);
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
function initialCreate(_width) {
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
            if (dataArray[i][j].isMine == null) {
                let mineCount = 0;
                if (i > 0 && j > 0) if (dataArray[i - 1][j - 1].isMine) mineCount++;
                if (i > 0) if (dataArray[i - 1][j].isMine) mineCount++;
                if (i > 0 && j < boxWidth - 1) if (dataArray[i - 1][j + 1].isMine) mineCount++;
                if (j > 0) if (dataArray[i][j - 1].isMine) mineCount++;
                if (j < boxWidth - 1) if (dataArray[i][j + 1].isMine) mineCount++;
                if (i < boxWidth - 1 && j > 0) if (dataArray[i + 1][j - 1].isMine) mineCount++;
                if (i < boxWidth - 1) if (dataArray[i + 1][j].isMine) mineCount++;
                if (i < boxWidth - 1 && j < boxWidth - 1) if (dataArray[i + 1][j + 1].isMine) mineCount++;
                if (mineCount === 0) {
                    dataArray[i][j].isEmpty = true;
                    continue;
                }
                dataArray[i][j].isNumber = mineCount;
            }
        }
    }
    isMapCreated = true;
}

function showAll() {
    for (let i = 0; i < boxWidth; i++) for (let j = 0; j < boxWidth; j++) {
        if (dataArray[i][j].isMine) document.querySelector(`#cell-${i}-${j}`).textContent = "💣";
        else if (dataArray[i][j].isNumber !== null) document.querySelector(`#cell-${i}-${j}`).textContent = dataArray[i][j].isNumber;
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