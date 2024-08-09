import { makeSpotifyAPIRequest } from '../spotifyAuthentication.js';

document.addEventListener('DOMContentLoaded', async function() {

    try {
      const response = await fetch('/api/loadartists', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const responseData = await response.json();
        
        const artistsIds = responseData.artistIds;
        const searchResultsSection = document.getElementById('searchResults');
        searchResultsSection.innerHTML = ''; // Clear previous results
        
        const defaultImage = 'images/userImage.jpg';

        // Check if artistsIds array is not empty
        if (artistsIds.length > 0) {
          // Iterate over each artist ID
          for (const artistId of artistsIds) {
            const url = `https://api.spotify.com/v1/artists/${artistId}`;
            const artistData = await makeSpotifyAPIRequest(url);
            
            // Use artistData to construct HTML for each artist
            const artistHtml = `
              <section class="result-item">
                <img src="${artistData.images[0].url || defaultImage}" alt="${artistData.name}" class="result-image">
                <section class="result-details">
                  <section class="result-name">${artistData.name}</section>
                  <section class="result-type">Artist</section>
                </section>
              </section>
            `;
          
            // Append HTML for this artist to the search results section
            searchResultsSection.innerHTML += artistHtml;
          }
        }
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
});