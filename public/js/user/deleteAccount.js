async function submitDeleteAccount() {
  const del = document.getElementById('delete').value;

  try {
    const response = await fetch('/api/deleteaccount', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        del: del
      })
    });

    if (response.ok) {
      window.location.href = '/signup';
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Event listener for form submission
document.getElementById('deleteAccountForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  await submitDeleteAccount();
  $('#deleteAccount').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
});

// Function to display the modal
function openDeleteAccount() {
  $('#deleteAccount').modal('show'); // Show the modal (using Bootstrap modal)
}