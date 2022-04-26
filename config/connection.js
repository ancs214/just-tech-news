// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

//import environment variables from .env file -- notice we do not need to save to a variable here
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize('just_tech_news_db', 'root', 'Iamgreat1!', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;