const signUpForm = document.getElementById('signupform');

signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
        });
    
        const result = await response.json();

        if(response.ok) {
          window.location.href = '/profile';
        } else {
          if(result.message == 'Incorrect username or password.') {
            document.getElementById('errormessage').style.color = 'red';
            document.getElementById('errormessage').innerHTML = result.message;
          } else {
            alert(result.message || 'Errore durante la registrazione');
          }
        }
      } catch (err) {
        console.error(err);
      }
    
})


