const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    userId: String,
    name: String,
    description: String,
    tracks: [String],
    tags: [String],
    isPublic: Boolean
})

module.exports = mongoose.model('Playlist', playlistSchema);
