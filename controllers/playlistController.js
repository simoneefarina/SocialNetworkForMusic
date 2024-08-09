require('dotenv').config();

const path = require('path');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const User = require(path.join(__dirname, '..', 'models', 'User'));
const Playlist = require(path.join(__dirname, '..', 'models', 'Playlist'));
const LikedPlaylist = require(path.join(__dirname, '..', 'models', 'likedPlaylist'));


const addPlaylist = async (req, res) => {
    const { name, description, tags, isPublic} = req.body;
    const userId = req.userId;

    try {
        if (!name || !description ) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }

        const newPlaylist = await Playlist.create({
            "userId": userId,
            "name": name,
            "description": description,
            "tags": tags,
            "isPublic": isPublic
        })

        res.status(201).json({ message: `New playlist created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


const loadPlaylists = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Server Error.' });
        }

        const playlists = await Playlist.find({ userId: userId }).select('_id name description');

        // Respond with the playlists data
        return res.json({ playlists });
        
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: err.message });
    }
}

const addSongs = async (req, res) => {
    const { songId, playlistId } = req.body;
    try {
        if (!songId || !playlistId ) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }
        const playlistID = new ObjectId(playlistId);
        const updatedArtist = await Playlist.findOneAndUpdate(
            { _id: playlistID },
            { $push: { tracks: songId } }
        );

        res.status(201).json({ message: `New playlist created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const loadSongs = async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        const playlistID = new ObjectId(playlistId);
        const playlists = await Playlist.findOne({ _id: playlistID });

        // Respond with the playlists data
        return res.json({ songsIds: playlists.tracks });
        
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: err.message });
    }
}

const loadPlaylistInfo = async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        const playlistID = new ObjectId(playlistId);
        const playlists = await Playlist.findOne({ _id: playlistID });

        // Respond with the playlists data
        return res.json({ playlistName: playlists.name, playlistDescription: playlists.description, playlistTags: playlists.tags});
        
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: err.message });
    }
}

const removeSong = async (req, res) => {
    const { playlistId, songId } = req.params; // Extract playlistId and songId from URL parameters

    try {
        // Find the playlist by its ID
        const playlist = await Playlist.findById(playlistId);

        // Check if the playlist exists
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Remove the song from the playlist's tracks array
        const index = playlist.tracks.indexOf(songId);
        if (index !== -1) {
            playlist.tracks.splice(index, 1);
        } else {
            return res.status(404).json({ message: 'Song not found in the playlist' });
        }

        // Save the updated playlist
        await playlist.save();

        // Respond with a success message
        res.json({ message: 'Song removed successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error removing song:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const removePlaylist = async (req, res) => {
    const { playlistId } = req.params; // Extract playlistId from URL parameters


    try {
        // Find the playlist by its ID
        const playlist = await Playlist.findById(playlistId);

        // Check if the playlist exists
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Remove the playlist
        const result = await Playlist.deleteOne({ _id: playlistId });

        // Check if the playlist was found and removed
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Respond with a success message
        res.json({ message: 'Playlist removed successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error removing playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const loadLikedPlaylists = async (req, res) => {
    try {
        // Retrieve the userId from the request
        const userId = req.userId;

        // Find the liked playlists for the user
        const likedPlaylists = await LikedPlaylist.findOne({ userId });

        // If liked playlists are found, get the playlist IDs
        if (likedPlaylists) {
            const playlistIds = likedPlaylists.playlist;

            // Search for details of each playlist based on the IDs
            const playlists = await Playlist.find({ _id: { $in: playlistIds } }).select('_id name description');

            res.json({ playlists });
        } else {
            res.json({ playlists: [] }); // Send an empty array if no liked playlists are found
        }
    } catch (error) {
        console.error('Error loading liked playlists:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const removeLikedPlaylist = async (req, res) => {
    const { playlistId } = req.params; // Extract playlistId from URL parameters
    const userId = req.userId; // Extract userId from the request

    try {
        // Find the liked playlist document for the current user
        const likedPlaylist = await LikedPlaylist.findOne({ userId });

        // Check if the liked playlist document exists
        if (!likedPlaylist) {
            return res.status(404).json({ message: 'Liked playlist not found for the user' });
        }

        // Remove the playlistId from the playlist array
        likedPlaylist.playlist.pull(playlistId);

        // Save the updated liked playlist document
        await likedPlaylist.save();

        // Respond with a success message
        res.json({ message: 'Liked playlist removed successfully' });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error removing liked playlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { addPlaylist, loadPlaylists, addSongs, loadSongs, loadPlaylistInfo, removeSong, removePlaylist, loadLikedPlaylists, removeLikedPlaylist};