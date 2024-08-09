import { makeSpotifyAPIRequest } from '../spotifyAuthentication.js';

async function submitAddArtist() {
  const query = document.getElementById('artist').value;
  const formattedQuery = query.split(' ').join('+');

  try {
      // Make a request to the Spotify API
      const url = `https://api.spotify.com/v1/search?q=${formattedQuery}&type=track,artist,album`;
      const data = await makeSpotifyAPIRequest(url);

      // Process the response and display results
      const artists = data.artists.items[0];

      try {
          const response = await fetch('/api/addartist', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                  artistId: artists.id
              })
          });

          if (response.ok) {
              // Optional: Display success message or update UI
              window.location.href = '/artists';
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
  document.getElementById('addArtistForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    await submitAddArtist();
    $('#addArtistModal').modal('hide'); // Hide the modal after submission (using Bootstrap modal)
  });
  
  // Function to display the modal
  function openAddArtist() {
    $('#addArtistModal').modal('show'); // Show the modal (using Bootstrap modal)
  }