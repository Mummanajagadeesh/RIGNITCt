/**
 * Mobile Navbar Functionality
 * Handles hamburger menu toggle and responsive behavior
 */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNavbar();
});

function initMobileNavbar() {
  console.log("MobileNavbar: initMobileNavbar called");
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");
  const navLinksOriginalParent = nav;
  const navLinksNextSibling = navLinks.nextSibling;

  if (!nav || !navLinks) return;

  // Create hamburger button if it doesn't exist
  let hamburger = document.querySelector(".hamburger-menu");

  if (!hamburger) {
    hamburger = document.createElement("button");
    hamburger.className = "hamburger-menu";
    hamburger.innerHTML = "≡";
    hamburger.setAttribute("aria-label", "Toggle menu");
    hamburger.setAttribute("aria-expanded", "false");

    // Insert hamburger button before the sponsor button or at the end
    const sponsorBtn = nav.querySelector(".btn-sponsor");
    if (sponsorBtn) {
      nav.insertBefore(hamburger, sponsorBtn);
    } else {
      nav.appendChild(hamburger);
    }
  }

  // Sponsor will be cloned when opening mobile menu

  // Handle hamburger menu toggle
  hamburger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target) && navLinks.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // Close menu when clicking on nav links (mobile)
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && window.innerWidth <= 768) {
      setTimeout(() => {
        closeMobileMenu();
      }, 150);
    }
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // Handle escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.contains("open");
    console.log("MobileNavbar: toggleMobileMenu, isOpen=", isOpen);

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    console.log("MobileNavbar: openMobileMenu");
    navLinks.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    hamburger.innerHTML = "✕";
    // Clone sponsor button into mobile dropdown
    const originalSponsor = nav.querySelector(".btn-sponsor");
    if (originalSponsor) {
      const clonedSponsor = originalSponsor.cloneNode(true);
      clonedSponsor.classList.add("mobile-sponsor-clone");
      navLinks.appendChild(clonedSponsor);
    }

    // Force display for mobile: detach navLinks and insert after nav
    if (window.innerWidth <= 768) {
      nav.parentNode.insertBefore(navLinks, nav.nextSibling);
      navLinks.style.display = "flex";
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = "hidden";

    // Add active state for accessibility
    navLinks.setAttribute("aria-hidden", "false");
  }

  function closeMobileMenu() {
    console.log("MobileNavbar: closeMobileMenu");
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.innerHTML = "≡";

    // Restore body scroll
    document.body.style.overflow = "";

    // Update accessibility
    navLinks.setAttribute("aria-hidden", "true");
    // Restore navLinks into original position inside nav
    if (window.innerWidth <= 768) {
      nav.insertBefore(navLinks, navLinksNextSibling);
    }
    // Remove cloned sponsor button after closing mobile menu
    const mobileSponsor = navLinks.querySelector(".mobile-sponsor-clone");
    if (mobileSponsor) {
      mobileSponsor.remove();
    }
    // duplicate style reset removed
  }

  // Initialize accessibility attributes
  if (window.innerWidth <= 768) {
    navLinks.setAttribute("aria-hidden", "true");
  }
}

// Utility function to check if device is mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Export functions for external use if needed
window.MobileNavbar = {
  init: initMobileNavbar,
  isMobile: isMobile,
};
