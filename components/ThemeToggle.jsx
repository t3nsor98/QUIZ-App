export default function ThemeToggle() {
  function toggleTheme() {
    document.body.classList.toggle("dark-mode");
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    ></button>
  );
}
