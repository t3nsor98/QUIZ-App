import { useEffect } from "react";
import { useState } from "react";
import Quiz from "../components/Quiz";
import Welcome from "../components/Welcome";

function App() {
  const [gameActive, setGameActive] = useState(false);
  const [quizData, setQuizData] = useState();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  // this will run only once when the error message is triggered and will remove this after 5 seconds
  useEffect(() => {
    const errorTimer = setTimeout(() => {
      setLoadingSpinner(false);
      setErrorMessage(false);
    }, 5000);
    return () => clearTimeout(errorTimer);
  }, [errorMessage]);

  // the game will start when the user clicks the start button
  async function handleClick(formData) {
    const categoryValue =
      formData.category === "any" ? "" : `&category=${formData.category}`;
    const difficultyValue =
      formData.difficulty === "any" ? "" : `&difficulty=${formData.difficulty}`;

    try {
      setLoadingSpinner(true);
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${formData.amount}${categoryValue}${difficultyValue}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      } else {
        const data = await response.json();
        setQuizData(data);
        setLoadingSpinner(false);
        setGameActive(true);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(true);
    }
  }

  // this function will restart the game
  function restartGame() {
    setGameActive(false);
    setQuizData();
  }

  return (
    <div>
      {!gameActive && (
        <Welcome
          handleClick={handleClick}
          errorMessage={errorMessage}
          loadingSpinner={loadingSpinner}
        />
      )}

      {gameActive && <Quiz quizData={quizData} restartGame={restartGame} />}
    </div>
  );
}

export default App;
