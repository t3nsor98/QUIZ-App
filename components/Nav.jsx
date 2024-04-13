import ThemeToggle from "./ThemeToggle";

export default function Nav(props) {
  return (
    <div className="nav-bar">
      <button className="exit-button" onClick={props.restartGame}>
        Exit quiz
      </button>
      <ThemeToggle />
    </div>
  );
}
