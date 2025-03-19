import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles.css';

function App() {
  const [setId, setSetId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [themeClass, setThemeClass] = useState('theme-navy'); // Default theme

  // Fetch questions by set_id
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/questions/${setId}`);
      setQuestions(response.data);
      setQuizStarted(true);

      // Dynamically set the theme based on setId
      let newThemeClass = 'theme-navy'; // Default theme
      switch (setId) {
        case '1':
          newThemeClass = 'theme-sherlock'; // sherlock theme
          break;
        case '2':
          newThemeClass='theme-harrypotter';//harry potter 
          break;
        case '3':
          newThemeClass='theme-junglebook';//junglebook 
          break;
        case '4':
          case '2':
          newThemeClass='theme-timetravel';//time travel 
          break;
        default:
          newThemeClass = 'theme-navy'; // Default theme
      }
      setThemeClass(newThemeClass);
      document.body.className = newThemeClass; // Update body class
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Validate user's answer
  const validateAnswer = async () => {
    try {
      const response = await axios.post('http://localhost:5000/validate', {
        question_id: questions[currentQuestion].question_id,
        answer: userAnswer,
      });
      if (response.data.correct) {
        setMessage('Correct! Moving to the next question...');
        if (currentQuestion === questions.length - 1) {
          setQuizCompleted(true);
          setMessage('Quiz Completed! Well done!');
        } else {
          setCurrentQuestion((prev) => prev + 1);
        }
        setUserAnswer('');
      } else {
        setMessage(`Incorrect! The correct answer is: ${response.data.correct_answer}`);
      }
    } catch (error) {
      console.error('Error validating answer:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || quizCompleted) {
      setMessage('Time is up!');
      setTimeout(() => {
        resetQuiz();
      }, 3000);
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  // Reset quiz state
  const resetQuiz = () => {
    setQuizStarted(false);
    setSetId('');
    setQuestions([]);
    setCurrentQuestion(0);
    setTimeLeft(120);
    setQuizCompleted(false);
    setMessage('');
    setThemeClass('theme-navy'); // Reset to default theme
    document.body.className = 'theme-navy'; // Reset body class
  };

  return (
    <div className="App">
      <h1>Cryptoscapes</h1>
      {!quizStarted ? (
        <div>
          <input
            type="number"
            placeholder="Enter Set ID"
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
          />
          <button onClick={fetchQuestions}>Start Quiz</button>
        </div>
      ) : (
        <div>
          <h2 className="timer">Time Left: {timeLeft} seconds</h2>
          {currentQuestion < questions.length ? (
            <div className="question">
              <h3>Question {currentQuestion + 1}:</h3>
              <p>{questions[currentQuestion].question_text}</p>
              <input
                type="text"
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={quizCompleted}
              />
              <button onClick={validateAnswer} disabled={quizCompleted}>
                Submit Answer
              </button>
            </div>
          ) : (
            <div>
              <h2>Quiz Completed! Well done!</h2>
              <h3>Time needed was : {120-timeLeft}</h3>
              <button onClick={resetQuiz}>Return to Home Page</button>
            </div>
          )}
          {message && <p className="message">{message}</p>}
        </div>
      )}
    </div>
  );
}

export default App;