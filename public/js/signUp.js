'use strict';

const password = document.getElementById('inputPassword');
const rePassword = document.getElementById('inputRePassword');
const userName = document.getElementById('inputEmail');
const errorMessage = document.getElementById('error');

function validatePassword() {
    if (password.value !== rePassword.value) {
        rePassword.setCustomValidity("Passwords Don't Match");
    } else {
        rePassword.setCustomValidity('');
    }
}

function removeInvalidity() {
    if (userName.classList.contains('is-invalid')) {
        userName.classList.remove('is-invalid');
        errorMessage.style.display = 'none';
    }
}

password.onchange = validatePassword;
rePassword.onkeyup = validatePassword;
userName.onchange = removeInvalidity;
