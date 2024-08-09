
require('dotenv').config();

const path = require('path');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const Playlist = require(path.join(__dirname, '..', 'models', 'Playlist'));
const LikedPlaylist = require(path.join(__dirname, '..', 'models', 'likedPlaylist'));


const getPublicPlaylists = async (req, res) => {
    const userId = req.userId;
    const query = req.params.query;
    const decodedQuery = decodeURIComponent(query);

    try {
        const publicPlaylists = await Playlist.find({ 
            isPublic: true,
            userId: { $ne: userId },
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        });

        res.json({ publicPlaylists });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const loadPublicPlaylistInfo = async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        const playlistID = new ObjectId(playlistId);
        const playlists = await Playlist.findOne({ _id: playlistID });

        // Respond with the playlists data
        return res.json({ playlistName: playlists.name, playlistDescription: playlists.description, userId: playlists.userId,  playlistTags: playlists.tags});
        
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: err.message });
    }
}

const likePlaylist = async (req, res) => {
    const { playlistId } = req.params; // Extract playlistId from URL parameters
    const userId = req.userId; // Assuming you have middleware to extract userId from the request
    
    try {
        // Find the liked playlist record for the user
        let likedPlaylist = await LikedPlaylist.findOne({ userId });

        // If the user has no liked playlist record, create a new one
        if (!likedPlaylist) {
            likedPlaylist = new LikedPlaylist({
                userId: userId,
                playlist: [playlistId]
            });
        } else {
            if (likedPlaylist.playlist.includes(playlistId)) {
                return res.json({ message: 'Playlist already liked' });
            }

            // If the user already has a liked playlist record, push the new playlist ID
            likedPlaylist.playlist.push(playlistId);
        }

        // Save the updated liked playlist record
        await likedPlaylist.save();

        // Respond with a success message
        res.json({ message: 'Playlist liked successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error liking playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getPublicPlaylists, loadPublicPlaylistInfo, likePlaylist };