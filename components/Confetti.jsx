import ReactConfetti from "react-confetti";


// made this its own component so that the confetti is always in view even when scrolled down

export default function Confetti() {
  return (
    <div className="confetti" ari-label="confetti">
      <ReactConfetti />
    </div>
  );
}
