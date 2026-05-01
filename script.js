const root = document.documentElement;
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        window.setTimeout(() => {
          entry.target.style.willChange = "auto";
        }, 900);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -56px 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 55, 420)}ms`;
  observer.observe(item);
});

let ticking = false;

const updateScrollMotion = () => {
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(window.scrollY / maxScroll, 1);
  const heroMove = Math.min(window.scrollY * 0.08, 58);

  root.style.setProperty("--scroll-progress", progress.toFixed(4));
  root.style.setProperty("--hero-y", `${heroMove}px`);
  root.style.setProperty("--strip-x", `${Math.round(progress * 360)}`);

  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  ticking = false;
};

const requestScrollTick = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollMotion);
    ticking = true;
  }
};

window.addEventListener("scroll", requestScrollTick, { passive: true });
window.addEventListener("resize", requestScrollTick);
updateScrollMotion();

const navLinks = [...document.querySelectorAll(".main-nav a")];
const sectionMap = new Map(navLinks.map((link) => [link.getAttribute("href"), link]));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = sectionMap.get(`#${entry.target.id}`);
      if (entry.isIntersecting && link) {
        navLinks.forEach((navLink) => navLink.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    });
  },
  {
    rootMargin: "-42% 0px -50% 0px",
    threshold: 0,
  }
);

document.querySelectorAll("main section[id]").forEach((section) => navObserver.observe(section));

if (!prefersReducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".magnetic-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 7;
      const tiltY = (x - 0.5) * 8;

      card.style.setProperty("--spot-x", `${Math.round(x * 100)}%`);
      card.style.setProperty("--spot-y", `${Math.round(y * 100)}%`);
      card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--spot-x", "50%");
      card.style.setProperty("--spot-y", "0%");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

const form = document.querySelector(".contact-form");
const note = document.querySelector(".form-note");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name");
  const email = data.get("email");
  const goal = data.get("goal");
  const subject = encodeURIComponent("Demande de coaching TEAM ACE ACADEMY");
  const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\nObjectif: ${goal}`);

  note.textContent = "Message préparé. Ton application mail va s’ouvrir.";
  window.location.href = `mailto:contact@teamaceacademy.com?subject=${subject}&body=${body}`;
});
