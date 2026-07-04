const revealItems = document.querySelectorAll(".reveal");
const scrollProgress = document.querySelector("#scrollProgress");
const typeTargets = document.querySelectorAll([
  ".hero-content .eyebrow",
  ".hero h1 span",
  ".hero-text",
  ".section-heading .eyebrow",
  ".section-heading h2",
  ".profile-card p",
  ".quick-facts span",
  ".quick-facts strong",
  ".tile > span",
  ".tile h3",
  ".tile p",
  ".timeline-item > span",
  ".timeline-item h3",
  ".timeline-item p",
  ".internship-panel h3",
  ".internship-panel .date",
  ".internship-panel p",
  ".certificate",
  ".contact-card > span:not(.contact-icon)",
  ".contact-card strong"
].join(", "));
let lastScrollY = window.scrollY;
let lastPointerX = window.innerWidth / 2;
let directionTimer;

typeTargets.forEach((target) => {
  target.dataset.typeText = target.textContent.trim().replace(/\s+/g, " ");
  target.textContent = "";
  target.classList.add("type-target", "type-ready");
});

const typeText = (target) => {
  if (target.dataset.typed === "true" || target.dataset.typing === "true") {
    return;
  }

  const text = target.dataset.typeText || "";
  let index = 0;
  const speed = Math.max(8, Math.min(22, Math.floor(520 / Math.max(text.length, 1))));

  target.dataset.typing = "true";
  target.classList.remove("type-ready", "type-complete");
  target.classList.add("type-active");
  target.textContent = "";

  const step = () => {
    target.textContent = text.slice(0, index);
    index += 1;

    if (index <= text.length) {
      window.setTimeout(step, speed);
      return;
    }

    target.classList.remove("type-active");
    target.classList.add("type-complete");
    target.dataset.typed = "true";
    target.dataset.typing = "false";
  };

  step();
};

const typeWithin = (container) => {
  if (container.matches?.(".type-target")) {
    typeText(container);
  }

  container.querySelectorAll?.(".type-target").forEach(typeText);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      typeWithin(entry.target);
    } else {
      entry.target.classList.remove("is-visible");
    }
  });
}, {
  threshold: 0.22,
});

revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index * 45, 280)}ms`);
  item.style.setProperty("--reveal-x", index % 2 === 0 ? "-22px" : "22px");
  observer.observe(item);
});

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;

  const currentScrollY = window.scrollY;
  document.body.classList.toggle("scrolling-down", currentScrollY > lastScrollY);
  document.body.classList.toggle("scrolling-up", currentScrollY < lastScrollY);
  lastScrollY = Math.max(currentScrollY, 0);

  window.clearTimeout(directionTimer);
  directionTimer = window.setTimeout(() => {
    document.body.classList.remove("scrolling-down", "scrolling-up");
  }, 180);
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
window.addEventListener("pointermove", (event) => {
  document.body.classList.toggle("moving-right", event.clientX > lastPointerX);
  document.body.classList.toggle("moving-left", event.clientX < lastPointerX);
  lastPointerX = event.clientX;
}, { passive: true });
updateScrollProgress();
