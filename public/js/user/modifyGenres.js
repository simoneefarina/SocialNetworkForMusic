async function submitModifyGenres() {
  const genreCheckboxes = document.querySelectorAll('.genreCheckBox');

  const genreCheckboxesArray = Array.from(genreCheckboxes);
  const genreCheckboxStates = genreCheckboxesArray.map(checkbox => checkbox.checked);
  try {
    const response = await fetch('/api/modifygenres', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        genreCheckboxes: genreCheckboxStates
      })
    });

    if (response.ok) {
      window.location.href = '/profileinfo';
    } else {
      const errorData = await response.json();
      console.error('Error:', errorData.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Event listener for form submission
document.getElementById('modifyGenresForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  await submitModifyGenres();
  $('#modifyGenres').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
});

// Function to display the modal
function openModifyGenres() {
  $('#modifyGenres').modal('show'); // Show the modal (using Bootstrap modal)
}