/* ---------- Custom Cursor (CSS-driven Difference Effect) ---------- */
(function () {
  // Only proceed if the cursor element exists
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  // Select all interactive elements: a, button, year-btn, and the specific social links
  const hoverables = document.querySelectorAll("a, button, .year-btn, .socials a");

  document.addEventListener("mouseenter", () => cursor.classList.add("visible"));
  document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));

  // Hover effect (scaling)
  hoverables.forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });

  // Position tracking
  document.addEventListener("mousemove", e => {
    cursor.style.top = e.clientY + "px";
    cursor.style.left = e.clientX + "px";
  });
})();