"use strict";

// PRACTICAL 6: Asynchronous JavaScript, Fetch API and Browser Storage
// Theme: TechNest Gadget Store

// ---------- Small helpers ----------
function $(id) {
    return document.getElementById(id);
}

// Storage can be blocked by some browsers, so every call is wrapped in try/catch.
function readStore(storage, key) {
    try { return storage.getItem(key); } catch (error) { return null; }
}

function writeStore(storage, key, value) {
    try { storage.setItem(key, value); } catch (error) { /* ignore */ }
}

function removeStore(storage, key) {
    try { storage.removeItem(key); } catch (error) { /* ignore */ }
}

const KEY_CATEGORY = "technest_category";
const KEY_THEME = "technest_theme";
const KEY_CUSTOMER = "technest_customer";

// ---------- 1. TIMERS ----------
// setTimeout() runs once, setInterval() repeats until clearInterval() is called.
const shoppingTips = [
    "Tip: Compare warranty before you buy a laptop.",
    "Tip: Wireless headphones are great for travel.",
    "Tip: A smartwatch can track your daily steps."
];
let tipNumber = 0;
let tipTimer = null;

setTimeout(function () {
    $("promoMessage").textContent = "Flash Sale: Get 15% OFF on selected demo gadgets!";
}, 2000);

function showNextTip() {
    $("timerResult").textContent = shoppingTips[tipNumber];
    tipNumber = (tipNumber + 1) % shoppingTips.length;
}

function startTips() {
    if (tipTimer !== null) {
        return; // already running
    }
    tipTimer = setInterval(showNextTip, 4000);
    $("timerResult").textContent = "Tips restarted. The next tip appears in 4 seconds.";
}

function stopTips() {
    clearInterval(tipTimer);
    tipTimer = null;
    $("timerResult").textContent = "Shopping tips stopped.";
}

$("stopTimerBtn").addEventListener("click", stopTips);
$("startTimerBtn").addEventListener("click", startTips);
tipTimer = setInterval(showNextTip, 4000);

// ---------- 2. FETCH API ----------
let allProducts = [];

function setStatus(text, type) {
    const status = $("fetchStatus");
    status.textContent = text;
    status.className = type ? "message " + type : "message";
}

async function loadProducts(fileName) {
    setStatus("Loading products...", "");
    $("productList").replaceChildren();

    try {
        const response = await fetch(fileName);

        if (!response.ok) {
            throw new Error("File not found (HTTP " + response.status + ")");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("JSON must contain a list of products.");
        }

        allProducts = data;
        fillCategoryOptions();
        showProducts();
        setStatus("Success! Loaded " + data.length + " products using Fetch API.", "success");
    } catch (error) {
        allProducts = [];
        setStatus("Error: " + error.message + ". Click Load Products to try again.", "error");
    }
}

function fillCategoryOptions() {
    const select = $("categoryFilter");
    const saved = readStore(localStorage, KEY_CATEGORY) || "all";
    const categories = [];

    allProducts.forEach(function (product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    select.replaceChildren();
    select.add(new Option("All Categories", "all"));
    categories.forEach(function (category) {
        select.add(new Option(category, category));
    });

    select.value = (saved === "all" || categories.includes(saved)) ? saved : "all";
    showLocalPreference();
}

function showProducts() {
    const container = $("productList");
    const category = $("categoryFilter").value;
    const budgetOnly = $("budgetOnly").checked;
    container.replaceChildren();

    const visible = allProducts.filter(function (product) {
        const categoryMatch = (category === "all") || (product.category === category);
        const budgetMatch = !budgetOnly || Number(product.price) < 10000;
        return categoryMatch && budgetMatch;
    });

    visible.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const icon = document.createElement("div");
        icon.className = "product-icon";
        icon.textContent = product.icon;

        const title = document.createElement("h3");
        title.textContent = product.title;

        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = product.category + " • " + product.warranty + " months warranty";

        const text = document.createElement("p");
        text.textContent = product.description;

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = "₹" + Number(product.price).toLocaleString("en-IN");

        card.append(icon, title, meta, text, price);
        container.appendChild(card);
    });

    if (visible.length === 0 && allProducts.length > 0) {
        container.textContent = "No products match the selected filters.";
    }
}

$("loadBtn").addEventListener("click", function () {
    loadProducts("products.json");
});

$("errorBtn").addEventListener("click", function () {
    loadProducts("missing_products.json");
});

$("budgetOnly").addEventListener("change", showProducts);

$("resetFilterBtn").addEventListener("click", function () {
    $("categoryFilter").value = "all";
    $("budgetOnly").checked = false;
    removeStore(localStorage, KEY_CATEGORY);
    showProducts();
    showLocalPreference();
});

// ---------- 3. CALLBACK ----------
// The callback runs only after the simulated check is finished.
function checkOrder(productName, callback) {
    setTimeout(function () {
        callback("Demo order for " + productName + " was checked successfully.");
    }, 1200);
}

$("orderBtn").addEventListener("click", function () {
    const button = this;
    const category = $("categoryFilter").value;
    const productName = (category === "all") ? "Laptop" : category;

    button.disabled = true;
    $("callbackResult").textContent = "Step 1: Order started... Step 2: Checking stock (1.2 seconds)...";

    checkOrder(productName, function (message) {
        $("callbackResult").textContent = "Step 3: Callback executed! " + message;
        button.disabled = false;
    });
});

// ---------- 4. LOCAL STORAGE ----------
function showLocalPreference() {
    const category = readStore(localStorage, KEY_CATEGORY) || "All Categories";
    const theme = readStore(localStorage, KEY_THEME) || "light";
    $("localResult").textContent = "Saved category: " + category + " | Saved theme: " + theme;
}

$("categoryFilter").addEventListener("change", function () {
    writeStore(localStorage, KEY_CATEGORY, this.value);
    showProducts();
    showLocalPreference();
});

$("themeBtn").addEventListener("click", function () {
    document.body.classList.toggle("dark");
    writeStore(localStorage, KEY_THEME, document.body.classList.contains("dark") ? "dark" : "light");
    showLocalPreference();
});

$("clearLocalBtn").addEventListener("click", function () {
    removeStore(localStorage, KEY_CATEGORY);
    removeStore(localStorage, KEY_THEME);
    document.body.classList.remove("dark");
    $("categoryFilter").value = "all";
    showProducts();
    showLocalPreference();
});

// ---------- 5. SESSION STORAGE ----------
function showCustomerName() {
    const name = readStore(sessionStorage, KEY_CUSTOMER) || "";
    $("sessionResult").textContent = name
        ? "Welcome, " + name + "! (Saved in Session Storage)"
        : "No temporary customer name is saved.";
    $("customerName").value = name;
}

$("saveSessionBtn").addEventListener("click", function () {
    const name = $("customerName").value.trim();

    if (name === "") {
        $("sessionResult").textContent = "Please enter a customer name first.";
        return;
    }

    writeStore(sessionStorage, KEY_CUSTOMER, name);
    showCustomerName();
});

$("clearSessionBtn").addEventListener("click", function () {
    removeStore(sessionStorage, KEY_CUSTOMER);
    showCustomerName();
});

// ---------- When the page opens ----------
if (readStore(localStorage, KEY_THEME) === "dark") {
    document.body.classList.add("dark");
}
showLocalPreference();
showCustomerName();