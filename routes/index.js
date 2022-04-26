const router = require('express').Router();

const apiRoutes = require('./api');

//here we are prefixing the API endpoints with '/api'
router.use('/api', apiRoutes);

//if we make a request to any endpoint that doesnt exist, 404 status response
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
