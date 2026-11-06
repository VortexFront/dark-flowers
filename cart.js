"use strict";
const cartStore = globalThis.DarkFlowersCart;
const formatPrice = value => value.toLocaleString("ru-RU") + " ₸";
function renderCart() {
  const container = document.getElementById("cartContainer"), cart = cartStore.read();
  container.replaceChildren();
  document.getElementById("emptyMessage").style.display = cart.length ? "none" : "block";
  document.getElementById("totalsBlock").style.display = cart.length ? "flex" : "none";
  for (const item of cart) {
    const row = document.createElement("div"); row.className = "item"; row.dataset.productId = item.id;
    const picture = document.createElement("div"); picture.className = "item-img";
    const image = document.createElement("img"); image.src = item.img; image.alt = "Иллюстрация: " + item.title; picture.append(image);
    const info = document.createElement("div"); info.className = "item-info";
    const title = document.createElement("div"); title.className = "item-title"; title.textContent = item.title;
    const price = document.createElement("div"); price.className = "item-price"; price.textContent = formatPrice(item.price); info.append(title, price);
    const controls = document.createElement("div"); controls.className = "item-controls";
    const quantity = document.createElement("div"); quantity.className = "qty";
    const button = (action, text, label) => {
      const element = document.createElement("button"); element.type = "button"; element.dataset.action = action; element.dataset.id = item.id; element.textContent = text; element.setAttribute("aria-label", label + ": " + item.title); return element;
    };
    const value = document.createElement("span"); value.dataset.qty = item.id; value.textContent = item.qty; value.setAttribute("aria-label", "Количество: " + item.qty);
    quantity.append(button("dec", "−", "Уменьшить количество"), value, button("inc", "+", "Увеличить количество"));
    const remove = button("remove", "Удалить", "Удалить из корзины"); remove.className = "remove"; controls.append(quantity, remove);
    row.append(picture, info, controls); container.append(row);
  }
  document.getElementById("totalPrice").textContent = formatPrice(cartStore.total(cart));
  document.getElementById("totalCount").textContent = cartStore.count(cart);
}
function save(cart) {
  if (!cartStore.save(cart)) {
    const notice = document.getElementById("storageNotice"); notice.hidden = false; notice.textContent = "Не удалось сохранить изменение в браузере. Корзина не изменена."; return false;
  }
  document.getElementById("checkoutSummary").hidden = true;
  renderCart(); return true;
}
document.getElementById("cartContainer").addEventListener("click", event => {
  const target = event.target.closest("button[data-action]"); if (!target) return;
  const { action, id } = target.dataset, cart = cartStore.read();
  const next = action === "remove" ? cartStore.remove(cart, id) : cartStore.change(cart, id, action === "inc" ? 1 : -1);
  if (save(next)) {
    const replacement = [...document.querySelectorAll("button[data-action]")].find(button => button.dataset.id === id && button.dataset.action === action);
    const focus = replacement || document.querySelector("button[data-action]") || document.getElementById("emptyMessage");
    focus.tabIndex = focus.tagName === "BUTTON" ? 0 : -1; focus.focus();
  }
});
document.getElementById("clearCart").addEventListener("click", () => { if (confirm("Очистить локальную демо-корзину?")) save([]); });
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const cart = cartStore.read(), summary = document.getElementById("checkoutSummary");
  summary.hidden = false;
  summary.textContent = `Демо-итог: ${cartStore.count(cart)} шт., ${formatPrice(cartStore.total(cart))}. Заказ не создан и никуда не отправлен, оплата не выполнялась. Корзина сохранена в этом браузере.`;
});
window.addEventListener("pageshow", renderCart);
window.addEventListener("storage", renderCart);
renderCart();
