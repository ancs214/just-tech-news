//file to collect all the API routes and package them up for us
const router = require('express').Router();

const userRoutes = require('./user-routes.js');

//here we are setting the prefix '/users' so that we dont have to in all of our routes in user-routes.js
router.use('/users', userRoutes);

module.exports = router;
