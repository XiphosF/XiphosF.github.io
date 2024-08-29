const questions = {
    facile: [
        {
            question: "Quelle est la capitale de la France ?",
            answer: "Paris",
            media: null
        },
        {
            question: "Quel animal peut-on voir sur cette image ?",
            answer: "Un lion",
            media: '<img src="/api/placeholder/400/300" alt="Image d\'un lion">'
        }
    ],
    moyen: [
        {
            question: "Quel est le plus grand océan du monde ?",
            answer: "L'océan Pacifique",
            media: null
        },
        {
            question: "Qui a peint La Joconde ?",
            answer: "Léonard de Vinci",
            media: '<img src="/api/placeholder/400/300" alt="Image de La Joconde">'
        }
    ],
    difficile: [
        {
            question: "Quelle est la formule chimique de l'eau ?",
            answer: "H2O",
            media: null
        },
        {
            question: "En quelle année a eu lieu la Révolution française ?",
            answer: "1789",
            media: '<img src="/api/placeholder/400/300" alt="Image de la Révolution française">'
        }
    ]
};

let currentQuestions;
let currentQuestionIndex = 0;
let timer;
let timePerQuestion;

document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('nextButton').addEventListener('click', nextQuestion);

function startQuiz() {
    const difficulty = document.getElementById('difficulty').value;
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    currentQuestions = questions[difficulty];
    currentQuestionIndex = 0;

    document.getElementById('config').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const question = currentQuestions[currentQuestionIndex];
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
    if (currentQuestionIndex < currentQuestions.length) {
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