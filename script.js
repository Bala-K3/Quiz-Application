const questions = [
   {
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Transfer Markup Language"],
    answer: "HyperText Markup Language"
  },
  {
    question: "Which language is used for styling web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: "CSS"
  },
  {
    question: "Which is not a JavaScript data type?",
    options: ["String", "Boolean", "Number", "Float"],
    answer: "Float"
  },
  {
    question: "Which tag is used for inserting the largest heading in HTML?",
    options: ["<h6>", "<heading>", "<h1>", "<head>"],
    answer: "<h1>"
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Colorful Style Sheets", "Computer Style Sheets", "Creative Style Sheets"],
    answer: "Cascading Style Sheets"
  },
  {
    question: "Where is the correct place to insert a JavaScript file?",
    options: ["Both the <head> and <body>", "Only the <head>", "Only the <body>", "After </html>"],
    answer: "Both the <head> and <body>"
  },
  {
    question: "Which property is used to change the background color in CSS?",
    options: ["color", "bgcolor", "background-color", "background"],
    answer: "background-color"
  },
  {
    question: "How do you create a function in JavaScript?",
    options: ["function = myFunc()", "function:myFunc()", "function myFunc()", "create myFunc()"],
    answer: "function myFunc()"
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["<!-- -->", "//", "#", "/* */"],
    answer: "//"
  },
  {
    question: "How do you call a function named test in JavaScript?",
    options: ["call test()", "test()", "run test", "go test()"],
    answer: "test()"
  }
];

let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let userAnswers = [];
let highScore = localStorage.getItem("highscore") || 0;

let timeLeft = 0;
let timer = null;

const questionE1 = document.getElementById('question');
const optionsE1 = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const scoreE1 = document.getElementById('score');
const resetBtn = document.getElementById('resetBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const wrongSound = document.getElementById("wronganswer");
const correctSound = document.getElementById("correctanswer");
const completed = document.getElementById("completed");
const failed = document.getElementById("failed");
const timerE1 = document.getElementById("timer");

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const startTimer = () => {
  clearInterval(timer);
  timeLeft = 30;
  timerE1.textContent = `Time left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerE1.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextBtn.disabled = false;
      failed.play();
    }
  }, 1000);
};

const updateProgressBar = () => {
  const progress = ((currentQuestion) / shuffledQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${currentQuestion} / ${shuffledQuestions.length}`;
};

const loadQuestion = () => {
  clearInterval(timer);
  startTimer();
  nextBtn.disabled = true;
  const current = shuffledQuestions[currentQuestion];
  questionE1.textContent = current.question;
  optionsE1.innerHTML = '';

  current.options.forEach(optionText => {
    const option = document.createElement('div');
    option.className = 'option';
    option.textContent = optionText;
    option.addEventListener('click', () => selectOption(option, optionText));
    optionsE1.appendChild(option);
  });

  if (userAnswers[currentQuestion] !== undefined) {
    const selectedAnswer = userAnswers[currentQuestion];
    const correctAnswer = current.answer;

    Array.from(optionsE1.children).forEach(option => {
      const optionText = option.textContent;
      if (optionText === correctAnswer) {
        option.classList.add('correct');
      } else {
        option.classList.add('incorrect');
      }
      option.style.pointerEvents = "none";
    });

    nextBtn.disabled = false;
  }

  prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
  progressContainer.style.display = currentQuestion > 0 ? 'inline-block' : 'none';

  updateProgressBar();
};

const selectOption = (selectedE1, selectedAnswer) => {
  const correctAnswer = shuffledQuestions[currentQuestion].answer;

  if (userAnswers[currentQuestion] === undefined) {
    userAnswers[currentQuestion] = selectedAnswer;

    if (selectedAnswer === correctAnswer) {
      score++;
      correctSound.play();
    } else {
      wrongSound.play();
    }

    Array.from(optionsE1.children).forEach(option => {
      option.classList.add(option.textContent === correctAnswer ? 'correct' : 'incorrect');
      option.style.pointerEvents = "none";
    });

    nextBtn.disabled = false;
    clearInterval(timer);
  }
};

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < shuffledQuestions.length) {
    loadQuestion();
  } else {
    showScore();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  scoreE1.textContent = '';
  nextBtn.style.display = 'inline-block';
  resetBtn.style.display = 'none';
  progressBar.style.display = 'block';
  progressContainer.style.display = 'block';
  progressBar.style.width = '0%';
  progressBar.textContent = '';
  shuffledQuestions = shuffleArray([...questions]);
  loadQuestion();
});

const showScore = () => {
  clearInterval(timer);
  questionE1.textContent = "Quiz Completed!";
  optionsE1.innerHTML = '';
  nextBtn.style.display = "none";
  prevBtn.style.display = "none";
  progressContainer.style.display = "none";

  let message = '';
  if (score === shuffledQuestions.length) {
    message = "Perfect! Excellent score!";
    completed.play();
  } else if (score < shuffledQuestions.length / 2) {
    message = "Better luck next time!";
    failed.play();
  } else {
    message = "Good effort!";
    completed.play();
  }

  scoreE1.innerHTML = `Your score: ${score} out of ${shuffledQuestions.length}<br>${message}`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highscore', highScore);
    scoreE1.innerHTML += `<br>🎉 New High Score!`;
  } else {
    scoreE1.innerHTML += `<br>🏅 High Score: ${highScore}`;
  }

  resetBtn.textContent = "Restart Quiz";
  resetBtn.style.width = '100%';
  resetBtn.style.display = 'inline-block';
  progressBar.style.display = 'inline-block';
};

