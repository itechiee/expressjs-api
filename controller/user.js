const userModel = require('../model/User');

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
  userModel.findAll().then(users => {
        res.send(JSON.stringify({"status": 200, "error": null, "response": users }));
    }).catch(function (err) {
        // handle error;
        res.status(500)
           .send({
                    message: err.message || "Some error occurred while retrieving users."
                });
    });
};