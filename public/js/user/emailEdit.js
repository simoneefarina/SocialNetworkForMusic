async function submitEmailForm() {
  const email = document.getElementById('email').value;

  try {
    const response = await fetch('/api/updateEmail', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: email
      }),
    });

    if (response.ok) {
      console.log('email updated successfully');
      window.location.href = '/profileInfo';
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Event listener for form submission
document.getElementById('editEmailForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  await submitEmailForm();
  $('#editProfileEmailModal').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
});

// Function to display the modal
function openEditEmail() {
  $('#editProfileEmailModal').modal('show'); // Show the modal (using Bootstrap modal)
}