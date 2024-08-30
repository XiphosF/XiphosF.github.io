let questions;
let currentQuestions;
let currentQuestionIndex = 0;
let timer;
let timePerQuestion;
let numberOfQuestions;
let player;

document.getElementById('startQuiz').addEventListener('click', startQuiz);
document.getElementById('nextButton').addEventListener('click', nextQuestion);

// Charger l'API YouTube
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  
  loadYouTubeAPI();
  
  // Fonction appelée lorsque l'API YouTube est prête
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('youtubePlayer', {
      height: '360',
      width: '640',
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };
  
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
      startTimer();
    }
  }

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
    document.getElementById('question').textContent = question.question;
    document.getElementById('answer').style.display = 'none';
    document.getElementById('answer').textContent = '';
    document.getElementById('nextButton').style.display = 'none';
  
    if (question.media && question.media.type === 'video') {
      loadVideoQuestion(question.media);
    } else {
      document.getElementById('media').innerHTML = question.media || '';
      startTimer();
    }
  }
  
  function loadVideoQuestion(mediaInfo) {
    const { url, start, end } = mediaInfo;
    const videoId = extractYouTubeVideoId(url);
    
    player.loadVideoById({
      videoId: videoId,
      startSeconds: start,
      endSeconds: end
    });
  
    player.playVideo();
  }
  
  function extractYouTubeVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
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