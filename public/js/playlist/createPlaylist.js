async function submitCreatePlaylist() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const isPublic = document.getElementById('isPublic').checked; // Get the value of the checkbox
    const tagsInput = document.getElementById('tags').value; 

    const tagsArray = tagsInput.split(',').map(tag => tag.trim());

    try {
        const response = await fetch('/api/createplaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: name,
                description: description,
                tags: tagsArray,
                isPublic: isPublic
            })
        });

        if (response.ok) {
            // Optional: Display success message or update UI
            window.location.href = '/myplaylists';
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
  
  // Event listener for form submission
  document.getElementById('addPlaylistForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    await submitCreatePlaylist();
    $('#addPlaylistModal').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
  });
  
  // Function to display the modal
  function openAddArtist() {
    $('#addPlaylistModal').modal('show'); // Show the modal (using Bootstrap modal)
  }