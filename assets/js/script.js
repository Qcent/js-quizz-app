let viewScores = document.querySelector("#high-score");
let timerValue = document.querySelector("#timer-value");
let introCard = document.querySelector(".intro");
let qHolder = document.querySelector("main");
let tempHolder = {};
let quizFeedback = document.querySelector("#feedback");

let quizTimer = 25;
let score = 0;
let currentQuestion = -1;
let stopQuiz = false;
let hsInput = false;
let highScores = [];

const quizQuestion = [{
        Q: "What is your name?",
        options: ["John", "Dave", "Kim", "Larry"],
        A: "1"
    },
    {
        Q: "What is your favourite color?",
        options: ["Blue", "Yellow", "Red", "Green"],
        A: "3"
    }
];
quizFeedback.displayFeedback = function(msg) {
    /*because JavaScript is wild
       // lets add this method to the quizzFeedback object we are using as a 
       // DOM reference to the feedback div in the HTML */

    //this method will replace the element 'feedback-wrapper' with a new one when a question is answered
    // the element swap is used to refresh the css animation if ther user clicks quickly through answers
    // this is the only way to restart the animation from the begining

    let oldEl = quizFeedback.querySelector(".feedback-wrapper");
    let newEl = document.createElement('div');
    newEl.className = 'feedback-wrapper flashBack';
    newEl.textContent = msg;

    quizFeedback.replaceChild(newEl, oldEl);
}
const showHighScore = function() {
    if (qHolder.querySelector("h1").textContent === "High Scores") { return; } //dont do anything if the High score is already on screen
    tempHolder = qHolder.innerHTML;
    qHolder.innerHTML = "<div class='intro'><h1>High Scores</h1>";

    highScores.forEach(function(hs) {
        qHolder.innerHTML += "<div class='hiscore-entry'>" + hs.name + " - " + hs.score + "</div>"
    });

    qHolder.innerHTML += "<button class='btn' id='hs-ok'>Ok</button></div>";
}
const runQuizTimer = function() {
    if (stopQuiz) { // abort if stopQuiz is true
        return;
    }
    setTimeout(function() {
        if (stopQuiz) { return; } // abort if stopQuiz is true
        quizTimer--; // decrement timer
        timerValue.textContent = quizTimer; //update timer on screen
        if (quizTimer <= 0) { // if out of time 

            endQuiz("Time's Up"); //alert
            return; // abort countdown
        }
        runQuizTimer(); // else run this function again 
    }, 1000); //in 1 second
};
const renderQuestion = function(idx) {
    //create div element of class question
    let nextQ = document.createElement("div");
    nextQ.className = "question";
    nextQ.setAttribute("data-Q-id", idx); // set a data id for question

    // add h2 element that contains question
    let qh2 = document.createElement('h2');
    qh2.textContent = quizQuestion[idx].Q;

    //create ul of possible answers
    let qol = document.createElement("ol");

    for (let i = 0; i < quizQuestion[idx].options.length; i++) {
        let qli = document.createElement("li"); // create a li
        qli.className = "btn"; // class of button (btn)
        qli.setAttribute("data-A-id", i); // set a data id for answer
        qli.textContent = quizQuestion[idx].options[i]; // set the text to the possible answer
        qol.appendChild(qli); // append this option to the list
    }
    //append all elements
    nextQ.appendChild(qh2);
    nextQ.appendChild(qol);

    qHolder.appendChild(nextQ);
}
const questionButtonHandler = function(event) {

    if (event.target.matches("#start-quiz")) {
        startQuiz();
    }
    if (event.target.matches("li.btn")) { //only triggers if a li button is clicked (in quiz)
        var answerId = event.target.getAttribute("data-A-id");

        if (answerId === quizQuestion[currentQuestion].A) {
            console.log("you chose wisely")
            score++;
            quizFeedback.displayFeedback('Correct!');
        } else {
            console.log("wrong!")
            quizFeedback.displayFeedback('Wrong!');
            quizTimer -= 10; // deduct time for wrong answer
            timerValue.textContent = quizTimer; //update timer on screen
            if (quizTimer <= 0) { //if tester is now out of time
                endQuiz();
                return;
            }
        }
        let oldQuestion = document.querySelector(".question[data-Q-id='" + currentQuestion + "']");
        oldQuestion.remove();

        nextQuestion();
    }
    if (event.target.matches("span.btn")) { //only triggers if a span button is clicked ie the endGame high score form
        let nameforScore = document.querySelector("#hs-name").value
        addScore(nameforScore, score);
    }
    if (event.target.matches("#hs-ok")) { //only triggers if highscore ok button is pushed
        qHolder.innerHTML = '';
        if (stopQuiz && !hsInput) { qHolder.appendChild(introCard); } // restore the start screen
        else { qHolder.innerHTML = tempHolder; }
    }
};
const nextQuestion = function() {
    currentQuestion++;
    if (currentQuestion >= quizQuestion.length) {

        endQuiz();
        return;
    }
    renderQuestion(currentQuestion);
}
const startQuiz = function() {
    //clear the main section
    qHolder.innerHTML = '';

    // reset score, timer, question count and stopQuizz flag
    stopQuiz = false;
    currentQuestion = -1;
    score = 0;
    quizTimer = (quizQuestion.length) * 10; // add 10 seconds per question to the timer
    timerValue.textContent = quizTimer; // update on screen timer

    // start the timer
    runQuizTimer();

    //show a question 
    nextQuestion(); //will advance currentQuestion and display it
    //all further steps are handeled byt the qHolder event listener

};
const renderEndGame = function(msg) {
    //create div element of class question
    hsInput = true;
    let endGame = document.createElement("div");
    endGame.className = "outro";

    // add h2 title
    let title = document.createElement('h2');
    title.textContent = msg; // out of time!  | all done!

    //create div with score
    let text = document.createElement("div");
    text.textContent = "Your final score is " + score + ".";

    //another div for the form
    let form = document.createElement('div');
    form.className = "form";
    form.innerHTML = "<span>Enter Initials:</span> <input type='text' maxlength=4 id='hs-name'><span class='btn highscore'>Submit</span>";

    //append all elements
    endGame.appendChild(title);
    endGame.appendChild(text);
    endGame.appendChild(form);

    qHolder.appendChild(endGame);
}
const endQuiz = function(msg) {
    qHolder.innerHTML = ''; //clear the main section
    stopQuiz = true; // stop quiz flag for timer abort

    if (!msg) { msg = "All done!"; } // a message for the end screen
    // calculate score
    score += (quizTimer > 0) ? quizTimer : 0; // if there is time on the clock add it to score otherwise add 0

    renderEndGame(msg);

    //quizFeedback.textContent = "Your Score: " + score;

};
const addScore = function(name, score) {
    hsInput = false;
    let isHighScore = false;

    highScores.forEach(function(hs) {
        if (score > hs.score) { // testers score > the stored score
            isHighScore = true; // set highscore flag true
        }
    });
    if (highScores.length < 5 || isHighScore) { // if total hiscores are less then 5 or the high score flag was set
        highScores.push({ "name": name, "score": score }); //add the score
        alert("You got a high score!"); // alert the tester
        highScores.sort(function(a, b) { return b.score - a.score }); //sort by high score
        highScores = highScores.slice(0, 5); //only top 5 scores are kept
        localStorage.setItem('js-quiz-highscore', JSON.stringify(highScores)); //save the high scores
    } else {
        alert("Sorry, your score didn't make the cut.");
    }

    showHighScore();

}
const loadScores = function() {
    highScores = JSON.parse(localStorage.getItem('js-quiz-highscore')); //load the data
    if (!highScores) { highScores = []; } //make sure its not null
    highScores.sort(function(a, b) { return b.score - a.score }); //sort by high score
}

viewScores.addEventListener('click', showHighScore);
qHolder.addEventListener("click", questionButtonHandler);

loadScores();