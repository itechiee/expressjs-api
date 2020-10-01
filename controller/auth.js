var moment = require("moment");
let bcrypt = require('bcrypt');
const forgetPasswordModel = require('../model/ForgetPassword');
const userModel = require('../model/User');
const mailer = require('../helpers/mailer');
require('dotenv').config();

// User Register
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(JSON.stringify({"status": 400, "error": [ {msg : "Content can not be empty!"}] , "response": null }));      
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
                            "error": [ {msg : error.message || "Some error occurred while creating users."}], 
                            "response": null 
                          }));
                    })
};


// User Login
exports.login = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(JSON.stringify({"status": 400, "error":  [{msg : "Content can not be empty!"}], "response": null }));      
  }
  // Login a User
  // let saltRounds = process.env.SALT_ROUNDS;
  let user = {
      username: req.body.username,
      password: req.body.password,
      device_id: req.body.device_id
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
                  return res.status(422).send(handleError(422, "Please contact blastsmshelp@gmail.com to activate the account"));
                }
                 
              
                let hashPassword = userData.password;
                bcrypt.compare(user.password, hashPassword, function(bcryptErr, bcryptRes) {
                  if (bcryptErr){
                      res.status(500).send(JSON.stringify({
                        "status": 500, 
                        "error": [{msg : bcryptErr.message || "Some error occurred while compare password."}], 
                        "response": null 
                      }));
                  }
                  if (bcryptRes) {

                    // Multiple users login login
                    if(userData.multiple_user == false) {
                      if(userData.device_id === '' || userData.device_id === null ) {
                          userModel.update({ device_id: user.device_id }, 
                                        { where: { username: user.username } 
                                        });
                      } else {
                        if(user.device_id !== userData.device_id) {
                          return res.status(422).send(handleError(422, "Login is tied with other device email blastsmshelp@gmail.com for support"));
                        } 
                      }
                    }
                    
                    // Send user data
                    delete userData.password;
                    res.send(JSON.stringify({"status": 200, "error": null, "response": userData }));
                  } else {
                    // response is OutgoingMessage object that server response http request
                    return res.status(422).send(JSON.stringify({
                      "status": 422, 
                      "error": [{msg : "Passwords do not match"}], 
                      "response": null 
                    }));
                  }
                });
            }).catch(function (error) {
                // handle error;
                res.status(500).send(JSON.stringify({
                  "status": 500, 
                  "error": [{msg : error.message || "Some error occurred while login."}], 
                  "response": null 
                }));
            });
};


// User Forget Password
exports.forgetPassword = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(JSON.stringify({"status": 400, "error": [ {msg : "Content can not be empty!"}] , "response": null }));      
  }

  let userEmail = req.body.email;

  await userModel.findOne({
        where: {
            email: userEmail
        }
      }).then(userResult => {
        if(userResult === null) {
          return res.status(422).send(
            handleError(422, "Email not exists")
          );
        }
        let userData = userResult.dataValues;
        
        let currentDate = moment().format('YYYY-MM-DD HH:mm:ss'),
        expiryDate = moment(currentDate).add(process.env.FORGET_PASSWORD_EXPIRY_DELAY_HOURS, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        PinNumber = Math.floor(1000 + Math.random() * 9000);

        let forgetPasswordData = {
          user_id: userData.id,
          pin: PinNumber,
          expire_at: expiryDate,
          created_at: currentDate          
        };

        let mailData = {
          pin: forgetPasswordData.pin,
          email: userData.email,
          username: userData.username
        };
        forgetPasswordModel.findOne({
          where: {
              user_id: userData.id
          }
        }).then(forgetPwdResult => {
          if(forgetPwdResult === null) {
            forgetPasswordModel.create(forgetPasswordData)
                .then(data => {
                    // send mail
                    mailer.sendForgetPasswordMail(mailData, res);
                })
                .catch(error => {
                        res.status(500).send(JSON.stringify({
                          "status": 500, 
                          "error": [ {msg : error.message || "Some error occurred while generating forget password pin"}], 
                          "response": null 
                        }));
                  })
          } else {
            let forgetPwdData = forgetPwdResult.dataValues;
            forgetPasswordModel.update(
              { 
                pin: forgetPasswordData.pin,
                expire_at: forgetPasswordData.expire_at,
                created_at: forgetPasswordData.created_at
              }, 
              { 
                where: { user_id: forgetPwdData.user_id } 
              }).then(data => {
                  // send mail
                  mailer.sendForgetPasswordMail(mailData, res);
              })
              .catch(error => {
                res.status(500).send(JSON.stringify({
                  "status": 500, 
                  "error": [ {msg : error.message || "Some error occurred while generating forget password pin"}], 
                  "response": null 
                }));
              });
          }
          
        })
    }).catch(function (error) {
        // handle error;
        res.status(500).send(JSON.stringify({
          "status": 500, 
          "error": [{msg : error.message || "Some error occurred while forget password."}], 
          "response": null 
        }));
    });
};

// Update new passwird
exports.newpassword = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send(JSON.stringify({"status": 400, "error": [ {msg : "Content can not be empty!"}] , "response": null }));      
  }

  let inputData = {
    email: req.body.email,
    pin: req.body.pin
  };
  // Generate new password
  let saltRounds = process.env.SALT_ROUNDS,
  password = await bcrypt.hashSync(req.body.password, parseInt(saltRounds));
  await userModel.findOne({ // check users email exists 
        where: {
            email: inputData.email
        }
      }).then(userResult => {
        if(userResult === null) {
          return res.status(422).send(
            handleError(422, "Email not exists")
          );
        }
        let userData = userResult.dataValues;        
        forgetPasswordModel.findOne({ // Check forget password data exists
          where: {
              user_id: userData.id,
              pin: inputData.pin
          }
        }).then(forgetPwdResult => { 
            if(forgetPwdResult === null) {
                return res.status(422).send(
                  handleError(422, "PIN not found")
                );
            }
            // Compare expiry dates for PIN
            let forgetPwdData = forgetPwdResult.dataValues,
            currentDate = moment(moment().format('YYYY-MM-DD HH:mm:ss')),
            expiryDate = moment(moment(forgetPwdData.expire_at).utc().format('YYYY-MM-DD HH:mm:ss')),
            isPinExpired = expiryDate.diff(currentDate, 'seconds');

            if(isPinExpired < 0) {
                return res.status(422).send(
                  handleError(422, "PIN number expired")
                );
            }
            // Update new password
            userModel.update(
                { password: password }, 
                { where: { id: userData.id } }
              )
              .then(updateResult => {
                if(updateResult) {
                  return res.send(JSON.stringify({"status": 200, "error": null, "response": 'Password updated successfully' }));
                }                        
              });
        })
    }).catch(function (error) {
        // handle error;
        res.status(500).send(JSON.stringify({
          "status": 500, 
          "error": [{msg : error.message || "Some error occurred while forget password."}], 
          "response": null 
        }));
    });
}

handleError = (status, msg, res = null) => {
  return JSON.stringify({
    "status": status, 
    "error": [{
            msg : msg
      }], 
    "response": res 
  })
}