require('dotenv').config();

const path = require('path');

const jwt = require("jsonwebtoken");

const cookieJwtAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if(!token){
      res.status(400).json({message: 'Token doesnt exists'});
    }

    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = user.id;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      //return res.status(401).json({ message: "Token scaduto." });
      return res.redirect('/login');
    }
    // Gestisci l'errore JsonWebTokenError (come token non valido, malformato, ecc.)
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token non valido." });
    }
    // Se non è uno dei due errori sopra, è un errore inaspettato.
    return res.status(500).json({ error: "Errore interno del server." });
  }
}

module.exports = { cookieJwtAuth };