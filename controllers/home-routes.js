//this file contains all user-facing routes


const router = require('express').Router();
//import sequelize modules and models
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');



//since we are using a template engine, we use res.render and specify our template -- homepage.handlbars
//res.render can accept a second argument; an object, which will be the data we want to pass into our template (this data will coincide with our posts route requirements)

//HOMEPAGE
router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                //include the Comment model
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                //include User model within Comment model to show username of user who made the comment
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                //include User model to show username of user who created post
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            //loop over and map each sequelize obj into a serialized version of itself, saving results into a new posts array
             //must serialize data with Sequelize's get() method or else we get much more data than intended. (we didnt need to before because res.json did it for us)
            const posts = dbPostData.map(post => post.get({ plain: true }));
            //we take that array and add it to an object to pass into the template
            res.render('homepage', { 
              posts,
              loggedIn: req.session.loggedIn 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//LOGIN PAGE (we dont have any variables to plug into our login page so we dont need to pass in a second argument to res.render)
router.get('/login', (req, res) => {
    //if logged in already, redirect to homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }    

    res.render('login');
  });


  //GET SINGLE POST PAGE
  router.get('/post/:id', (req, res) => {
    //findOne is like 'SELECT * FROM users WHERE id = ?'
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
  
        // pass data to template
        res.render('single-post', { 
          post, 
          //so we can pass a session variable into the template
          loggedIn: req.session.loggedIn 
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  


module.exports = router;
