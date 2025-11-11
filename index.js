// ---- CART STORAGE HELPERS ----
const CART_KEY = "darkflowers_cart_v1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCounter();
}

function renderCounter() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  document.getElementById("cartCounter").textContent = totalCount;
}


// ---- ADD BUTTON HANDLING ----
document.addEventListener("click", (e) => {
  // теперь слушаем и .add-btn, и .add-btn-img
  const addBtn = e.target.closest(".add-btn, .add-btn-img");
  if (addBtn) {
    const productEl = e.target.closest(".product");
    if (!productEl) return;

    const data = {
      id: productEl.getAttribute("data-id") || "temp-" + Date.now(),
      title:
        productEl.getAttribute("data-title") ||
        productEl.querySelector(".title").textContent.trim(),
      price: Number(productEl.getAttribute("data-price") || 0),
      img:
        productEl.getAttribute("data-img") ||
        productEl.querySelector("img").src,
      qty: 1,
      instanceId:
        "i-" + Date.now() + "-" + Math.floor(Math.random() * 1000), // unique entry ID
    };

    const cart = getCart();
    cart.push(data);
    saveCart(cart);

    // переход в корзину
    window.location.href = "cart.html";
  }
});

// init counter
renderCounter();

// header cart button opens cart page
document.getElementById("openCartBtn").addEventListener("click", () => {
  window.location.href = "cart.html";
});
