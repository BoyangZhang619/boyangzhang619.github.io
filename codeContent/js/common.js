console.log("The storage space has been used up to " + getLocalStorageSize() + "/5242880 bytes.("+(getLocalStorageSize()/5242880).toFixed(5)+")");
// console.log(infoTransfer);
if (window.location.search.includes("?")) infoTransfer = JSON.parse(decodeURIComponent(window.location.search.replace("?", "")));
gameIntroContent = {
    "game2048": "Genre: Number puzzle/Strategy game\n\nGameplay: Slide numbered tiles on a 4x4 grid to combine matching numbers (e.g., 2+2=4, 4+4=8). The goal is to create the tile numbered 2048 before the grid fills up.\n\nKey Feature: Simple controls (swipe or arrow keys) with addictive, brain-teasing strategy.",
    "klotski": "Genre: Sliding block puzzle\n\nOrigin: Inspired by the ancient Chinese legend of Cao Cao escaping a trap.\n\nGameplay: Move irregular wooden blocks within a confined space to slide the largest block (representing Cao Cao) to the exit.\n\nKey Feature: Requires spatial reasoning and patience, with hundreds of challenging variations.",
    "labyrinth": "Genre: Pathfinding puzzle\n\nGameplay: Navigate through a labyrinth from a start point to an exit, avoiding dead ends. Mazes can be physical (paper) or digital.\n\nKey Feature: Tests memory and problem-solving skills, often with time limits or hidden traps in modern versions.",
    "mineClearance": "Genre: Logic puzzle\n\nGameplay: Clear a grid of hidden mines using numeric clues indicating nearby explosives. Right-click to flag suspected mines.\n\nKey Feature: Iconic Windows pre-installed game since 1990; balances luck and deductive reasoning.",
}
function gameIntro(type) {
    //run the func which pauses the game
    alert(gameIntroContent[type]);
}
function back() {
    window.open(`../../index.html`, "_self");
}
function getLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += (key.length + localStorage[key].length) * 2; // UTF-16 编码，每个字符占 2 字节
        }
    }
    return total; // 返回字节数
}

if (getLocalStorageSize() > 4.5 * 1024 * 1024) { // 接近 5MB 时预警
    console.log("存储空间即将用尽");
}