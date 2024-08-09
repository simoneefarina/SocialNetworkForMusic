document.addEventListener('DOMContentLoaded', async function() {
  try {
    const response = await fetch('/api/loadplaylists', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const responseData = await response.json();

        const playlists = responseData.playlists;
        const searchResultsSection = document.getElementById('searchResults');
        searchResultsSection.innerHTML = ''; // Clear previous results

        const defaultImage = 'images/userImage.png';

        // Check if playlists array is not empty
        if (playlists.length > 0) {
            // Iterate over each playlist
            for (const playlist of playlists) {
                // Use playlist data to construct HTML for each playlist
                const playlistHtml = `
                <a href="/playlist/${playlist._id}" class="result-item"> <!-- Update the href attribute with the correct URL -->
                    <img src="${defaultImage}" alt="${playlist.name}" class="result-image">
                    <section class="result-details">
                        <section class="result-name">${playlist.name}</section>
                        <section class="result-artists">${playlist.description}</section>
                    </section>
                </a>
                `;

                // Append HTML for this playlist to the search results section
                searchResultsSection.innerHTML += playlistHtml;
            }
        } else {
            console.log('No playlists found.');
        }
    } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
    }
    } catch (error) {
      console.error('Error:', error);
    }
});