const express = require('express');
const { register } = require('module');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

const cookieJwtAuth = require(path.join(__dirname, '..', 'middlewares', 'cookieJwtAuth'));
const getUserInfo = require(path.join(__dirname, '..', 'middlewares', 'getUserInfo'));
const getPlaylistInfo = require(path.join(__dirname, '..', 'middlewares', 'getPlaylistInfo'));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
})

router.get('/signup(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
})

router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
})

router.get('/profile', cookieJwtAuth.cookieJwtAuth, getUserInfo.getUserInfo, (req, res) => {
    res.render('profile', { userName: req.user.name, userSurname: req.user.surname, userEmail: req.user.email });
})

router.get('/artists', cookieJwtAuth.cookieJwtAuth, getUserInfo.getUserInfo, (req, res) => {
    res.render('artists', { userName: req.user.name });
})

router.get('/myplaylists', cookieJwtAuth.cookieJwtAuth, getUserInfo.getUserInfo, (req, res) => {
    res.render('myplaylists', { userName: req.user.name });
})

router.get('/searchplaylist', (req, res) => {
    res.render('searchplaylist');
})
router.get('/publicplaylist/:playlistId', (req, res) => {
    const playlistId = new ObjectId(req.params.playlistId);
    res.render('publicplaylist', { playlistId: playlistId });
})

router.get('/playlist/:playlistId', cookieJwtAuth.cookieJwtAuth, getUserInfo.getUserInfo, (req, res) => {
    const playlistId = new ObjectId(req.params.playlistId);
    res.render('playlist', { userName: req.user.name, playlistId: playlistId });
})

router.get('/profileInfo', cookieJwtAuth.cookieJwtAuth, getUserInfo.getUserInfo, (req, res) => {
    res.render('profileInfo', { userName: req.user.name, userSurname: req.user.surname, userEmail: req.user.email, genresIsSelected: req.genres.isSelected });
})

router.get('/modifypassword', cookieJwtAuth.cookieJwtAuth, getUserInfo.getUserInfo, (req, res) => {
    res.render('modifyPassword', { userName: req.user.name });
})

router.get('/search', (req, res) => {
    res.render('search');
})

router.all('/*', (req, res) => {
    res.status(404).send("Error 404. Page not found!");
})

module.exports = router;