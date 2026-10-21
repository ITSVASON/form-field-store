const products = [
  { id: "woven-day-bag", name: "Woven Day Bag", detail: "Handwoven texture · Everyday shape", price: 38, category: "Wear", badge: "BESTSELLER", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80" },
  { id: "stoneware-cup", name: "Sunday Stoneware Cup", detail: "Hand-finished · Set of 2", price: 32, category: "Home", badge: "MADE IN SMALL BATCHES", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80" },
  { id: "daily-tee", name: "The Daily Tee", detail: "Organic cotton · Ecru", price: 42, category: "Wear", badge: "", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" },
  { id: "quiet-corner", name: "A Quiet Corner", detail: "Little things for a softer room", price: 54, category: "Home", badge: "", image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?auto=format&fit=crop&w=800&q=80" },
  { id: "botanical-soap", name: "Botanical Hand Soap", detail: "Cedar + wild orange · 300ml", price: 24, category: "Home", badge: "A LITTLE LUXURY", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80" },
  { id: "weekday-shirt", name: "The Workday Shirt", detail: "Crisp cotton · A sharper everyday", price: 68, category: "Wear", badge: "", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80" }
];

const cartStorageKey = "form-field-cart";
const cartProductIds = new Set(products.map(product => product.id));
const cart = loadCart();
const grid = document.querySelector("#product-grid");
const filter = document.querySelector("#category-filter");
const drawer = document.querySelector("#cart-drawer");
const toast = document.querySelector("#toast");
let toastTimer;

function loadCart() {
  let savedCart;
  try {
    const storedCart = localStorage.getItem(cartStorageKey);
    if (storedCart === null) return new Map();
    savedCart = JSON.parse(storedCart);
  } catch (error) {
    console.warn("The saved shopping bag could not be read. Starting with an empty bag.", error);
    try {
      localStorage.removeItem(cartStorageKey);
    } catch (clearError) {
      console.error("The unreadable saved shopping bag could not be cleared.", clearError);
    }
    return new Map();
  }

  const isValidCart = Array.isArray(savedCart) && savedCart.every(entry =>
    Array.isArray(entry) &&
    entry.length === 2 &&
    cartProductIds.has(entry[0]) &&
    Number.isSafeInteger(entry[1]) &&
    entry[1] > 0
  );

  if (!isValidCart) {
    console.warn("The saved shopping bag is invalid. Starting with an empty bag.");
    try {
      localStorage.removeItem(cartStorageKey);
    } catch (error) {
      console.error("The invalid saved shopping bag could not be cleared.", error);
    }
    return new Map();
  }

  return new Map(savedCart);
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify([...cart]));
  } catch (error) {
    console.error("The shopping bag could not be saved.", error);
  }
}

function renderProducts() {
  const category = filter.value;
  const visibleProducts = products.filter(product => category === "All" || product.category === category);
  document.querySelector("#product-count").textContent = `Showing ${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
  grid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="add-button" data-add="${product.id}" aria-label="Add ${product.name} to bag">+</button>
      </div>
      <div class="product-info">
        <div><h3 class="product-name">${product.name}</h3><p class="product-detail">${product.detail}</p></div>
        <span class="product-price">$${product.price.toFixed(2)}</span>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  const total = [...cart.entries()].reduce((sum, [id, quantity]) => sum + products.find(product => product.id === id).price * quantity, 0);
  document.querySelector("#cart-count").textContent = count;
  document.querySelector("#drawer-count").textContent = `(${count})`;
  document.querySelector("#subtotal").textContent = `$${total.toFixed(2)}`;
  document.querySelector("#cart-empty").hidden = count > 0;
  document.querySelector("#drawer-footer").hidden = count === 0;
  document.querySelector("#cart-items").innerHTML = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return `<div class="cart-row">
      <img src="${product.image}" alt="" />
      <div><p class="cart-row-name">${product.name}</p><span class="cart-row-price">$${product.price.toFixed(2)}</span>
        <div class="quantity-control"><button data-quantity="${id}" data-change="-1" aria-label="Remove one ${product.name}">−</button><span>${quantity}</span><button data-quantity="${id}" data-change="1" aria-label="Add one ${product.name}">+</button></div>
      </div>
      <button class="remove-item" data-remove="${id}">Remove</button>
    </div>`;
  }).join("");
}

function setDrawer(open) {
  document.body.classList.toggle("cart-open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  if (open) document.querySelector("#close-drawer").focus();
  else document.querySelector("#cart-trigger").focus();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  saveCart();
  renderCart();
  showToast(`${products.find(product => product.id === id).name} added to your bag`);
});

document.querySelector("#cart-items").addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    const quantity = (cart.get(id) || 0) + Number(quantityButton.dataset.change);
    if (quantity < 1) cart.delete(id);
    else cart.set(id, quantity);
    saveCart();
    renderCart();
  }
  if (removeButton) {
    cart.delete(removeButton.dataset.remove);
    saveCart();
    renderCart();
  }
});

filter.addEventListener("change", renderProducts);
document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    filter.value = link.dataset.categoryLink;
    renderProducts();
  });
});
document.querySelector("#cart-trigger").addEventListener("click", () => setDrawer(true));
document.querySelector("#close-drawer").addEventListener("click", () => setDrawer(false));
document.querySelector("#drawer-backdrop").addEventListener("click", () => setDrawer(false));
document.querySelector("#continue-shopping").addEventListener("click", () => setDrawer(false));
document.querySelector("#checkout-button").addEventListener("click", () => showToast("Checkout is coming soon — your bag is saved here."));
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && document.body.classList.contains("cart-open")) setDrawer(false);
});

renderProducts();
renderCart();
