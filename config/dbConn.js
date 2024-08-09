const mongoose = require('mongoose');

//Try to connect to the database
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DB_URI, {});
        console.log("Connection to the DataBase established succesfully!");
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB