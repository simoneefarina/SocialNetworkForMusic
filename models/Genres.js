const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genresSchema = new Schema({
    userId: String,
    isSelected: [Boolean]
})

module.exports = mongoose.model('Genres', genresSchema);