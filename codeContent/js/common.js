window.onload = () => {
    info = navigator.userAgent;
    isPhone = /mobile/i.test(info); // if it's a mobile device, isPhone = true
    if (isPhone) return confirm("This page is not supported on mobile devices. Please use a computer to access it.")?document.querySelector("html").style.display = "none":null;
}

// console.log(infoTransfer);
if(window.location.search.includes("?"))infoTransfer = JSON.parse(decodeURIComponent(window.location.search.replace("?", "")));
for (let key in infoTransfer.gI) {
    if(Object.keys(infoTransfer.gI[key]).length > 1) {
        for (let k in infoTransfer.gI[key]) {
            infoTransfer.gI[key].c0.mN = infoTransfer.gI[key].c0.mN>infoTransfer.gI[key][k].mN ? infoTransfer.gI[key].c0.mN : infoTransfer.gI[key][k].mN;
            infoTransfer.gI[key].c0.bS = infoTransfer.gI[key].c0.bS>infoTransfer.gI[key][k].bS ? infoTransfer.gI[key].c0.bS : infoTransfer.gI[key][k].bS;
        }
    }
}
gameIntroContent = {
    "game2048" : "Genre: Number puzzle/Strategy game\n\nGameplay: Slide numbered tiles on a 4x4 grid to combine matching numbers (e.g., 2+2=4, 4+4=8). The goal is to create the tile numbered 2048 before the grid fills up.\n\nKey Feature: Simple controls (swipe or arrow keys) with addictive, brain-teasing strategy.",
    "klotski" : "Genre: Sliding block puzzle\n\nOrigin: Inspired by the ancient Chinese legend of Cao Cao escaping a trap.\n\nGameplay: Move irregular wooden blocks within a confined space to slide the largest block (representing Cao Cao) to the exit.\n\nKey Feature: Requires spatial reasoning and patience, with hundreds of challenging variations.",
    "labyrinth" : "Genre: Pathfinding puzzle\n\nGameplay: Navigate through a labyrinth from a start point to an exit, avoiding dead ends. Mazes can be physical (paper) or digital.\n\nKey Feature: Tests memory and problem-solving skills, often with time limits or hidden traps in modern versions.",
    "mineClearance" : "Genre: Logic puzzle\n\nGameplay: Clear a grid of hidden mines using numeric clues indicating nearby explosives. Right-click to flag suspected mines.\n\nKey Feature: Iconic Windows pre-installed game since 1990; balances luck and deductive reasoning.",
}
function gameIntro(type) {
    //run the func which pauses the game
    alert(gameIntroContent[type]);
}
function back() {
    window.open(`../../index.html?${JSON.stringify(infoTransfer)}`, "_self");   
}