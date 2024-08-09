import { fetchCredentials } from './fetchSpotifyID.js';

let accessToken;
let tokenExpirationTime;

async function getAccessToken() {
    // Check if the token is expired or doesn't exist
    if (!accessToken || Date.now() >= tokenExpirationTime) {
        try {
            const { clientId, clientSecret } = await fetchCredentials();

            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
                },
                body: 'grant_type=client_credentials'
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve access token');
            }

            const data = await response.json();
            accessToken = data.access_token;
            tokenExpirationTime = Date.now() + (data.expires_in * 1000); // Convert expires_in to milliseconds
        } catch (error) {
            console.error('Error retrieving access token:', error);
        }
    }

    return accessToken;
}

// Function to make authenticated requests to Spotify API
export async function makeSpotifyAPIRequest(url) {
    const token = await getAccessToken();

    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    console.log(response);
    const data = await response.json();

    return data;
}