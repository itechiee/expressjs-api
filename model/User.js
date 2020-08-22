const Sequelize = require('sequelize');
var sequelize = require('../db');

// const Model = Sequelize.Model;
// class User extends Model {}
// User.init({
//   // attributes
//   name: {
//     type: Sequelize.STRING,
//     // allowNull: false
//   },
//   username: {
//     type: Sequelize.STRING
//     // allowNull defaults to true
//   },
//   password: {
//     type: Sequelize.STRING
//     // allowNull defaults to true
//   },
//   mobile: {
//     type: Sequelize.STRING
//     // allowNull defaults to true
//   },
//   email: {
//     type: Sequelize.STRING
//     // allowNull defaults to true
//   },
//   active: {
//     type: Sequelize.BOOLEAN
//     // allowNull defaults to true
//   },
//   device_id: {
//     type: Sequelize.STRING
//     // allowNull defaults to true
//   },
//   created_at: {
//     type: Sequelize.DATE
//     // allowNull defaults to true
//   }
// }, {
//   sequelize,
//   modelName: 'user'
//   // options
// });


const User = sequelize.define('user', {
    // attributes
    // id: {
    //       type: Sequelize.INTEGER,
    //       primaryKey: true,
    //       autoIncrement: true
    //     },
    name: {
          type: Sequelize.STRING,
          // allowNull: false
        },
    username: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    password: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    mobile: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    email: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    active: {
      type: Sequelize.BOOLEAN
      // allowNull defaults to true
    },
    device_id: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    multiple_user: {
      type: Sequelize.BOOLEAN
    },
    created_at: {
      type: Sequelize.DATE
      // allowNull defaults to true
    }
}, {
  createdAt: 'created_at',
  timestamps: false,
});

// User.findAll().then(users => {
//   console.log("All users:", JSON.stringify(users, null, 4));
// });

// User.findAll().then( users => {
//     return JSON.stringify(users);
// });

module.exports = User;