//imported Model class and Datatypes object from sequelize
//Model class is what we create our own models from 
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {
  //JS's static keyword indicates that the upvote method is one that's based on the Post model and not an instance method like with the User model.
  static upvote(body, models) {
    
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      // then find the post we just voted on or requested
      return Post.findOne({
        where: {
          //to retrieve id of post: Post id = post_id (as defined above)  ??i think
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
           // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}
  

// create fields/columns for Post model
Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isURL: true
        }
      },
      //this column determines who posted the article
      user_id: {
        type: DataTypes.INTEGER,
        //create a reference to the User model's id column (create foreign key)
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: 'post'
    }
  );

  module.exports = Post;