const signUpForm = document.getElementById('signupform');

signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    document.getElementById('psswcheck').innerHTML = '';
    document.getElementById('emailexist').innerHTML = '';

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confPassword = document.getElementById('confPassword').value;

    try {
        const response = await fetch('/api/signup', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            surname: surname,
            email: email,
            password: password,
            confPassword: confPassword
          }),
        });
    
        const result = await response.json();

        if(response.ok) {
          window.location.href = '/profile';
        } else {
          if(result.message == 'User with this email already exist.') {
            document.getElementById('emailexist').style.color = 'red';
            document.getElementById('emailexist').innerHTML = result.message;
          } else if(result.message == 'Password are not matching') {
            document.getElementById('psswcheck').style.color = 'red';
            document.getElementById('psswcheck').innerHTML = result.message;
          } else {
            alert(result.message || 'Errore durante la registrazione');
          }
        }
      } catch (err) {
        console.error(err);
      }
    
})

var check = function() {
  if (document.getElementById('password').value == document.getElementById('confPassword').value) {
    document.getElementById('psswcheck').innerHTML = '';
  } else {
    document.getElementById('psswcheck').style.color = 'red';
    document.getElementById('psswcheck').innerHTML = 'Password are not matching';
  }
}


