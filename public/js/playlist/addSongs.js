import { makeSpotifyAPIRequest } from '../spotifyAuthentication.js';

async function submitAddSong() {
  const query = document.getElementById('name').value;
  const playlistId = document.getElementById('playlistId').value;
  const formattedQuery = query.split(' ').join('+');

  try {
      // Make a request to the Spotify API
      const url = `https://api.spotify.com/v1/search?q=${formattedQuery}&type=track,artist,album`;
      const data = await makeSpotifyAPIRequest(url);

      // Process the response and display results
      const tracks = data.tracks.items[0];
      try {
          const response = await fetch('/api/addsongs', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                  songId: tracks.id,
                  playlistId : playlistId
              })
          });
          if (response.ok) {
              // Optional: Display success message or update UI
              window.location.href = `/playlist/${playlistId}`;
          } else {
              const errorData = await response.json();
              console.error('Error:', errorData.message);
          }
      } catch (error) {
          console.error('Error:', error);
      }
  } catch (error) {
      console.error('Error fetching data from Spotify API:', error);
  }
  }
  
  // Event listener for form submission
  document.getElementById('addSongForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    await submitAddSong();
    $('#addSongModal').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
  });
  
  // Function to display the modal
  function openAddArtist() {
    $('#addSongModal').modal('show'); // Show the modal (using Bootstrap modal)
  }