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

})();
