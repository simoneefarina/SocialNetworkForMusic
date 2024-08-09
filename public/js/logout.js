const logout = document.getElementById('logoutForm');

logout.addEventListener('submit', async (event) => {
    event.preventDefault();

        try {
            // Send a POST request to the logout route
            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            if (response.ok) {
                // Redirect the user to the login page after successful logout
                window.location.href = '/login';
            } else {
                // Handle any error response from the server
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
})