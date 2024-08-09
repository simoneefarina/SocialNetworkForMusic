const path = require('path');

const Playlist = require(path.join(__dirname, '..', 'models', 'Playlist'));

const getPlaylistInfo = async (req, res, next) => {
        const playlistId = req.params.playlistId;

        try {
            // Retrieve playlist data from the database based on playlistId
            const playlist = await Playlist.findById(playlistId);

            req.playlistId = playlistId;
            
            next();
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }
}

module.exports = { getPlaylistInfo };