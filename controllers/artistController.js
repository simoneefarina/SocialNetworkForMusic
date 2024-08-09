require('dotenv').config();

const path = require('path');

const User = require(path.join(__dirname, '..', 'models', 'User'));
const Artists = require(path.join(__dirname, '..', 'models', 'Artists'));

const addArtist = async (req, res) => {
    const userId = req.userId;
    const { artistId } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const updatedArtist = await Artists.findOneAndUpdate(
            { userId: userId },
            { $push: { artistIds: artistId } },
            { new: true } // This option returns the updated document
        );

        if (!updatedArtist) {
            return res.status(404).json({ message: 'User artists not found.' });
        }

        res.status(201).json({ message: `User artists updated!`, updatedArtist });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const loadArtists = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Server Error.' });
        }

        const artists = await Artists.findOne({ userId: userId });

        // Always respond with the artists data, even if it's an empty array
        return res.json({ artistIds: artists.artistIds });
        
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { addArtist, loadArtists };