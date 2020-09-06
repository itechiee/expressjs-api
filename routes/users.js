var express = require('express');
var router = express.Router();
var userController = require("../controller/user.js");
var authController = require("../controller/auth.js");
var validation = require('../helpers/validation');

router.get('/', userController.findAll);
router.post('/register', validation.register, authController.create);
router.post('/login', validation.login, authController.login);
router.post('/forgetpassword', validation.forgetpassword, authController.forgetPassword);

module.exports = router;