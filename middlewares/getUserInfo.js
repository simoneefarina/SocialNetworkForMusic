const path = require('path');

const User = require(path.join(__dirname, '..', 'models', 'User'));
const Genres = require(path.join(__dirname, '..', 'models', 'Genres'));

const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.userId;
        
        const user = await User.findOne({ _id: userId });

        req.user = user;
        
        const genres = await Genres.findOne({ userId: userId });

        req.genres = genres;
        
        next();
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { getUserInfo };