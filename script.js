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
        },
        {
            question: "Combien y a-t-il de continents sur Terre ?",
            answer: "7",
            media: null
        },
        {
            question: "Quelle planète est surnommée la planète rouge ?",
            answer: "Mars",
            media: null
        },
        {
            question: "Quel est le plus grand mammifère terrestre ?",
            answer: "L'éléphant d'Afrique",
            media: null
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
        },
        {
            question: "En quelle année a débuté la Première Guerre mondiale ?",
            answer: "1914",
            media: null
        },
        {
            question: "Quel est l'élément chimique le plus abondant dans l'univers ?",
            answer: "L'hydrogène",
            media: null
        },
        {
            question: "Qui a écrit '1984' ?",
            answer: "George Orwell",
            media: null
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
        },
        {
            question: "Qui a formulé la théorie de la relativité ?",
            answer: "Albert Einstein",
            media: null
        },
        {
            question: "Quel est le plus petit pays du monde ?",
            answer: "Le Vatican",
            media: null
        },
        {
            question: "Qui a écrit 'L'Odyssée' ?",
            answer: "Homère",
            media: null
        }
    ]
};

let currentQuestions;
let currentQuestionIndex = 0;
let timer;
let timePerQuestion;
let numberOfQuestions;

document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('nextButton').addEventListener('click', nextQuestion);

function startQuiz() {
    const difficulty = document.getElementById('difficulty').value;
    timePerQuestion = parseInt(document.getElementById('timePerQuestion').value);
    numberOfQuestions = parseInt(document.getElementById('numberOfQuestions').value);
    
    currentQuestions = shuffleArray(questions[difficulty]).slice(0, numberOfQuestions);
    currentQuestionIndex = 0;

    document.getElementById('config').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('totalQuestions').textContent = numberOfQuestions;
    
    loadQuestion();
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