document.addEventListener('DOMContentLoaded', async function() {
    const playlistSelect = document.getElementById('likedplaylistSelect');

    try {
        const response = await fetch('/api/loadlikedplaylists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            const playlists = responseData.playlists;

            if (playlists.length > 0) {
                playlists.forEach(playlist => {
                    const option = document.createElement('option');
                    option.value = playlist._id;
                    option.textContent = playlist.name;
                    playlistSelect.appendChild(option);
                });
            }
        } else {
            console.error('Failed to fetch playlists:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }

    // Event listener for form submission
    document.getElementById('removeLikedPlaylistForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const selectedPlaylistId = playlistSelect.value;
        if (!selectedPlaylistId) {
            console.error('No playlist selected.');
            return;
        }
        removePlaylist(selectedPlaylistId);

        const removePlaylistModal = new bootstrap.Modal(document.getElementById('removeLikedPlaylistForm'));
        removePlaylistModal.hide();
    });
});

async function removePlaylist(playlistId) {
    try {
        const response = await fetch(`/api/removelikedplaylist/${playlistId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Playlist removed successfully');
            window.location.reload(); // Reload the page to reflect changes
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error removing playlist:', error);
    }
}