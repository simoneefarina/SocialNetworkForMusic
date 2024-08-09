import { makeSpotifyAPIRequest } from '../spotifyAuthentication.js';

document.addEventListener('DOMContentLoaded', async function() {

    const playlistId = document.getElementById('playlistId').value;
    try {
        const response = await fetch(`/api/loadpublicplaylistinfo/${playlistId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
      
      if (response.ok) {
        const responseData = await response.json();
        
        document.getElementById('playlistName').innerHTML = responseData.playlistName;
        document.getElementById('playlistDescritpion').innerHTML = responseData.playlistDescription;
        const tagsContainer = document.getElementById('playlistTags');
        tagsContainer.innerHTML = ''; // Clear existing tags
        
        responseData.playlistTags.forEach(tag => {
          const tagElement = document.createElement('span');
          tagElement.textContent = `#${tag}`; // Add space and # before each tag
          tagsContainer.appendChild(tagElement);
          tagsContainer.appendChild(document.createTextNode(' ')); // Add space between tags
        });
        
        const UserId = responseData.userId;
        
        try {
          const response2 = await fetch(`/api/getname/${UserId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
        
        if (response2.ok) {
          const responseDataName = await response2.json();
          
          document.getElementById('playlistAuthor').innerHTML = responseDataName.name + "'s Playlist";
        
          
        } else {
          const errorData = await response.json();
          console.error('Error:', errorData.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
});