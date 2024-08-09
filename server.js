//loading dotenv variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const router = require(path.join(__dirname, 'routes', 'pages'));
const errorHandler = require(path.join(__dirname, 'middlewares', 'errorHandler'));
const dbConnection = require(path.join(__dirname, 'config', 'dbConn'));
const router_api = require(path.join(__dirname, 'routes', 'router-api')); 

const PORT = process.env.PORT || 3000;

//Open connection with mongoDB
dbConnection();

//Set ejs
app.set('view engine', 'ejs');

//setting middlewares
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use('/api', router_api);

app.use('/', router);
app.use(errorHandler);

//Starting the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`)
})