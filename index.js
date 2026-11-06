"use strict";
const cartStore = globalThis.DarkFlowersCart;
function renderCounter() {
  document.getElementById("cartCounter").textContent = cartStore.count(cartStore.read());
}
document.addEventListener("click", event => {
  const button = event.target.closest(".add-btn");
  if (!button) return;
  const id = button.closest(".product")?.dataset.id;
  if (!cartStore.products.some(product => product.id === id)) return;
  if (!cartStore.save(cartStore.add(cartStore.read(), id))) {
    const notice = document.getElementById("storageNotice");
    notice.hidden = false;
    notice.textContent = "Браузер не разрешает локальное сохранение. Товар не добавлен; разрешите хранилище для этой демонстрации.";
    return;
  }
  renderCounter();
  window.location.href = "cart.html";
});
document.getElementById("openCartBtn").addEventListener("click", () => { window.location.href = "cart.html"; });
window.addEventListener("pageshow", renderCounter);
window.addEventListener("storage", renderCounter);
renderCounter();
