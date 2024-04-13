import Nav from "./Nav.jsx";
import { v4 as uuidv4 } from "uuid";
import { decode } from "he";
import Confetti from "./Confetti.jsx";
import { useEffect, useState } from "react";

export default function Quiz(props) {
  const [questionData, setQuestionData] = useState(generateQuizData());
  const [quizElements, setQuizElements] = useState([]);
  const [newGame, setNewGame] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const allCorrect = correctAnswers === questionData.length;

  // sets state when new data comes in with the quiz elements and then when the check answers button is
  useEffect(() => {
    setQuizElements(quizElementsGenerator());
  }, [newGame]);

  // run only once setting up the form data when the component mounts using a map to allow for varied amounts of questions.
  function generateQuizData() {
    return props.data.results.map((question) => {
      let id = uuidv4();
      // building an array with all the answers once per fetch
      let questionsArray = [
        ...question.incorrect_answers,
        question.correct_answer,
      ];
      // shuffling the array except for the booleans. This makes them all render the same way(true, false)
      let randomArray =
        question.type === "boolean"
          ? questionsArray.sort().reverse()
          : questionsArray.sort(() => Math.random() - 0.5);
      return {
        ...question,
        answersArray: randomArray,
        id: id,
      };
    });
  }

  function checkAnswers() {
    // checking if the answer is correct
    setCorrectAnswers(
      questionData.filter(
        (question) => question.correct_answer === question[question.id]
      ).length
    );
    // changing to true triggers a re-render of the quiz to show answers as well as change the button to start a new game.
    setNewGame(true);
  }

  /**
   * Handles the change event and updates the question data.
   *
   * @param {object} e - the event object
   * @return {void}
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setQuestionData((prevQuestionData) => {
      return prevQuestionData.map((question) => {
        if (question.id === name) {
          return {
            ...question,
            [name]: value,
          };
        } else {
          return question;
        }
      });
    });
  }
  /**
   * Generates quiz elements based on the data results.
   * gets called when initializing quizElements state
   * @return {Array} an array of quiz elements
   * by setting things in state the values don't get recalculated every render
   * which was shuffling the answers repeatedly
   */
  function quizElementsGenerator() {
    // let unansweredQuestionStyle = ""
    return questionData.map((question) => {
      let decodedQuestion = decode(question.question);
      return (
        <li key={question.id} id={question.id} className="question">
          <h2>{decodedQuestion}</h2>
          <fieldset
            id="answer-container"
            className={
              question[question.id] ?? !newGame
                ? "answer-container"
                : "answer-container unanswered"
            }
          >
            <legend htmlFor="answer-container">Select an answer</legend>
            {generateAnswers(question)}
          </fieldset>
        </li>
      );
    });
  }
  /**
   * Randomizes the answers for a given question and returns a mapped array of JSX elements for each answer.
   *
   * @param {object} question - the question object containing incorrect and correct answers
   * @return {array} an array of JSX elements representing the randomized answers
   */
  function generateAnswers(question) {
    // using the data from state build out the answer list
    let classList = "answer";
    return question.answersArray.map((answer) => {
      // this "if" checks for the checked answers button to be clicked
      if (newGame) {
        classList = "answer checked";
        // this "if" is to style the selected input and the right answer correct or incorrect
        // I am feeling uncertain about this approach now, it has a codes smell to me but I am not sure of how to fix it without a complete refactor.
        // I think I would use state more to control the view rather than if statements and css classes if I was to do it again.
        if (
          answer === question[question.id] ||
          answer === question.correct_answer
        ) {
          classList =
            answer === question.correct_answer
              ? "answer correct"
              : "answer checked incorrect";
        }
      }

      // build out the JSX of the randomized answers to plug into the question element
      // matched the ID to the name value so that I can control the component and check answers
      let id = uuidv4();
      let decodedAnswer = decode(answer);
      return (
        <div key={id} className={classList}>
          <label htmlFor={id}> {decodedAnswer} </label>
          <input
            disabled={newGame}
            id={id}
            name={question.id}
            value={answer}
            onChange={handleChange}
            type="radio"
          />
        </div>
      );
    });
  }

  return (
    <div className="quiz">
      {allCorrect && <Confetti />}
      <Nav restartGame={props.restartGame} />
      <ol className="quiz">{quizElements}</ol>
      <div className="result-container">
        {newGame && (
          <p>
            You Scored {correctAnswers}/{questionData.length} correct answers
          </p>
        )}
        {newGame ? (
          <button onClick={props.restartGame} className="button">
            Play again
          </button>
        ) : (
          <button onClick={checkAnswers} className="button">
            Check Answers
          </button>
        )}
      </div>
    </div>
  );
}
