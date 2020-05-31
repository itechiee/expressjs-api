module.exports = function (req, res, next) {
    // Implement the middleware function based on the options object
    res.status(404).send(JSON.stringify({"status": 404, "error": "invalid api", "response": ""}));
    next();
  }