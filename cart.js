/**
 * SHOP.CO - Cart Page Logic
 * Interactive shopping cart state management, calculation, and UI updates
 */

const cartState = {
  items: {
    "item-1": { name: "Gradient Graphic T-shirt", price: 145, qty: 1 },
    "item-2": { name: "Checkered Shirt", price: 180, qty: 1 },
    "item-3": { name: "Skinny Fit Jeans", price: 240, qty: 1 }
  },
  discountRate: 0.20, // 20% discount as shown in design
  deliveryFee: 15,
  appliedPromo: null
};

// Update item quantity
function updateQty(itemId, delta) {
  const item = cartState.items[itemId];
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty < 1) return; // Minimum 1

  item.qty = newQty;
  document.getElementById(`qty-${itemId}`).textContent = newQty;

  recalculateCart();
}

// Remove item from cart
function removeItem(itemId) {
  const itemEl = document.querySelector(`[data-id="${itemId}"]`);
  if (!itemEl) return;

  itemEl.classList.add("removing");

  setTimeout(() => {
    // Also remove the adjacent divider
    const nextEl = itemEl.nextElementSibling;
    if (nextEl && nextEl.classList.contains("item-divider")) {
      nextEl.remove();
    } else {
      const prevEl = itemEl.previousElementSibling;
      if (prevEl && prevEl.classList.contains("item-divider")) {
        prevEl.remove();
      }
    }

    itemEl.remove();
    delete cartState.items[itemId];

    recalculateCart();
    showToast("Item removed from cart");
  }, 250);
}

// Recalculate totals
function recalculateCart() {
  const itemKeys = Object.keys(cartState.items);
  let subtotal = 0;
  let totalCount = 0;

  itemKeys.forEach(id => {
    const item = cartState.items[id];
    subtotal += item.price * item.qty;
    totalCount += item.qty;
  });

  // Calculate discount (-20%)
  const discountAmount = Math.round(subtotal * cartState.discountRate);
  const delivery = itemKeys.length > 0 ? cartState.deliveryFee : 0;
  const total = subtotal - discountAmount + delivery;

  // Update DOM
  document.getElementById("summarySubtotal").textContent = `$${subtotal}`;
  document.getElementById("summaryDiscount").textContent = `-$${discountAmount}`;
  document.getElementById("summaryDelivery").textContent = `$${delivery}`;
  document.getElementById("summaryTotal").textContent = `$${total}`;

  // Update Header Badge
  const badge = document.getElementById("cartCountBadge");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  }

  // Update Checkout Modal Info
  const modalTotal = document.getElementById("modalTotalPaid");
  const modalItems = document.getElementById("modalItemsCount");
  if (modalTotal) modalTotal.textContent = `$${total}`;
  if (modalItems) modalItems.textContent = `${totalCount} product${totalCount !== 1 ? 's' : ''}`;

  // Toggle empty state
  const itemsList = document.getElementById("itemsList");
  const emptyState = document.getElementById("emptyCartState");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (itemKeys.length === 0) {
    if (itemsList) itemsList.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.5";
      checkoutBtn.style.cursor = "not-allowed";
    }
  } else {
    if (itemsList) itemsList.style.display = "flex";
    if (emptyState) emptyState.style.display = "none";
    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = "1";
      checkoutBtn.style.cursor = "pointer";
    }
  }
}

// Promo Code handler
function applyPromo(e) {
  e.preventDefault();
  const input = document.getElementById("promoInput");
  const messageEl = document.getElementById("promoMessage");
  const code = input.value.trim().toUpperCase();

  if (!code) {
    messageEl.textContent = "Please enter a valid coupon code.";
    messageEl.className = "promo-message error";
    return;
  }

  if (cartState.appliedPromo === code) {
    messageEl.textContent = "Coupon code is already applied.";
    messageEl.className = "promo-message error";
    return;
  }

  cartState.appliedPromo = code;
  messageEl.textContent = `Promo code "${code}" applied successfully (-20% discount)!`;
  messageEl.className = "promo-message success";
  showToast(`Promo "${code}" applied!`);
  recalculateCart();
}

// Checkout Modal
function openCheckoutModal() {
  if (Object.keys(cartState.items).length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("active");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("active");
}

// Close modal on outside click
document.addEventListener("click", (e) => {
  const modal = document.getElementById("checkoutModal");
  if (e.target === modal) {
    closeCheckoutModal();
  }
});

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// Promo bar close button
const closePromoBtn = document.getElementById("closePromoBtn");
if (closePromoBtn) {
  closePromoBtn.addEventListener("click", () => {
    const promoBar = document.getElementById("promoBar");
    if (promoBar) promoBar.classList.add("hidden");
  });
}

// Newsletter subscription
function subscribeNewsletter(e) {
  e.preventDefault();
  const emailInput = document.getElementById("newsletterEmail");
  if (!emailInput || !emailInput.value) return;

  showToast("Thank you for subscribing to SHOP.CO!");
  emailInput.value = "";
}

// Run initial calculation on load
document.addEventListener("DOMContentLoaded", () => {
  recalculateCart();
});
