const alphabet = {
    "Normal":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "𝐁𝐨𝐥𝐝":"𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳",
    "𝑰𝒕𝒂𝒍𝒊𝒄":"𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛",
    "𝓒𝓪𝓵𝓵𝓲𝓰𝓻𝓪𝓹𝓱𝓲𝓬":"𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃",
    "𝕲𝖔𝖙𝖍𝖎𝖈":"𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟",
    "𝖲𝖺𝗇𝗌-𝗌𝖾𝗋𝗂𝖿":"𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓",
    "𝗦𝗮𝗻𝘀-𝘀𝗲𝗿𝗶𝗳𝗕𝗼𝗹𝗱":"𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇",
    "𝘚𝘢𝘯𝘴-𝘴𝘦𝘳𝘪𝘧𝘐𝘵𝘢𝘭𝘪𝘤":"𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻",
    "𝙎𝙖𝙣𝙨-𝙨𝙚𝙧𝙞𝙛𝘽𝙤𝙡𝙙𝙄𝙩𝙖𝙡𝙞𝙘":"𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯",
    "𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎":"𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣"
};

const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// 状态
let isTransforming = false;

function transformText(input, font) {
    const fontArr = Array.from(font);
    let output = "";
    for (let c of input) {
        let idx = normal.indexOf(c);
        if (idx !== -1 && fontArr.length === 52) {
            output += fontArr[idx];
        } else {
            output += c;
        }
    }
    return output;
}

function setDisabled(disabled) {
    isTransforming = disabled;
    const input = document.getElementById("inputText");
    const items = document.querySelectorAll("#fontList li");
    
    input.disabled = disabled;
    items.forEach(li => {
        if (disabled) {
            li.classList.add("disabled");
        } else {
            li.classList.remove("disabled");
        }
    });
}

function handleTransform(fontName, li) {
    if (isTransforming) return;
    
    const input = document.getElementById("inputText").value;
    const result = document.getElementById("result");
    const allItems = document.querySelectorAll("#fontList li");
    
    // 移除之前的选中状态
    allItems.forEach(item => item.classList.remove("selected", "ripple"));
    
    // 添加选中和波纹动画
    li.classList.add("selected", "ripple");
    
    // 禁用输入
    setDisabled(true);
    
    // 添加转换动画
    result.classList.add("transforming");
    
    // 延迟显示结果，模拟转换过程
    setTimeout(() => {
        result.innerText = transformText(input, alphabet[fontName]);
        
        // 动画结束后恢复
        setTimeout(() => {
            result.classList.remove("transforming");
            setDisabled(false);
            li.classList.remove("ripple");
        }, 400);
    }, 200);
}

function renderFontList() {
    const fontList = document.getElementById("fontList");
    fontList.innerHTML = "";
    
    Object.keys(alphabet).forEach(fontName => {
        const li = document.createElement("li");
        const fontArr = Array.from(alphabet[fontName]);
        const sample = fontArr.slice(0, 10).join("") + "...";
        
        li.innerHTML = `
            <div class='font-title'>${fontName}</div>
            <div class='font-sample'>${sample}</div>
        `;
        
        li.addEventListener("click", () => handleTransform(fontName, li));
        fontList.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderFontList();
    
    const inputEl = document.getElementById("inputText");
    const resultEl = document.getElementById("result");
    
    inputEl.addEventListener("input", function() {
        if (!isTransforming) {
            resultEl.innerText = this.value || "转换结果将显示在这里";
        }
    });
});
