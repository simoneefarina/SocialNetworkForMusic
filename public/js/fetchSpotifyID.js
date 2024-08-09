async function fetchCredentials() {
    try {
        const response = await fetch('/api/credentials');
        const data = await response.json();
        
        // Check if data contains clientId and clientSecret
        if (data.clientId && data.clientSecret) {
            // Use the retrieved credentials as needed
            return { clientId: data.clientId, clientSecret: data.clientSecret };
        } else {
            console.error('Client ID or Client Secret not found');
        }
    } catch (error) {
        console.error('Error fetching credentials:', error);
    }
}

export { fetchCredentials };