shuffledQuestions = shuffleArray([...questions]);
resetBtn.style.display = 'none';
loadQuestion();

// let currentQuestion = 0;
// let score = 0;
// let shuffledQuestions = [];
// let userAnswers = [];

// let timeLeft = 0;
// let timer = null;

// const questionE1 = document.getElementById('question');
// const optionsE1 = document.getElementById('options');
// const nextBtn = document.getElementById('nextBtn');
// const scoreE1 = document.getElementById('score');
// const resetBtn = document.getElementById('resetBtn');
// const prevBtn = document.getElementById('prevBtn');
// const progressBar = document.getElementById('progressBar');
// const progressContainer = document.getElementById('progressContainer');
// const wrongSound = document.getElementById("wronganswer");
// const correctSound = document.getElementById("correctanswer");
// const completed = document.getElementById("completed");
// const failed = document.getElementById("failed");
// const timerE1 = document.getElementById("timer");

// const shuffleArray = (array) => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

// const startTimer = () => {
//   clearInterval(timer);
//   timeLeft = 30;
//   timerE1.textContent = `Time left: ${timeLeft}s`;

//   timer = setInterval(() => {
//     timeLeft--;
//     timerE1.textContent = `Time left: ${timeLeft}s`;
//     if (timeLeft <= 0) {
//       clearInterval(timer);
//       nextBtn.disabled = false;
//       failed.play();
//     }
//   }, 1000);
// };

// const updateProgressBar = () => {
//   const progress = ((currentQuestion) / shuffledQuestions.length) * 100;
//   progressBar.style.width = `${progress}%`;
//   progressBar.textContent = `${currentQuestion} / ${shuffledQuestions.length}`;
// };

// const loadQuestion = () => {
//   clearInterval(timer);
//   startTimer();
//   nextBtn.disabled = true;
//   const current = shuffledQuestions[currentQuestion];
//   questionE1.textContent = current.question;
//   optionsE1.innerHTML = '';

//   current.options.forEach(optionText => {
//     const option = document.createElement('div');
//     option.className = 'option';
//     option.textContent = optionText;
//     option.addEventListener('click', () => selectOption(option, optionText));
//     optionsE1.appendChild(option);
//   });

//   if (userAnswers[currentQuestion] !== undefined) {
//     const selectedAnswer = userAnswers[currentQuestion];
//     const correctAnswer = current.answer;

//     Array.from(optionsE1.children).forEach(option => {
//       const optionText = option.textContent;
//       if (optionText === correctAnswer) {
//         option.classList.add('correct');
//       } else {
//         option.classList.add('incorrect');
//       }
//       option.style.pointerEvents = "none";
//     });

//     nextBtn.disabled = false;
//   }

//   prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
//   progressContainer.style.display = currentQuestion > 0 ? 'inline-block' : 'none';

//   updateProgressBar();
// };

// const selectOption = (selectedE1, selectedAnswer) => {
//   const correctAnswer = shuffledQuestions[currentQuestion].answer;

//   if (userAnswers[currentQuestion] === undefined || userAnswers[currentQuestion] === "⏱️ No answer") {
//     if (selectedAnswer === correctAnswer) {
//       score++;
//       correctSound.play();
//     } else {
//       wrongSound.play();
//     }
//     userAnswers[currentQuestion] = selectedAnswer;

//     Array.from(optionsE1.children).forEach(option => {
//       option.classList.add(option.textContent === correctAnswer ? 'correct' : 'incorrect');
//       option.style.pointerEvents = "none";
//     });

//     nextBtn.disabled = false;
//     clearInterval(timer);
//   }
// };

// nextBtn.addEventListener("click", () => {
//   currentQuestion++;
//   if (currentQuestion < shuffledQuestions.length) {
//     loadQuestion();
//   } else {
//     showScore();
//   }
// });

// prevBtn.addEventListener('click', () => {
//   if (currentQuestion > 0) {
//     currentQuestion--;
//     loadQuestion();
//   }
// });

// resetBtn.addEventListener('click', () => {
//   clearInterval(timer);
//   currentQuestion = 0;
//   userAnswers = [];
//   scoreE1.textContent = `${score}`;
//   nextBtn.style.display = 'inline-block';
//   resetBtn.style.display = 'none';
//   progressBar.style.display = 'block';
//   progressContainer.style.display = 'block';
//   progressBar.style.width = '0%';
//   progressBar.textContent = '';
//   shuffledQuestions = shuffleArray([...questions]);
//   loadQuestion();
// });

// const showScore = () => {
//   clearInterval(timer);
//   questionE1.textContent = "Quiz Completed!";
//   optionsE1.innerHTML = '';
//   nextBtn.style.display = "none";
//   prevBtn.style.display = "none";
//   progressContainer.style.display = "none";

//   let message = '';
//   if (score === shuffledQuestions.length) {
//     message = "Perfect! Excellent score!";
//     completed.play();
//   } else if (score < shuffledQuestions.length / 2) {
//     message = "Better luck next time!";
//     failed.play();
//   } else {
//     message = "Good effort!";
//     completed.play();
//   }

//   scoreE1.innerHTML = `Your score: ${score} out of ${shuffledQuestions.length}<br>${message}`;


//   resetBtn.textContent = "Restart Quiz";
//   resetBtn.style.width = '100%';
//   resetBtn.style.display = 'inline-block';
//   progressBar.style.display = 'inline-block';
// };

// shuffledQuestions = shuffleArray([...questions]);
// resetBtn.style.display = 'none';
// loadQuestion(); 

