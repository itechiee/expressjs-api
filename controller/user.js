const userModel = require('../model/User');
let bcrypt = require('bcrypt');

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

// User Register
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(JSON.stringify({"status": 400, "error": "Content can not be empty!", "response": null }));      
  }

  // Create a User
  let saltRounds = process.env.SALT_ROUNDS;
  let user = {
      name: req.body.name,
      username: req.body.username,
      password: await bcrypt.hashSync(req.body.password, parseInt(saltRounds)),
      email: req.body.email,
      mobile: req.body.mobile,
      active: req.body.active,
      device_id: req.body.device_id
    };

    await userModel.create(user)
                  .then(data => {
                      res.send(JSON.stringify({"status": 200, "error": null, "response": data }));
                  })
                  .catch(error => {
                          res.status(500).send(JSON.stringify({
                            "status": 500, 
                            "error": error.message || "Some error occurred while creating users.", 
                            "response": null 
                          }));
                    })
};


// User Login
exports.login = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(JSON.stringify({"status": 400, "error": "Content can not be empty!", "response": null }));      
  }

  // Create a User
  // let saltRounds = process.env.SALT_ROUNDS;
  let user = {
      username: req.body.username,
      password: req.body.password
    };


    await userModel.findOne({
                where: {
                    username: user.username
                },
                order: [ [ 'id', 'DESC' ]],
              }).then(userResult => {
                if(userResult === null) {
                  return res.status(422).send(
                    handleError(422, "Username not exists")
                  );
                }
                let userData = userResult.dataValues;
                if(userData.active === false) {
                  return res.status(422).send(handleError(422, "User is not active"));
              }
              
                let hashPassword = userData.password;
                bcrypt.compare(user.password, hashPassword, function(bcryptErr, bcryptRes) {
                  if (bcryptErr){
                      res.status(500).send(JSON.stringify({
                        "status": 500, 
                        "error": bcryptErr.message || "Some error occurred while compare password.", 
                        "response": null 
                      }));
                  }
                  if (bcryptRes) {
                    // Send user data
                    delete userData.password;
                    res.send(JSON.stringify({"status": 200, "error": null, "response": userData }));
                  } else {
                    // response is OutgoingMessage object that server response http request
                    return res.status(422).send(JSON.stringify({
                      "status": 422, 
                      "error": "Passwords do not match", 
                      "response": null 
                    }));
                  }
                });
            }).catch(function (error) {
                // handle error;
                res.status(500).send(JSON.stringify({
                  "status": 500, 
                  "error": error.message || "Some error occurred while login.", 
                  "response": null 
                }));
            });
};


handleError = (status, msg, res = null) => {
  return JSON.stringify({
    "status": status, 
    "error": [{
            value : "",
            msg : msg,
            param : "username",
            location : "body"
      }], 
    "response": res 
  })
}