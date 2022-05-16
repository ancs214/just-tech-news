//  CUSTOM MIDDLEWARE FUNCTION
const withAuth = (req, res, next) => {
    //if no session is open, redirect to login page
    if (!req.session.user_id) {
      res.redirect('/login');
    //else to to next function
    } else {
      next();
    }
  };
  
  module.exports = withAuth;