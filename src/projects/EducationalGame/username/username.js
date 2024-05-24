function userNameCheck() {
    // Grab username input value
    let userNameInput = document.getElementById('userNameInput').value;

    // If input field is not blank (trim checks for input not just being empty spaces)
    if (userNameInput.trim() !== '') {
        localStorage.setItem('userNameInput', userNameInput);
        window.location.href = "../play/play.html";
    // Alert the user
    } else {
        // MAKE THIS LOOK BETTER
        alert("Don't forget to enter your name!")
    }
}

