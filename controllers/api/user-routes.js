const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method) 
    //findAll is like 'SELECT * FROM users'
    User.findAll({
      //instructed the query to exclude the password column
      attributes: { exclude: ['password'] }
    })
        //respond in json format
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET A SINGLE USER
router.get('/:id', (req, res) => {
    //findOne is like 'SELECT * FROM users WHERE id = ?'
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
          id: req.params.id
        },
        //to include posts made and upvotes cast by the user specified
        //using our 'through table' (Vote)!
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at']
          },
          //include Comment model - show post title that was commented on
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          },
          //include Post model - show voted_posts (from Post model)
          {
            model: Post,
            attributes: ['title'],
            through: Vote,
            as: 'voted_posts'
          }
        ]
      })
      
        .then(dbUserData => {
            if (!dbUserData) {
                //if user does not exist, respond w 404 status
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// CREATE A USER -  /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    //create func is like:
    //INSERT INTO users (username, email, password) 
    //VALUES ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    //save user id and username to session with a boolean describing whether or not user is logged in
    //req.session.save() method will initiate the creation of the session and then run the callback function once complete
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
    
        res.json(dbUserData);
      });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


//LOGIN ROUTE  -  GET method carries the request parameter appended in the URL string, whereas a POST method carries the request parameter in req.body, which makes it a more secure way of transferring data from the client to the server.
router.post('/login', (req, res) => {
// expects {email: 'lernantino@gmail.com', password: 'password1234'}
User.findOne({
  where: {
    email: req.body.email
  }
  //result of findOne passed in as dbUserData
}).then(dbUserData => {
  //if email does not exist, throw error message
  if (!dbUserData) {
    res.status(400).json({ message: 'No user with that email address!' });
    return;
  }

  // Verify user with instance method we created in user.js
  const validPassword = dbUserData.checkPassword(req.body.password);
  if (!validPassword) {
    res.status(400).json({ message: 'Incorrect password!' });
    return;
  }

  //CREATE NEW SESSION
  req.session.save(() => {
    // declare SESSION VARIABLES
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;
  
  res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
  });  
});

//LOGOUT ROUTE
router.post('/logout', withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});



// UPDATE USER INFO  -  /api/users/1
router.put('/:id', withAuth, (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    //mySQL syntax: UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;
    User.update(req.body, {
      //need this option true in order to use 'beforeUpdate' hook function in user.js
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

// DELETE A USER   -   /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;