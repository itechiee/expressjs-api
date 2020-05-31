const Sequelize = require('sequelize');
require('dotenv').config();

// Option 1: Passing parameters separately
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
// const mysql = require('mysql');
// require('dotenv').config();
// //create database connection
// const conn = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_DATABASE
// });

// //connect to database
// conn.connect((err) =>{
//   if(err) throw err;
// });

module.exports = sequelize;