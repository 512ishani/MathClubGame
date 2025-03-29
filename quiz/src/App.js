import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Styles.css';

function App() {
  const [setId, setSetId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [themeClass, setThemeClass] = useState('theme-navy'); // Default theme

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endQuiz();
    }
  }, [quizStarted, timeLeft]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/questions/${setId}`);
      setQuestions(response.data);
      setQuizStarted(true);
      setThemeClass(getThemeClass(setId));
      document.body.className = getThemeClass(setId);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const getThemeClass = (setId) => {
    switch (setId) {
      case '1': return 'theme-sherlock';
      case '2': return 'theme-harrypotter';
      case '3': return 'theme-junglebook';
      case '4': return 'theme-timetravel';
      default: return 'theme-navy';
    }
  };

  const getBackgroundStyle = () => {
    switch (themeClass) {
      case 'theme-sherlock': return { backgroundImage: `url(${process.env.PUBLIC_URL}/sherlock-bg.jpg)`, backgroundColor: '#3e2723' };
      case 'theme-harrypotter': return { backgroundImage: `url(${process.env.PUBLIC_URL}/potter-bg.jpg)`, backgroundColor: '#2a1a5e' };
      case 'theme-junglebook': return { backgroundColor: '#2e8b57' };
      case 'theme-timetravel': return { backgroundColor: '#4b0082' };
      default: return { backgroundColor: '#001f3f' };
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    setQuizCompleted(true);
    setQuizStarted(false);
  };

  return (
    <div className="App" style={getBackgroundStyle()}>
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
          <h2 className="timer">⏳ Time Left: {timeLeft} seconds</h2>
          {questions.length > 0 && currentQuestion < questions.length ? (
            <div className="question">
              <h3>Question {currentQuestion + 1}:</h3>
              <p>{questions[currentQuestion]?.question_text || "Loading..."}</p>
              <input
                type="text"
                placeholder="Your answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={quizCompleted}
              />
              {currentQuestion < questions.length - 1 ? (
                <button onClick={nextQuestion} className="next-button">Next Question</button>
              ) : (
                <button onClick={endQuiz} className="end-button">End Quiz</button>
              )}
            </div>
          ) : (
            <div>
              <h2>🎉 Quiz Completed! Well done!</h2>
              <h3>⏳ Time Taken: {120 - timeLeft} seconds</h3>
              <button onClick={() => window.location.reload()}>Return to Home Page</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
