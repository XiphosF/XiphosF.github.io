let questions;
let currentQuestions;
let currentQuestionIndex = 0;
let timer;
let timePerQuestion;
let numberOfQuestions;
let player;
let playerReady = false;
// let start_timestamp=0;
// let end_timestamp=0;
let tmp=true

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
    createYouTubePlayer();
  };

  function createYouTubePlayer() {
    player = new YT.Player('youtubePlayer', {
    //   height: '360',
    //   width: '640',
    height:'432',
    width:'768',
      playerVars: {
        'rel': 0,
        'iv_load_policy': 3,
        'showinfo': 0,
        'fs': 0,
        'modestbranding': 1,
        'controls': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange  
      }
    });
  }

  function onPlayerReady() {
    playerReady = true;
    if (currentQuestions[currentQuestionIndex].media && currentQuestions[currentQuestionIndex].media.type === 'video') {
      loadVideoQuestion(currentQuestions[currentQuestionIndex].media);
    }
  }
  


  function onPlayerStateChange(event) {
    // console.log(event)
    if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {  
        if (tmp==true){
        startTimer();
        tmp=false;
    }}
    else if (event.data == YT.PlayerState.PLAYING){
        tmp=true;
        if (start_timestamp==end_timestamp){
            player.pauseVideo();
        }
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
    const mediaContainer = document.getElementById('media');
    // mediaContainer.innerHTML = '';
    const youtubePlayerContainer = document.getElementById('youtubePlayerContainer');
    mediaContainer.style.display = 'none';
    youtubePlayerContainer.style.display = 'none';
    if (question.media) {
        if (question.media.type === 'video') {
            youtubePlayerContainer.style.display = 'block';
            if (playerReady) {
                loadVideoQuestion(question.media);
            } else {
                console.log("Le lecteur YouTube n'est pas encore prêt. La vidéo sera chargée une fois le lecteur initialisé.");
            }
        } else {
            mediaContainer.style.display = 'block';
            mediaContainer.innerHTML = question.media;
            startTimer();
        }
    }
    else{
        startTimer();
    }
    
}
    

  
    function loadVideoQuestion(mediaInfo) {
        if (!playerReady) {
          console.log("Le lecteur YouTube n'est pas encore prêt. La vidéo sera chargée une fois le lecteur initialisé.");
          return;
        }
      
        const { url, start, end } = mediaInfo;
        const videoId = extractYouTubeVideoId(url);


        start_timestamp=start;
        end_timestamp=end;
        if (end!=start){
            player.loadVideoById({
                videoId: videoId,
                startSeconds: start,
                endSeconds: end,
                playerVars: {
                    'rel': 0,
                    'iv_load_policy': 3,
                    'showinfo': 0,
                    'fs': 0,
                    'modestbranding': 1,
                    'controls': 1
                }
              });    
        }
        else {
            player.loadVideoById({
                videoId: videoId,
                startSeconds: start,
                playerVars: {
                    'rel': 0,
                    'iv_load_policy': 3,
                    'showinfo': 0,
                    'fs': 0,
                    'modestbranding': 1,
                    'controls': 1
                }
              });  

            // player.pauseVideo();
        }


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