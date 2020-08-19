const signUpForm = document.querySelector('form');

const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (signUpForm.password.value !== signUpForm.rePassword.value){
    return alert('Passwords do not match!');
  }
    
  fetch('http://localhost:3000/users', {
      method: 'POST',
      body: JSON.stringify({
        userName: signUpForm.userName.value,
        password: signUpForm.password.value,
        age: signUpForm.age.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      return res.text();
    })
    .then(user => {
        console.log(user);
    })
    .catch(e => {
      console.log(e);
    });
});