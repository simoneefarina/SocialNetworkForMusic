async function fetchPublicPlaylists(query) {
    
    try {
         const response = await fetch(`/api/publicplaylists/${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('prova', response);
        if (response.ok) {
            const data = await response.json();
            const publicPlaylists = data.publicPlaylists;
            const searchResultsSection = document.getElementById('searchResults');
            searchResultsSection.innerHTML = ''; // Clear previous results

            const defaultImage = 'images/userImage.png';

            // Check if publicPlaylists array is not empty
            if (publicPlaylists.length > 0) {
                // Iterate over each public playlist
                for (const playlist of publicPlaylists) {
                    // Use playlist data to construct HTML for each playlist
                    const playlistHtml = `
                    <a href="/publicplaylist/${playlist._id}" class="result-item"> <!-- Update the href attribute with the correct URL -->
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
                console.log('No public playlists found.');
            }
        } else {
            console.error('Failed to fetch public playlists:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching public playlists:', error);
    }
}

document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const query = document.getElementById('searchInput').value;

    await fetchPublicPlaylists(query);
});
