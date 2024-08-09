function ErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        "error": true, 
        "message": err.message || "Internal server error!"
    });
}

module.exports = ErrorHandler;