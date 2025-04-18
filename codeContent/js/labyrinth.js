window.onload = () => {
    initialCreate(49)
}
function initialCreate(width) {
    if ((width-1)%2 !== 0) {
        alert("Width must be an odd number.");
        console.error("Width must be an odd number.");
        return;
    }
    document.querySelector("#box").innerHTML = ""; // Clear the previous labyrinth
    // Create the labyrinth with the given width(height=width)
    dataArray = new Array(width).fill([]).map(() => new Array(width).fill({
        isWall: null,
        isVisited: null,
        isStartPoint: null,
        isEndPoint: null
    }));
    for (let i=0;i<width;i++){
        let row = document.createElement("ul");
        row.className = "labyrinthRow";
        row.id = `row-${i}`;
        document.querySelector("#box").appendChild(row);
        for (let j=0;j<width;j++){
            let cell = document.createElement("li");
            cell.className = "labyrinthCell";
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
        // document.querySelector("#box").appendChild(document.querySelector(".labyrinthRow"));
    }
    mainTagElement = document.querySelector("#main");
    liElements = document.querySelectorAll(".labyrinthCell");
    pageStyleFunc(width);
    createLabyrinth(width);
}
function createLabyrinth(width) {
    // Create the labyrinth structure
    createStartEnd(width);
    createPath(width);
    // Call the pathfinding algorithm with the labyrinth data
    // pathfindingAlgorithm(dataArray, width);
}
function createStartEnd(width) {

}
function createPath(width) {

}
function pageStyleFunc(width) {
    if (parseInt(window.getComputedStyle(mainTagElement.children[0]).width) < parseInt(window.getComputedStyle(mainTagElement.children[0]).height)) {
        liElements.forEach(elem => elem.style.width = elem.style.lineHeight = `${70/width}vw`);//70vw / width
        liElements.forEach(elem => elem.style.fontSize = `${70/width}vw`);// 1/3 of 17.5vw
    } else {
        liElements.forEach(elem => elem.style.width = elem.style.lineHeight = `calc(${100/width}vh - ${7.5/width}vw)`);//(100vh - 7.5vw) / width
        liElements.forEach(elem => elem.style.fontSize = `calc(${100/(width*3)}vh - ${7.5/(width*3)}vw)`);// 1/3 of (100vh - 7.5vw)/width
    }
}