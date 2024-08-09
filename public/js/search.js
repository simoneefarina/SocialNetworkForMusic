import { makeSpotifyAPIRequest } from './spotifyAuthentication.js';

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get the search query from the input field
    const query = document.getElementById('searchInput').value;
    
    // Call a function to perform Spotify API search with the query
    searchSpotify(query);
});

async function searchSpotify(query) {
    const formattedQuery = query.split(' ').join('+');
    try {
        // Make a request to the Spotify API
        const url = `https://api.spotify.com/v1/search?q=${formattedQuery}&type=track,artist,album`;
        const data = await makeSpotifyAPIRequest(url);
        console.log(data);
        // Process the response and display results
        displayResults(data);
    } catch (error) {
        console.error('Error fetching data from Spotify API:', error);
    }
}

function displayResults(data) {
    const searchResultsSection = document.getElementById('searchResults');
    searchResultsSection.innerHTML = ''; // Clear previous results
    
    const defaultImage = 'images/userImage.jpg'
    // Display artists, albums, and tracks separately
    const artists = data.artists.items.slice(0, 6).map(artist => {
        if (artist.images && artist.images.length > 0) {
            return `
                <section class="result-item">
                    <img src="${artist.images[0].url}" alt="${artist.name}" class="result-image">
                    <section class="result-details">
                        <section class="result-name">${artist.name}</section>
                        <section class="result-type">Artist</section>
                    </section>
                </section>
            `;
        } else {
            return `
                <section class="result-item">
                <img src="${defaultImage}" class="result-image">
                    <section class="result-details">
                        <section class="result-name">${artist.name.substring(0,15)}</section>
                        <section class="result-type">Artist</section>
                    </section>
                </section>
            `;
        }
    }).join('');
    const albums = data.albums.items.slice(0, 6).map(album => `
        <section class="result-item">
            <img src="${album.images[0].url}" alt="${album.name}" class="result-image">
            <section class="result-details">
            <section class="result-name">${album.name.length <= 17 ? album.name : album.name.substring(0, 14) + '...'}</section>
                <section class="result-type">Album</section>
                <section class="result-artists">${album.artists.map(artist => artist.name).join(', ')}</section>
            </section>
        </section>
    `).join('');
    
    /*const tracks = data.tracks.items.slice(0, 6).map(track => {
        if (track.images && track.images.length > 0) {
            return `
                <section class="result-item">
                    <img src="${track.images[0].url}" alt="${track.name}" class="result-image">
                    <section class="result-details">
                        <section class="result-name">${track.name}</section>
                        <section class="result-type">Artist</section>
                    </section>
                </section>
            `;
        } else {
            return `
                <section class="result-item">
                <img src="${defaultImage}" class="result-image">
                    <section class="result-details">
                        <section class="result-name">${track.name.substring(0,15)}</section>
                        <section class="result-type">Artist</section>
                    </section>
                </section>
            `;
        }
    }).join('');
    */
    const tracks = data.tracks.items.slice(0, 6).map(track => `
        <section class="result-item">
            <section class="result-details-track">
                <section class="result-name">${track.name}</section>
                <section class="result-type">Track</section>
                <section class="result-artists">${track.artists.map(artist => artist.name).join(', ')}</section>
            </section>
        </section>
    `).join('');
    // Append results to the search results section
    searchResultsSection.innerHTML = `
        <h2>Artists</h2>
        ${artists}
        <h2>Albums</h2>
        ${albums}
        <h2>Tracks</h2>
        ${tracks}
    `;
}