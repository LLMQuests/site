(function () {
  "use strict";

  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  // ----- Navbar scroll state -----
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  // ----- Active section highlight -----
  const sectionIds = [
    "hero",
    "about",
    "features",
    "how-it-works",
    "levels",
    "cta",
  ];

  function setActiveLink() {
    const scrollY = window.scrollY + 120;
    let activeId = "hero";

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionIds[i]);
      if (section && section.offsetTop <= scrollY) {
        activeId = sectionIds[i];
        break;
      }
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (href === "#" + activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        navbar.classList.remove("open");
      }
    });
  });

  // ----- Mobile menu -----
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navbar.classList.toggle("open");
      const expanded = navbar.classList.contains("open");
      navToggle.setAttribute("aria-expanded", expanded);
    });
  }

  // ----- Scroll-triggered animations -----
  const animated = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
  );

  animated.forEach(function (el) {
    observer.observe(el);
  });

  // ----- Early access form -----
  const ctaForm = document.getElementById("cta-form");
  const ctaSuccess = document.getElementById("cta-success");
  const ctaEmail = document.getElementById("cta-email");
  const ctaSubmit = document.getElementById("cta-submit");

  const ctaFormWrap = document.getElementById("cta-form-wrap");

  // API base: same origin when served from this app. Set data-api-base on the script tag to the origin where /api/early-access lives (e.g. https://app.llmquests.com).
  var EARLY_ACCESS_API_BASE = (function () {
    var script =
      document.getElementById("early-access-script") ||
      document.querySelector("script[src*='script.js']");
    var base = (script && script.getAttribute("data-api-base")) || "";
    return base ? base.replace(/\/$/, "") : "";
  })();

  /**
   * Submits email to the waiting list via the Next.js API. Fire-and-forget; no error shown to user.
   * @param {string} email - User's email address
   */
  function submitEarlyAccessEmail(email) {
    var origin = EARLY_ACCESS_API_BASE || window.location.origin;
    var url = origin.replace(/\/$/, "") + "/api/early-access";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, source: "landing" }),
    }).catch(function () {});
  }

  function showEarlyAccessSuccess() {
    if (ctaFormWrap) ctaFormWrap.classList.add("cta-form-hidden");
    ctaSuccess.hidden = false;
    ctaSuccess.classList.add("cta-success-visible");
    if (ctaEmail) ctaEmail.value = "";
    if (ctaSubmit) {
      ctaSubmit.disabled = false;
      ctaSubmit.classList.remove("cta-btn-loading");
    }
    if (ctaEmail) ctaEmail.disabled = false;
    requestAnimationFrame(function () {
      ctaSuccess.classList.add("cta-success-animate");
    });
  }

  if (ctaForm && ctaSuccess) {
    ctaForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = ctaEmail && ctaEmail.value ? ctaEmail.value.trim() : "";
      if (!email) return;

      if (ctaSubmit) {
        ctaSubmit.disabled = true;
        ctaSubmit.classList.add("cta-btn-loading");
      }
      if (ctaEmail) ctaEmail.disabled = true;

      if (window.posthog) {
        posthog.capture("early_access_signup", { email: email });
      }
      submitEarlyAccessEmail(email);
      showEarlyAccessSuccess();
    });
  }
})();
