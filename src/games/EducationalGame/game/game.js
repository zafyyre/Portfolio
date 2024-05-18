let shuffledIndices = [];

let currentIndex = 0; // keeps track of the current position within the shuffledIndices array during the game
let count = 1; 

function loadPage() {
    return fetch('../data/questions.json') // Return the fetch promise
    .then(response => response.json())
    .then(data => {
        // Only shuffle if shuffledIndices is empty or all questions have been cycled through
        if (shuffledIndices.length === 0 || currentIndex >= shuffledIndices.length) {
            shuffledIndices = createShuffledIndices(data.questions.length);
            currentIndex = 0;  // Reset index to start from the first question
        }
        startGame(data.questions); // Start the game with the current or new shuffled list
    })
    .catch(error => console.error('Error loading the JSON:', error));
}


function loadCompliments() {
    return fetch('../data/compliments.json')  // Return the fetch promise
        .then(response => response.json())
        .then(data => {
            let compliments = data.compliments;
            let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];  // Select a random compliment
            return randomCompliment;  // Return the random compliment
        })
        .catch(error => {
            console.error('Error loading the compliments:', error);
        });
}


function generateQuestion(questions) {
    let gameSection = document.getElementById('gameSection');
    let firstButton = document.getElementById('button1');
    let questionElement = document.getElementById('question');

    let questionIndex = shuffledIndices[currentIndex];
    let randomQuestion = questions[questionIndex].question;

    questionElement.textContent = randomQuestion;

    gameSection.insertBefore(questionElement, firstButton); // Ensure question is placed correctly

    currentIndex++;  // Increment for the next call
    return questions[questionIndex];
}


function createShuffledIndices(length) {
    // Create an array of indices [0, 1, 2, ..., length - 1]
    let indices = Array.from({length: length}, (v, k) => k);

    // Shuffle the array using the Fisher-Yates shuffle algorithm
    for (let i = indices.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [indices[i], indices[j]] = [indices[j], indices[i]]; // Swap elements
    }

    return indices;
}

function shuffleAnswers(answers) { // Shuffle answers so that it is different every time
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [answers[i], answers[j]] = [answers[j], answers[i]]; // Swap elements
    }
}

function generateAnswers(question) {
    let answers = question.options;
    shuffleAnswers(answers);
    for (let i = 1; i <= 4; i++) { // Assign all 4 buttons with all 4 answers
        let button = document.getElementById('button' + i);
        button.textContent = answers[i-1]; // Assign text content to button

        button.onclick = function() {
            checkSelectedAnswer(answers[i-1], question.correctAnswer, button)
        }
    }    
}

function checkSelectedAnswer(selectedAnswer, correctAnswer, button) {
    if (selectedAnswer === correctAnswer) {
        console.log("Correct!");
        button.style.background = 'green';
        showResult(correctAnswer);
        nextQuestion();
    } else {
        console.log("Wrong!");
        button.style.background = 'red';
    }
}

function disableAllButtons() {
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById('button' + i);
        button.disabled = true;  // Disable the button
    }
}

function resetButtonStyles() {
    for (let i = 1; i <= 4; i++) {
        let button = document.getElementById('button' + i);
        button.style.background = 'white';  // Reset the background color to white
        button.disabled = false;  // Re-enable the button for the next question
    }
}

function nextQuestion() {
    let questionNumber = document.getElementById('questionNumber');

    disableAllButtons();

    setTimeout(() => {
        count++;  // Increment the count of answered questions
        questionNumber.textContent = 'Question ' + count;  // Update display

        // CHANGE THIS BACK TO shuffledIndices WHEN DONE!!!!!!!!!!!!!!!!!!
        if (count >= shuffledIndices) {
            // If all questions have been answered, navigate to end.html
            window.location.href = '../end/end.html';
        } else {
            // If less than the max number of questions, continue with the quiz
            resetButtonStyles();
            if (currentIndex < shuffledIndices.length) {
                loadPage();  // Load the next question using the current shuffled list
            } else {
                // Optionally handle the end of the questions list, such as reshuffling or restarting
                console.log("All questions answered, ending the session.");
                window.location.href = '../end/end.html';  // Navigate if there's no more questions to cycle through
            }
        }
    }, 4000);  // Wait 4 seconds to show the result of the current question
}

function showResult(answer) {
    loadCompliments().then(compliment => {  // Wait for the compliment promise to resolve
        let resultDivBackground = document.getElementById('resultDivBackground');
        let resultDiv = document.getElementById('resultDiv');
        let resultH1 = document.createElement('h1');  // Create a new h1 element for the message

        resultH1.innerHTML = `${compliment} The Correct Answer was ${answer}!`;

        // Clear previous content and append new result
        resultDiv.innerHTML = '';  // Clear existing content if any
        resultDiv.appendChild(resultH1);

        // Display the overlay and result div
        resultDivBackground.style.display = 'flex';

        // Automatically hide the overlay and result after 4 seconds
        setTimeout(() => {
            resultDivBackground.style.display = 'none';
        }, 4000);
    });
}

function clearScreen() {
    let gameSection = document.getElementById('gameSection');
    gameSection.style.display = 'none';  // Hide the game section
}

function startGame(questions) {
    let question = generateQuestion(questions);
    generateAnswers(question);
}
