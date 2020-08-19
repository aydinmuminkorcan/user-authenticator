const logInForm = document.querySelector('form');

const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');

logInForm.addEventListener('submit', (e) => {
  e.preventDefault();
 
  fetch('http://localhost:3000/logIn', { 
    method: 'POST',
    body: JSON.stringify({userName: logInForm.userName.value, password:logInForm.password.value}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((res) => {
      return res.text();
  }) 
  .then(text =>{
    console.log(text);
  })
  .catch(e => {
    console.log(e);
  });
});