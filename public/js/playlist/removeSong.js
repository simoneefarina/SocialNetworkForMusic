
import { makeSpotifyAPIRequest } from '../spotifyAuthentication.js';

document.addEventListener('DOMContentLoaded', async function() {
    const songSelect = document.getElementById('songSelect');
    const playlistId = document.getElementById('playlistId').value;
    
    try {
        const response = await fetch(`/api/loadsongs/${playlistId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const responseData = await response.json();
            const songsIds = responseData.songsIds;

            if (songsIds.length > 0) {
                for (const songsId of songsIds) {
                    const url = `https://api.spotify.com/v1/tracks/${songsId}`;
                    const songsData = await makeSpotifyAPIRequest(url);
                    
                    const option = document.createElement('option');
                    option.value = songsId;
                    option.textContent = songsData.name;
                    songSelect.appendChild(option);
                }
            }
        } else {
            console.error('Failed to fetch songs:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
    
    // Event listener for form submission
    document.getElementById('removeSongForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const selectedSongId = songSelect.value;
        removeSong(selectedSongId, playlistId);

        const removeSongModal = new bootstrap.Modal(document.getElementById('removeSongModal'));
        removeSongModal.hide();
    });
});

async function removeSong(songId, playlistId) {
    try {
        const response = await fetch(`/api/removesong/${playlistId}/${songId}`, {
            method: 'DELETE', // Use DELETE method
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Song removed successfully');
            window.location.href = `/playlist/${playlistId}`;
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error removing song:', error);
    }
}