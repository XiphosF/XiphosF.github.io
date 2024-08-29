let questions;
let currentQuestions;
let currentQuestionIndex = 0;
let timer;
let timePerQuestion;
let numberOfQuestions;

document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('nextButton').addEventListener('click', nextQuestion);

// Charger les questions depuis le fichier JSON
fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    document.getElementById('startQuiz').disabled = false;
  })
  .catch(error => console.error('Erreur lors du chargement des questions:', error));

function startQuiz() {
    const difficulty = document.getElementById('difficulty').value;
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    numberOfQuestions = parseInt(document.getElementById('numberOfQuestions').value);
    
    if (questions && questions[difficulty]) {
        currentQuestions = shuffleArray(questions[difficulty]).slice(0, numberOfQuestions);
        currentQuestionIndex = 0;

        document.getElementById('config').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';
        document.getElementById('totalQuestions').textContent = numberOfQuestions;
        
        loadQuestion();
    } else {
        alert("Erreur: Impossible de charger les questions. Veuillez réessayer.");
    }
}

function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    document.getElementById('currentQuestionNumber').textContent = currentQuestionIndex + 1;
    document.getElementById('time').textContent = timePerQuestion;
    document.getElementById('media').innerHTML = question.media || '';
    document.getElementById('question').textContent = question.question;
    document.getElementById('answer').style.display = 'none';
    document.getElementById('answer').textContent = '';
    document.getElementById('nextButton').style.display = 'none';

    startTimer();
}

function startTimer() {
    let time = timePerQuestion;
    clearInterval(timer);
    timer = setInterval(() => {
        document.getElementById('time').textContent = time;
        if (--time < 0) {
            clearInterval(timer);
            showAnswer();
        }
    }, 1000);
}

function showAnswer() {
    const answer = currentQuestions[currentQuestionIndex].answer;
    document.getElementById('answer').textContent = `Réponse : ${answer}`;
    document.getElementById('answer').style.display = 'block';
    document.getElementById('nextButton').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < numberOfQuestions) {
        loadQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    alert('Quiz terminé !');
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('config').style.display = 'block';
    currentQuestionIndex = 0;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}