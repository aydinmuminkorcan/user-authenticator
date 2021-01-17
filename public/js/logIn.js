'use strict';

const userName = document.getElementById('inputEmail');
const password = document.getElementById('inputPassword');
const userError = document.getElementById('userError');
const passwordError = document.getElementById('passwordError');

function removeInvalidity() {
    if (userName.classList.contains('is-invalid')) {
        userName.classList.remove('is-invalid');
        userError.style.display = 'none';
    }

    if (password.classList.contains('is-invalid')) {
        password.classList.remove('is-invalid');
        passwordError.style.display = 'none';
    }
}

userName.onchange = removeInvalidity;
password.onchange = removeInvalidity;
