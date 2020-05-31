var db = require('../db');
let bcrypt = require('bcrypt');

// constructor
const User = function(user) {
  
  this.username = user.username;
  this.password = user.password;
  this.email = user.email;
  this.mobile = user.mobile;
  this.name = user.name;
  this.active = user.active;
  this.device_id = user.device_id;
  this.created_at = new Date();
};

User.create = async (newUser, result) => {
  let saltRounds = process.env.SALT_ROUNDS;
  newUser.password = await bcrypt.hashSync(newUser.password, parseInt(saltRounds));
  db.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    delete newUser.password;
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findAll = result => {
  db.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

module.exports = User;
