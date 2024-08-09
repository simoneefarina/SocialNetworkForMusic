const modifyPasswordForm = document.getElementById('changePasswordForm');

modifyPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    document.getElementById('psswcheck').innerHTML = '';
    document.getElementById('oldPasswordWrong').innerHTML = '';

    const oldPassword = document.getElementById('oldPassword').value;
    const password = document.getElementById('password').value;
    const confPassword = document.getElementById('confPassword').value;

    try {
        const response = await fetch('/api/modifypassword', {
          method: 'PUT', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            oldPassword: oldPassword,
            password: password,
            confPassword: confPassword
          }),
        });
    
        const result = await response.json();

        if(response.ok) {
          window.location.href = '/profileinfo';
        } else {
          if(result.message == 'Old Password is wrong') {
            document.getElementById('oldPasswordWrong').style.color = 'red';
            document.getElementById('oldPasswordWrong').innerHTML = result.message;
          } else if(result.message == 'Password are not matching') {
            document.getElementById('psswcheck').style.color = 'red';
            document.getElementById('psswcheck').innerHTML = result.message;
          } else {
            alert(result.message || 'Errore durante la modifca della password');
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