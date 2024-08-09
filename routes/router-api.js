const express = require('express');
const path = require('path');

const router = express.Router();

const cookieJwtAuth = require(path.join(__dirname, '..', 'middlewares', 'cookieJwtAuth'));
const authController = require(path.join(__dirname, '..', 'controllers', 'authController'));
const artistController = require(path.join(__dirname, '..', 'controllers', 'artistController'));
const userController = require(path.join(__dirname, '..', 'controllers', 'userController'));
const playlistController = require(path.join(__dirname, '..', 'controllers', 'playlistController'));
const playlistPublicController = require(path.join(__dirname, '..', 'controllers', 'playlistPublicController'));

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.put('/updateNameSurname', cookieJwtAuth.cookieJwtAuth, userController.editName);
router.put('/updateEmail', cookieJwtAuth.cookieJwtAuth, userController.editEmail);
router.put('/modifypassword', cookieJwtAuth.cookieJwtAuth, userController.editPassword);
router.delete('/deleteaccount', cookieJwtAuth.cookieJwtAuth, userController.deleteAccount);
router.put('/modifygenres', cookieJwtAuth.cookieJwtAuth, userController.modifyGenres);

router.get('/credentials', cookieJwtAuth.cookieJwtAuth, authController.credentials);

router.post('/addartist', cookieJwtAuth.cookieJwtAuth, artistController.addArtist);
router.get('/loadartists', cookieJwtAuth.cookieJwtAuth, artistController.loadArtists);

router.post('/createplaylist', cookieJwtAuth.cookieJwtAuth, playlistController.addPlaylist);
router.get('/loadplaylists', cookieJwtAuth.cookieJwtAuth, playlistController.loadPlaylists);
router.delete('/removeplaylist/:playlistId', cookieJwtAuth.cookieJwtAuth, playlistController.removePlaylist);
router.get('/loadLikedPlaylists', cookieJwtAuth.cookieJwtAuth, playlistController.loadLikedPlaylists);
router.delete('/removelikedplaylist/:playlistId', cookieJwtAuth.cookieJwtAuth, playlistController.removeLikedPlaylist);

router.post('/addsongs', cookieJwtAuth.cookieJwtAuth, playlistController.addSongs);
router.get('/loadsongs/:playlistId', cookieJwtAuth.cookieJwtAuth, playlistController.loadSongs);
router.get('/loadplaylistinfo/:playlistId', cookieJwtAuth.cookieJwtAuth, playlistController.loadPlaylistInfo);
router.delete('/removesong/:playlistId/:songId', cookieJwtAuth.cookieJwtAuth, playlistController.removeSong);

router.get('/publicplaylists/:query', cookieJwtAuth.cookieJwtAuth, playlistPublicController.getPublicPlaylists);
router.get('/loadpublicplaylistinfo/:playlistId', playlistPublicController.loadPublicPlaylistInfo);
router.get('/loadpublicsongs/:playlistId', playlistController.loadSongs);
router.get('/getName/:userId', authController.getName);
router.post('/likeplaylist/:playlistId', cookieJwtAuth.cookieJwtAuth, playlistPublicController.likePlaylist);

module.exports = router;