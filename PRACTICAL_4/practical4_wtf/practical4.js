/ Practical 4 - DOM Manipulation and Event Handling
// Rewritten version: same features, organised with small helper functions.
 
// ---------- Helpers ----------
function byId(id) {
    return document.getElementById(id);
}
 
function setOutput(id, html) {
    byId(id).innerHTML = html;
}
 
function onEvent(id, eventName, handler) {
    byId(id).addEventListener(eventName, handler);
}
 
// ---------- 1. Selecting HTML elements ----------
onEvent("btnSelect", "click", function () {
    const message = byId("demoMessage");
    const classItems = document.getElementsByClassName("sample");
    const paragraphs = document.getElementsByTagName("p");
    const firstBox = document.querySelector(".box");
    const allBoxes = document.querySelectorAll(".box");
 
    const lines = [
        "getElementById(): " + message.innerHTML,
        "getElementsByClassName(): " + classItems.length + " element(s)",
        "getElementsByTagName(): " + paragraphs.length + " paragraph(s)",
        "querySelector(): " + firstBox.tagName,
        "querySelectorAll(): " + allBoxes.length + " box(es)"
    ];
 
    setOutput("outSelect", lines.join("<br>"));
});
 
// ---------- 2. Change content, attribute and style ----------
onEvent("btnText", "click", function () {
    setOutput("storeText", "Big sale today: up to 50% off on gadgets!");
});
 
onEvent("btnLink", "click", function () {
    const link = byId("storeLink");
    link.setAttribute("href", "https://www.wikipedia.org");
    link.innerHTML = "Open Wikipedia";
});
 
onEvent("btnStyle", "click", function () {
    const text = byId("storeText");
    text.style.color = "#1d4ed8";
    text.style.fontWeight = "bold";
    text.style.fontSize = "1.2rem";
});
 
// ---------- 3. Create, replace and remove elements ----------
const extraItems = ["Headphones", "Smart Speaker", "Power Bank", "Webcam"];
let extraIndex = 0;
 
onEvent("btnAdd", "click", function () {
    const item = document.createElement("li");
    item.innerHTML = extraItems[extraIndex % extraItems.length];
    extraIndex++;
    byId("gadgetList").appendChild(item);
});
 
onEvent("btnReplace", "click", function () {
    const list = byId("gadgetList");
    if (list.children.length === 0) {
        return;
    }
    const item = document.createElement("li");
    item.innerHTML = "Smart Watch";
    list.replaceChild(item, list.children[0]);
});
 
onEvent("btnRemove", "click", function () {
    const list = byId("gadgetList");
    if (list.children.length === 0) {
        return;
    }
    list.removeChild(list.lastElementChild);
});
 
// ---------- 4. Click and double-click ----------
onEvent("btnClick", "click", function () {
    setOutput("outClick", "You clicked the button once.");
});
 
onEvent("btnDouble", "dblclick", function () {
    setOutput("outClick", "You double-clicked the button.");
});
 
// ---------- 5. Mouse events ----------
onEvent("hoverArea", "mouseover", function () {
    setOutput("outMouse", "The mouse is inside the box.");
    this.classList.add("highlight");
});
 
onEvent("hoverArea", "mouseout", function () {
    setOutput("outMouse", "The mouse has left the box.");
    this.classList.remove("highlight");
});
 
// ---------- 6. Keyboard events ----------
onEvent("typeInput", "keydown", function (event) {
    setOutput("outKey", "Key pressed: " + event.key);
});
 
onEvent("typeInput", "keyup", function () {
    setOutput("outKey", "Text so far: " + this.value);
});
 
// ---------- 7. Change event ----------
onEvent("groupSelect", "change", function () {
    setOutput("outGroup", "You selected: " + this.value);
});
 
// ---------- 8. Theme switching ----------
onEvent("btnTheme", "click", function () {
    document.body.classList.toggle("dark");
});
 
// ---------- 9. Image preview (laptop, smartphone, headphones) ----------
// The pictures are drawn as small SVG images, so no internet is needed.
const photos = {
    laptop:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#d6e8ff"/><stop offset="1" stop-color="#d9f5e5"/>' +
        '</linearGradient></defs>' +
        '<rect width="200" height="140" fill="url(#g)"/>' +
        '<rect x="40" y="20" width="120" height="76" rx="6" fill="#0f2a4a"/>' +
        '<rect x="47" y="27" width="106" height="62" rx="2" fill="#eaf7f5"/>' +
        '<rect x="56" y="36" width="50" height="6" rx="3" fill="#1d4ed8"/>' +
        '<rect x="56" y="48" width="84" height="5" rx="2" fill="#a9c1e8"/>' +
        '<rect x="56" y="58" width="70" height="5" rx="2" fill="#a9c1e8"/>' +
        '<rect x="56" y="68" width="78" height="5" rx="2" fill="#a9c1e8"/>' +
        '<polygon points="22,100 178,100 192,116 8,116" fill="#7f99c4"/>' +
        '<rect x="80" y="104" width="40" height="4" rx="2" fill="#5a78a8"/>' +
        '</svg>',
    phone:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140">' +
        '<rect width="200" height="140" fill="#e6f0ff"/>' +
        '<rect x="72" y="8" width="56" height="124" rx="10" fill="#0f2a4a"/>' +
        '<rect x="78" y="20" width="44" height="98" rx="3" fill="#eaf7f5"/>' +
        '<circle cx="100" cy="46" r="12" fill="#1d4ed8"/>' +
        '<rect x="84" y="68" width="32" height="5" rx="2" fill="#a9c1e8"/>' +
        '<rect x="84" y="80" width="26" height="5" rx="2" fill="#a9c1e8"/>' +
        '<circle cx="100" cy="125" r="3" fill="#7f99c4"/>' +
        '</svg>',
    headphones:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 140">' +
        '<rect width="200" height="140" fill="#e3f6ec"/>' +
        '<path d="M52 88 A48 48 0 0 1 148 88" fill="none" stroke="#0f2a4a" stroke-width="9" stroke-linecap="round"/>' +
        '<rect x="38" y="82" width="26" height="42" rx="9" fill="#1d4ed8"/>' +
        '<rect x="136" y="82" width="26" height="42" rx="9" fill="#1d4ed8"/>' +
        '<rect x="44" y="92" width="14" height="22" rx="5" fill="#1e3a8a"/>' +
        '<rect x="142" y="92" width="14" height="22" rx="5" fill="#1e3a8a"/>' +
        '</svg>'
};
 
// Real photos found by keyword: laptop, smartphone, headphones (need internet).
const photoUrls = {
    laptop: "https://loremflickr.com/520/360/laptop?lock=21",
    phone: "https://loremflickr.com/520/360/smartphone?lock=22",
    headphones: "https://loremflickr.com/520/360/headphones?lock=23"
};
 
function showPhoto(name) {
    const img = byId("photoView");
    // If the real photo cannot load (no internet), show the drawn picture instead.
    img.onerror = function () {
        img.onerror = null;
        img.src = "data:image/svg+xml;utf8," + encodeURIComponent(photos[name] || photos.laptop);
    };
    img.src = photoUrls[name];
}
 
onEvent("photoSelect", "change", function () {
    showPhoto(this.value);
});
 
showPhoto("laptop"); // first picture shown when the page loads
 
// ---------- 10. Dynamic menu ----------
onEvent("btnMenu", "click", function () {
    const menu = byId("navMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
});
 
