window.onload = function() {
    // Retrieve the userName from localStorage
    let userNameInput = localStorage.getItem('userNameInput');
    let readyToPlay = document.getElementById('readyToPlay');
    let yesButton = document.getElementById('yes');
    let h1 = document.createElement('h1');

    h1.textContent = 'Hello ' + userNameInput + '! Are you ready to play?';
    readyToPlay.insertBefore(h1, yesButton);
}
