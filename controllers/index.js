const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');

//here we are prefixing the API endpoints with '/api'
router.use('/api', apiRoutes);

router.use('/', homeRoutes);

//if we make a request to any endpoint that doesnt exist, 404 status response
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;
