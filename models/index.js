//collect and export User and Post object data
const User = require('./User');
const Post = require("./Post");
const Vote = require('./Vote');
const Comment = require('./Comment');

// USER:POST ASSOCIATION   *one-to-many*
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id',
});


//With these two .belongsToMany() methods in place, we're allowing both the User and Post models to query each other's information in the context of a vote. If we want to see which users voted on a single post, we can now do that. If we want to see which posts a single user voted on, we can see that too.
//USER:POST ASSOCIATION   *many-to-many
User.belongsToMany(Post, {
    //user and post are connected THROUGH the vote model with the name 'voted_posts'
    through: Vote,
    as: 'voted_posts',
    //FK is in the Vote table 'user_id'
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    //user and post are connected THROUGH the vote model with the name 'voted_posts'
    through: Vote,
    as: 'voted_posts',
    //FK is in the Vote table 'post_id'
    foreignKey: 'post_id'
});


//VOTE:USER AND VOTE:POST ASSOCIATIONS
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});


//COMMENT:USER AND COMMENT:POST ASSOCIATIONS
Comment.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
  Comment.belongsTo(Post, {
    foreignKey: 'post_id'
  });
  
  User.hasMany(Comment, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Comment, {
    foreignKey: 'post_id'
  });
  


module.exports = { User, Post, Vote, Comment };