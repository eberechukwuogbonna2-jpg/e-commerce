/**
 * SHOP.CO - Category Page Logic
 * Interactive filters, color selection, size selection, sorting, and pagination
 */

// Toggle collapsible filter accordions
function toggleFilterGroup(groupId) {
  const group = document.getElementById(groupId);
  if (group) {
    group.classList.toggle("open");
  }
}

// Color Swatch Selection
function selectColor(button) {
  const allSwatches = document.querySelectorAll(".color-swatch");
  allSwatches.forEach(swatch => {
    swatch.classList.remove("selected");
    const existingCheck = swatch.querySelector("svg");
    if (existingCheck) existingCheck.remove();
  });

  button.classList.add("selected");
  const checkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  checkSvg.setAttribute("viewBox", "0 0 24 24");
  checkSvg.setAttribute("fill", "none");
  checkSvg.setAttribute("stroke", "currentColor");
  checkSvg.setAttribute("stroke-width", "3");
  checkSvg.setAttribute("stroke-linecap", "round");
  checkSvg.setAttribute("stroke-linejoin", "round");
  checkSvg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
  button.appendChild(checkSvg);

  const colorName = button.getAttribute("aria-label");
  showToast(`Color filtered: ${colorName}`);
}

// Size Pill Selection
function selectSize(button) {
  const allSizes = document.querySelectorAll(".size-pill");
  allSizes.forEach(pill => pill.classList.remove("selected"));

  button.classList.add("selected");
  showToast(`Size selected: ${button.textContent}`);
}

// Apply Filters Action
function applyFilters() {
  const activeColor = document.querySelector(".color-swatch.selected")?.getAttribute("aria-label") || "Default";
  const activeSize = document.querySelector(".size-pill.selected")?.textContent || "Default";
  
  showToast(`Filters applied: Size ${activeSize}, Color ${activeColor}`);
  closeMobileFilter();
}

// Mobile Filter Drawer Toggle
const mobileFilterTrigger = document.getElementById("mobileFilterTrigger");
const closeFilterMobileBtn = document.getElementById("closeFilterMobileBtn");
const filtersSidebar = document.getElementById("filtersSidebar");
const filterBackdrop = document.getElementById("filterBackdrop");

function openMobileFilter() {
  if (filtersSidebar) filtersSidebar.classList.add("mobile-open");
  if (filterBackdrop) filterBackdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMobileFilter() {
  if (filtersSidebar) filtersSidebar.classList.remove("mobile-open");
  if (filterBackdrop) filterBackdrop.classList.remove("active");
  document.body.style.overflow = "";
}

if (mobileFilterTrigger) mobileFilterTrigger.addEventListener("click", openMobileFilter);
if (closeFilterMobileBtn) closeFilterMobileBtn.addEventListener("click", closeMobileFilter);
if (filterBackdrop) filterBackdrop.addEventListener("click", closeMobileFilter);

// Pagination Numbers
const pageButtons = document.querySelectorAll(".page-num");
pageButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    pageButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    window.scrollTo({ top: 120, behavior: "smooth" });
    showToast(`Showing Page ${btn.textContent}`);
  });
});

// Sort Selector
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    const sortVal = e.target.options[e.target.selectedIndex].text;
    showToast(`Sorted by: ${sortVal}`);
  });
}

// Toast notification helper
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
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
