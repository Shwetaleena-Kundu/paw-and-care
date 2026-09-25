// MOBILE NAVIGATION
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 767) closeMenu();
});

// HERO VIDEO
const heroVideo = document.querySelector(".hero-video");
const videoToggle = document.querySelector(".video-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateVideoButton() {
  const isPaused = heroVideo.paused;

  videoToggle.textContent = isPaused ? "Play" : "Pause";
  videoToggle.setAttribute(
    "aria-label",
    isPaused ? "Play hero video" : "Pause hero video"
  );
}

videoToggle.addEventListener("click", async () => {
  if (heroVideo.paused) {
    try {
      await heroVideo.play();
    } catch (error) {
      console.error("The hero video could not play:", error);
    }
  } else {
    heroVideo.pause();
  }

  updateVideoButton();
});

heroVideo.addEventListener("play", updateVideoButton);
heroVideo.addEventListener("pause", updateVideoButton);

if (reducedMotion.matches) heroVideo.pause();
updateVideoButton();

// SMOOTH SECTION SCROLLING
let scrollAnimation = null;

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = document.querySelector(hash);

    if (!target) return;

    event.preventDefault();

    if (scrollAnimation !== null) {
      cancelAnimationFrame(scrollAnimation);
      scrollAnimation = null;
    }

    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + start;
    const distance = end - start;

    // A little longer for sections farther away, without feeling slow.
    const duration = Math.min(1100, Math.max(650, Math.abs(distance) * 0.55));
    const startTime = performance.now();

    if (reducedMotion.matches) {
      window.scrollTo({ top: end, behavior: "instant" });
      history.pushState(null, "", hash);
      return;
    }

    function animateScroll(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2;

      window.scrollTo({
        top: start + distance * eased,
        behavior: "instant"
      });

      if (progress < 1) {
        scrollAnimation = requestAnimationFrame(animateScroll);
      } else {
        scrollAnimation = null;
        history.pushState(null, "", hash);
      }
    }

    scrollAnimation = requestAnimationFrame(animateScroll);
  });
});

// CONTACT FORM → WHATSAPP
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

const whatsappNumber = "918327708601";

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!/^\d{10,15}$/.test(whatsappNumber)) {
    formStatus.textContent =
      "WhatsApp contact is not configured yet. Please try again later.";
    return;
  }

  const formData = new FormData(contactForm);

  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const phone = String(formData.get("phone")).trim();
  const service = contactForm.elements.service.selectedOptions[0].text;
  const petMessage = String(formData.get("message")).trim();

  const message = [
    "Hello Paw & Care! I'd like to enquire about a visit.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Message: ${petMessage}`
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  formStatus.textContent =
    "WhatsApp is opening. Press Send there to complete your enquiry.";

  window.location.href = whatsappUrl;
});