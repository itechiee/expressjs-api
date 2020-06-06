const {check, validationResult} = require('express-validator');
const userModel = require('../model/User');

exports.register = [
    check('name')
        .trim()
        .escape()
        .not()
        .isEmpty().withMessage('Name field is required!')
        .bail()
        .isLength({min: 3}).withMessage('Minimum 3 characters required!')
        .bail(),
    
    check('username')
        .trim()
        .escape()
        .not()
        .isEmpty().withMessage('Username field is required!')
        .bail()
        .isLength({min: 3}).withMessage('Minimum 3 characters required!')
        .bail()
        .custom(async username => {
            await usernameExists(username);
          }),

    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty().withMessage('Password field is required!')
        .bail()
        .isLength({min: 3}).withMessage('Minimum 3 characters required!')
        .bail(),

    check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty().withMessage('Invalid email address!')
        .bail()
        .custom(async email => {
            await emailExists(email);
          }),

    check('mobile')
        .trim()
        .escape()
        .not()
        .isEmpty().withMessage('Mobile field is required!')
        .bail()
        .isLength({min: 8}).withMessage('Minimum 8 numbers required!')
        .isNumeric().withMessage('Mobile number should be numeric!')
        .bail(),

    (req, res, next) => {
        // const errors = validationResult(req);
        // const myValidationResult = validationResult.withDefaults({
        //     formatter: (error) => {
        //       return {
        //         msg: error.msg,
        //       };
        //     }
        //   });
        //   const errors = myValidationResult(req).array();
        //   console.log(errors);
          const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            // Build your resulting errors however you want! String, object, whatever - it works!
            return {msg:msg};
          };
          const errors = validationResult(req).formatWith(errorFormatter);
console.log(errors);
        if (!errors.isEmpty())
            return res.status(422).json({status: 422, error: errors.array(), response: null });      
        next();
    },
];

usernameExists = async (username) => {
    await userModel.findAll({
        where: {
            username
        }
      }).then(result => {
        if(result.length > 0) {
            throw new Error('Username already exists');
        }
    }).catch(function (err) {
        // handle error;
        console.log("Error verifying username...");
        throw err;
    });
}

emailExists = async (email) => {
    await userModel.findAll({
        where: {
            email
        }
      }).then(result => {
        if(result.length > 0) {
            throw new Error('Email already exists');
        }
    }).catch(function (err) {
        // handle error;
        console.log("Error verifying email...");
        throw err;
    });
}


exports.login = [
    check('username')
        .trim()
        .escape()
        .not()
        .isEmpty().withMessage('Username field is required!')
        .bail()
        .isLength({min: 3}).withMessage('Minimum 3 characters required!')
        .bail(),

    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty().withMessage('Password field is required!')
        .bail()
        .isLength({min: 3}).withMessage('Minimum 3 characters required!')
        .bail(),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        return res.status(422).json({status: 422, error: errors['errors'], response: null });      
        next();
    },
];