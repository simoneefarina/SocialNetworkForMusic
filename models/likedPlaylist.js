const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likedPlaylistSchema = new Schema({
    userId: String,
    playlist: [String]
})

module.exports = mongoose.model('LikedPlaylist', likedPlaylistSchema);