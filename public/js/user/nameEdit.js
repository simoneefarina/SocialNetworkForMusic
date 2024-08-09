async function submitNameSurnameForm() {
  const newName = document.getElementById('name').value;
  const newSurname = document.getElementById('surname').value;

  try {
    const response = await fetch('/api/updateNameSurname', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name: newName,
        surname: newSurname
      }),
    });

    if (response.ok) {
      console.log('Name and surname updated successfully');
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
document.getElementById('editNameForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  await submitNameSurnameForm();
  $('#editProfileNameModal').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
});

// Function to display the modal
function openEditNameSurnameModal() {
  $('#editProfileNameModal').modal('show'); // Show the modal (using Bootstrap modal)
}