const userModel = require('../model/User');
let bcrypt = require('bcrypt');
// Retrieve all Customers from the database.
// exports.findAll = (req, res) => {
//   userModel.findAll((err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving users."
//       });
//     else res.send(JSON.stringify({"status": 200, "error": null, "response": data }));
//   });
// };


exports.findAll = (req, res) => {
  userModel.findAll().then(users => {
        res.send(JSON.stringify({"status": 200, "error": null, "response": users }));
    }).catch(function (err) {
        // handle error;
        res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body) {
//     res.status(400).send(JSON.stringify({"status": 400, "error": "Content can not be empty!", "response": null }));      
//   }

//   // Create a User
//   let user = new userModel({
//       name: req.body.name,
//       username: req.body.username,
//       password: req.body.password,
//       email: req.body.email,
//       mobile: req.body.mobile,
//       active: req.body.active,
//       device_id: req.body.device_id
//     });

//   userModel.create(user, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating users."
//       });
//     else res.send(JSON.stringify({"status": 200, "error": null, "response": data }));
//   });
// };

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

  userModel.create(user)
  .then(data => {
      res.send(JSON.stringify({"status": 200, "error": null, "response": data }));
  })
  .catch(error => {
      res.status(500).send({
            message:
              err.message || "Some error occurred while creating users."
          });
  })
  
  
};