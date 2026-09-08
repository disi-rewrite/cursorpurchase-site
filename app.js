const scenes = [...document.querySelectorAll("[data-scene]")];
const dots = [...document.querySelectorAll("#rail button")];
const sceneCount = scenes.length;
const description = document.querySelector(".description");

const menuBtn = document.getElementById("menu-btn");
const menuOverlay = document.getElementById("menu-overlay");
const menuClose = document.getElementById("menu-close");
const menuTabs = document.getElementById("menu-tabs");
const viewAbout = document.getElementById("view-about");
const viewTerms = document.getElementById("view-terms");

const VOID_SCENE = 6;
let active = -1;

function sceneFromScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  const t = Math.min(1, Math.max(0, window.scrollY / max));
  return Math.min(sceneCount - 1, Math.floor(t * sceneCount + 1e-6));
}

function setScene(index) {
  if (index === active) return;
  active = index;

  scenes.forEach((el, i) => {
    const on = i === index && i !== VOID_SCENE;
    el.classList.toggle("is-active", on);
    el.toggleAttribute("inert", !on);
    el.setAttribute("aria-hidden", on ? "false" : "true");
  });

  description.classList.toggle("is-gone", index >= VOID_SCENE);

  dots.forEach((dot, i) => {
    dot.classList.toggle("is-current", i === index);
    dot.setAttribute("aria-current", i === index ? "true" : "false");
  });
}

function onScroll() {
  setScene(sceneFromScroll());
}

function jumpTo(index) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = (index / sceneCount) * max + 2;
  window.scrollTo({ top: y, behavior: "smooth" });
}

function openMenu() {
  menuOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  menuBtn.setAttribute("aria-expanded", "true");
  showMenuHome();
  menuClose.focus();
}

function closeMenu() {
  menuOverlay.hidden = true;
  document.body.style.overflow = "";
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.focus();
}

function showMenuHome() {
  menuTabs.hidden = false;
  viewAbout.hidden = true;
  viewTerms.hidden = true;
}

function showView(name) {
  menuTabs.hidden = true;
  viewAbout.hidden = name !== "about";
  viewTerms.hidden = name !== "terms";
}

menuBtn.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", (event) => {
  if (event.target === menuOverlay) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menuOverlay.hidden) closeMenu();
});

menuTabs.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-view]");
  if (!tab) return;
  showView(tab.dataset.view);
});

menuOverlay.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", showMenuHome);
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => jumpTo(Number(dot.dataset.jump)));
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

requestAnimationFrame(() => setScene(sceneFromScroll()));
