const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const atrtistsSchema = new Schema({
    userId: String,
    artistIds: [String]
})

module.exports = mongoose.model('Artists', atrtistsSchema);