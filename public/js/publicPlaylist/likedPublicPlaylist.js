document.addEventListener('DOMContentLoaded', function() {
    const addArtistButton = document.getElementById('likePlaylist');
    const playlistId = document.getElementById('playlistId').value;

    addArtistButton.addEventListener('click', function() {
        likePlaylist(playlistId);
    });
});

async function likePlaylist(playlistId) {
    try {
        const response = await fetch(`/api/likeplaylist/${playlistId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = '/myplaylists';
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error liking playlist:', error);
    }
}