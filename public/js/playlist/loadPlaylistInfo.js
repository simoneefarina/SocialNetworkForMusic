document.addEventListener('DOMContentLoaded', async function() {

    const playlistId = document.getElementById('playlistId').value;
    try {
        const response = await fetch(`/api/loadplaylistinfo/${playlistId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
      
      if (response.ok) {
        const responseData = await response.json();
        
        document.getElementById('playlistName').innerHTML = responseData.playlistName;
        document.getElementById('playlistDescritpion').innerHTML = responseData.playlistDescription;
        
        // Display tags
        const tagsContainer = document.getElementById('playlistTags');
        tagsContainer.innerHTML = ''; // Clear existing tags
        
        responseData.playlistTags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.textContent = `#${tag}`; // Add space and # before each tag
          tagsContainer.appendChild(tagElement);
          tagsContainer.appendChild(document.createTextNode(' ')); // Add space between tags
        });

      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
});