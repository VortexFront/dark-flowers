/* Shared catalogue and local-only cart. No network or checkout API. */
(function (scope) {
  "use strict";
  const CART_KEY = "darkflowers_cart_v1";
  const PRODUCTS = [
  {
    "id": "p-001",
    "title": "Букет «Из ромашек»",
    "price": 8990,
    "img": "assets/bouquet-p-001.svg"
  },
  {
    "id": "p-002",
    "title": "Букет «Семицвет»",
    "price": 8990,
    "img": "assets/bouquet-p-002.svg"
  },
  {
    "id": "p-003",
    "title": "Букет «Северное сияние»",
    "price": 12990,
    "img": "assets/bouquet-p-003.svg"
  },
  {
    "id": "p-004",
    "title": "Букет «Красно-белое»",
    "price": 15990,
    "img": "assets/bouquet-p-004.svg"
  },
  {
    "id": "p-005",
    "title": "Букет «Нежная встреча»",
    "price": 15990,
    "img": "assets/bouquet-p-005.svg"
  },
  {
    "id": "p-006",
    "title": "Букет «Летняя нежность»",
    "price": 15990,
    "img": "assets/bouquet-p-006.svg"
  },
  {
    "id": "p-007",
    "title": "Букет «Ясная поляна»",
    "price": 15990,
    "img": "assets/bouquet-p-007.svg"
  },
  {
    "id": "p-008",
    "title": "Букет «Приятный подарок»",
    "price": 15990,
    "img": "assets/bouquet-p-008.svg"
  },
  {
    "id": "p-009",
    "title": "Букет «Нежность»",
    "price": 15990,
    "img": "assets/bouquet-p-009.svg"
  }
];
  const byId = new Map(PRODUCTS.map(product => [product.id, Object.freeze(product)]));
  const normalize = value => {
    if (!Array.isArray(value)) return [];
    const merged = new Map();
    for (const raw of value) {
      if (!raw || typeof raw !== "object") continue;
      // The old catalogue duplicated p-002 for daisies and Semitsvet.
      const id = raw.id === "p-002" && /ромашек/i.test(String(raw.title)) ? "p-001" : raw.id;
      const product = byId.get(id), quantity = Number(raw.qty ?? 1);
      if (!product || !Number.isSafeInteger(quantity) || quantity < 1) continue;
      const previous = merged.get(id)?.qty || 0;
      merged.set(id, { ...product, qty: Math.min(99, previous + quantity) });
    }
    return [...merged.values()];
  };
  function read(storage) {
    try { storage ??= scope.localStorage; return normalize(JSON.parse(storage.getItem(CART_KEY) || "[]")); }
    catch { return []; }
  }
  function save(cart, storage) {
    try { storage ??= scope.localStorage; storage.setItem(CART_KEY, JSON.stringify(normalize(cart))); return true; }
    catch { return false; }
  }
  const api = { CART_KEY, products: Object.freeze(PRODUCTS), normalize, read, save,
    add: (cart, id) => normalize([...cart, { id, qty: 1 }]),
    change: (cart, id, delta) => normalize(cart.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item)),
    remove: (cart, id) => normalize(cart.filter(item => item.id !== id)),
    count: cart => normalize(cart).reduce((sum, item) => sum + item.qty, 0),
    total: cart => normalize(cart).reduce((sum, item) => sum + item.qty * item.price, 0),
  };
  scope.DarkFlowersCart = Object.freeze(api);
  if (typeof module !== "undefined") module.exports = api;
})(globalThis);
