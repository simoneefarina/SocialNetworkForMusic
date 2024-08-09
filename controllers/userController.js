require('dotenv').config();

const path = require('path');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require(path.join(__dirname, '..', 'models', 'User'));
const Genres = require(path.join(__dirname, '..', 'models', 'Genres'));

const editName = async (req, res) => {
    const { name, surname } = req.body;
    const userId = req.userId;

    try {
        if (!name || !surname ) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }
        
        const user = await User.findOne({ _id: userId });

        await User.findByIdAndUpdate(userId, { 
            "name": name,
            "surname": surname
        })

        res.clearCookie('jwt');

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


        res.status(201).json({ message: `User edited!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const editEmail = async (req, res) => {
    const { email } = req.body;
    const userId = req.userId;

    try {
        if (!email ) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'The Email is not valid.' });
        }

        const user = await User.findOne({ _id: userId });

        await User.findByIdAndUpdate(userId, { 
            "email": email
        })

        res.clearCookie('jwt');

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


        res.status(201).json({ message: `User edited!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const editPassword = async (req, res) => {
    const { oldPassword, password, confPassword } = req.body;
    const userId = req.userId;

    try {
        if (!oldPassword || !password || !confPassword) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }

        if (password !== confPassword) {
            return res.status(400).json({ message: 'Password are not matching' });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Server Error.'});
        }

        const psswCorrect = await bcrypt.compare(oldPassword, user.password);
        if(!psswCorrect) {
            return res.status(400).json({ message: 'Old Password is wrong'});
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(userId, { 
            "password": hashedPassword
        })

        res.clearCookie('jwt');

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


        res.status(201).json({ message: `User edited!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const deleteAccount = async (req, res) => {
    const { del } = req.body;
    const userId = req.userId;

    try {
        if (!del) {
            return res.status(400).json({ message: 'Missing information that are required.' });
        }

        if (del !== 'CONFIRM') {
            return res.status(400).json({ message: 'Confirmation error' });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Server Error.'});
        }

        await User.findByIdAndDelete({ _id: userId });

        res.clearCookie('jwt');

        res.status(201).json({ message: `User deleted!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const modifyGenres = async (req, res) => {
    const { genreCheckboxes } = req.body;
    const userId = req.userId;

    try {

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'Server Error.'});
        }

        await Genres.findOneAndUpdate({ userId: userId }, 
            { $set: { "isSelected": genreCheckboxes } 
        });

        res.clearCookie('jwt');

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


        res.status(201).json({ message: `User edited!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { editName, editEmail, editPassword, deleteAccount, modifyGenres };