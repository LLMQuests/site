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

  // API base for early-access: same origin by default. Override via data-api-base on the script tag (e.g. <script src="script.js" data-api-base="https://app.llmquests.com">).
  var EARLY_ACCESS_API_BASE = (function () {
    var script = document.getElementById("early-access-script") || document.querySelector("script[src*='script.js']");
    return (script && script.getAttribute("data-api-base")) || "";
  })();

  /**
   * Submits email to the waiting list via the Next.js API.
   * @param {string} email - User's email address
   * @returns {Promise<void>}
   */
  function submitEarlyAccessEmail(email) {
    var url = (EARLY_ACCESS_API_BASE || window.location.origin) + "/api/early-access";
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, source: "landing" }),
    }).then(function (res) {
      if (!res.ok) {
        return res.json().then(function (data) {
          var msg = (data && data.error) ? data.error : "Something went wrong.";
          throw new Error(msg);
        }).catch(function () {
          throw new Error("Something went wrong. Please try again.");
        });
      }
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

      submitEarlyAccessEmail(email)
        .then(function () {
          if (ctaFormWrap) ctaFormWrap.classList.add("cta-form-hidden");
          ctaSuccess.hidden = false;
          ctaSuccess.classList.add("cta-success-visible");
          if (ctaEmail) ctaEmail.value = "";
          requestAnimationFrame(function () {
            ctaSuccess.classList.add("cta-success-animate");
          });
        })
        .catch(function (err) {
          if (ctaSubmit) {
            ctaSubmit.disabled = false;
            ctaSubmit.classList.remove("cta-btn-loading");
          }
          if (ctaEmail) ctaEmail.disabled = false;
          var message = (err && err.message) ? err.message : "Something went wrong. Please try again or email us at hello@llmquests.com.";
          alert(message);
        })
        .then(function () {
          if (ctaSubmit) {
            ctaSubmit.disabled = false;
            ctaSubmit.classList.remove("cta-btn-loading");
          }
          if (ctaEmail) ctaEmail.disabled = false;
        });
    });
  }

})();
