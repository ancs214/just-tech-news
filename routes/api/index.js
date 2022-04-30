//file to collect all the API routes and package them up for us
const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');

//here we are setting the prefix '/users' and '/posts' so that we dont have to in all of our routes in user-routes.js/post-routes.js...
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);


module.exports = router;
