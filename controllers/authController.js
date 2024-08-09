require('dotenv').config();

const path = require('path');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const User = require(path.join(__dirname, '..', 'models', 'User'));
const Genres = require(path.join(__dirname, '..', 'models', 'Genres'));
const Artists = require(path.join(__dirname, '..', 'models', 'Artists'));

const signUp = async (req, res) => {
    const { name, surname, email, password, confPassword} = req.body;

    try {
        if (!name || !surname || !email || !password || !confPassword) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'The Email is not valid.' });
        }

        if (password !== confPassword) {
            return res.status(400).json({ message: 'Password are not matching' });
        }

        const duplicate = await User.findOne({ email: email });
        if (duplicate) {
            return res.status(400).json({ message: 'User with this email already exist.'});
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            "name": name,
            "surname": surname,
            "email": email,
            "password": hashedPassword
        })

        const newGenres = await Genres.create({
            "userId": newUser._id,
            "isSelected": ['false','false','false','false','false','false','false','false','false','false','false','false','false','false','false']
        })

        const newArtist = await Artists.create({
            "userId": newUser._id,
            "artistId": []
        })

        const accessToken = jwt.sign(
            { id : newUser._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );

        res.cookie('jwt', accessToken, { 
            httpOnly: true,
            //secure: true,
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.status(201).json({ message: `New user ${newUser} created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password ) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'The Email is not valid.' });
        }

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Incorrect username or password.'});
        }

        const psswCorrect = await bcrypt.compare(password, user.password);
        if(!psswCorrect) {
            return res.status(400).json({ message: 'Incorrect username or password.'});
        }

        const accessToken = jwt.sign(
            { id : user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        );

        res.cookie('jwt', accessToken, { 
            httpOnly: true,
            //secure: true,
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.status(201).json({ message: 'login correct' });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const credentials = async (req, res) => {
    try{
        const clientId = process.env.SPOTIFY_API_ID;
        const clientSecret = process.env.SPOTIFY_API_SECRET;

        // Check if both values exist
        if (clientId && clientSecret) {
            res.json({ clientId, clientSecret });
        } else {
            res.status(500).json({ error: 'Client ID or Client Secret not found' });
        }

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const logout = async (req, res) => {
    res.clearCookie('jwtToken');

    // Redirect to the login page after successful logout
    res.redirect('/login');
}

const getName = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userID = new ObjectId(userId);
        const user = await User.findOne({ _id: userID });

        // Respond with the playlists data
        return res.json({ name: user.name});
        
    } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { signUp, login, credentials, logout, getName };