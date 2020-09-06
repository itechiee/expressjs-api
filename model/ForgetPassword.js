const Sequelize = require('sequelize');
var sequelize = require('../db');

const ForgetPassword = sequelize.define('forget_password', {
    user_id: {
      type: Sequelize.INTEGER,
    },
    pin: {
          type: Sequelize.STRING,
        },
    expire_at: {
      type: Sequelize.DATE
      // allowNull defaults to true
    },
    created_at: {
      type: Sequelize.DATE
      // allowNull defaults to true
    }
}, {
  createdAt: 'created_at',
  timestamps: false,
  freezeTableName: true
});

module.exports = ForgetPassword;