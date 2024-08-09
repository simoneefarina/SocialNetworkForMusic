import { makeSpotifyAPIRequest } from '../spotifyAuthentication.js';

document.addEventListener('DOMContentLoaded', async function() {

    const playlistId = document.getElementById('playlistId').value;
    try {
        const response = await fetch(`/api/loadpublicsongs/${playlistId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
      
      if (response.ok) {
        const responseData = await response.json();
        
        const songsIds = responseData.songsIds;
        const searchResultsSection = document.getElementById('searchResults');
        searchResultsSection.innerHTML = ''; // Clear previous results
        
        const defaultImage = '/../images/userImage.jpg';

        // Check if artistsIds array is not empty
        if (songsIds.length > 0) {
          // Iterate over each artist ID
          for (const songsId of songsIds) {
            const url = `https://api.spotify.com/v1/tracks/${songsId}`;
            const songsData = await makeSpotifyAPIRequest(url);
            
            // Use artistData to construct HTML for each artist
            const songsHtml = `
            <section class="result-item">
                <section class="result-details-track">
                    <section class="result-name">${songsData.name}</section>
                    <section class="result-type">Track</section>
                    <section class="result-artists">${songsData.artists.map(artist => artist.name).join(', ')}</section>
                </section>
            </section>
            `;
          
            // Append HTML for this artist to the search results section
            searchResultsSection.innerHTML += songsHtml;
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