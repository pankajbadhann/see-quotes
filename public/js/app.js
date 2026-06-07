/* =========================
   DARK MODE TOGGLE
========================= */

const toggleBtn = document.getElementById("themeToggle");

// apply saved theme on load
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  if (toggleBtn) toggleBtn.innerText = "☀️";
}

// toggle theme
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    toggleBtn.innerText = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}