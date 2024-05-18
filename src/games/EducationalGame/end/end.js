window.onload = function() {
    // Retrieve the userName from localStorage
    let userNameInput = localStorage.getItem('userNameInput');
    let gameOverDiv = document.getElementById('gameOverDiv');
    let restartButton = document.getElementById('restart');
    let h1 = document.createElement('h1');

    h1.textContent = 'WOW ' + userNameInput + '! You did Awesome! Hit Restart to play again!';
    gameOverDiv.insertBefore(h1, restartButton);
}
