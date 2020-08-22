var express = require('express');
var router = express.Router();
var userController = require("../controller/user.js");
var authController = require("../controller/auth.js");
var validation = require('../helpers/validation');
// var db = require('../model/user');
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     let sql = "SELECT * FROM users";
//     let query = db.query(sql, (err, results) => {
//       if(err) throw err;
//       res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//     });
//     // res.send(JSON.stringify({"status": 200, "error": null, "response": "succccccess"}));
// });

// router.post('/register', function(req, res, next) {
//   // res.send('respond with a resource');
//     res.send(JSON.stringify({"status": 200, "error": null, "response": "succccccess"}));
// });
// module.exports = router;




router.get('/', userController.findAll);
router.post('/register', validation.register, authController.create);
router.post('/login', validation.login, authController.login);
// router.post('/login', userController.login);

// module.exports = app => {
//   const customers = require("../controllers/customer.controller.js");

//   // Create a new Customer
//   app.post("/customers", customers.create);

//   // Retrieve all Customers
//   app.get("/customers", customers.findAll);

//   // Retrieve a single Customer with customerId
//   app.get("/customers/:customerId", customers.findOne);

//   // Update a Customer with customerId
//   app.put("/customers/:customerId", customers.update);

//   // Delete a Customer with customerId
//   app.delete("/customers/:customerId", customers.delete);

//   // Create a new Customer
//   app.delete("/customers", customers.deleteAll);
// };

module.exports = router;