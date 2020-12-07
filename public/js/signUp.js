"use strict";

const password = document.getElementById("inputPassword");
const rePassword = document.getElementById("inputRePassword");

function validatePassword() {
	if (password.value != rePassword.value) {
		rePassword.setCustomValidity("Passwords Don't Match");
	} else {
		rePassword.setCustomValidity("");
	}
}

password.onchange = validatePassword;
rePassword.onkeyup = validatePassword;
