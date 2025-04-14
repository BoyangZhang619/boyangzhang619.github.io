// console.log(infoTransfer);
if(window.location.search.includes("?"))infoTransfer = JSON.parse(decodeURIComponent(window.location.search.replace("?", "")));

gameIntroContent = {
    "game2048" : "2048",
    "klotski" : "Klotski"
}
function gameIntro(type) {
    //run the func which pauses the game
    alert(gameIntroContent[type]);
}
function back() {
    window.open(`../../index.html?${JSON.stringify(infoTransfer)}`, "_self");   
}