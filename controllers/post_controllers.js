const db = require("../module/models");
const fs = require("fs");
const Post = db.post;
const User = db.user;
const Comment = db.comments;
const Seen = db.status;
const Validator = require("fastest-validator");

//!----------new post-----------------------------//

exports.createNewPost = (req, res, next) => {
  //* userId get from user middelware.--//
  const url = req.protocol + "://" + req.get("host");
  const post = {
    title: req.body.title,
    content: req.body.content,
    userId: req.userdata.userId,
    imageUrl: url + '/images/' + req.file.filename,
  };
  //* Validation //
  const schema = {
    title: {
      type: "string",
      optional: false,
      max: "250"
    },
    content: {
      type: "string",
      optional: false,
      max: "100"
    }
  };
  const v = new Validator();
  const validationResponce = v.validate(post, schema);

  if (validationResponce !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      error: validationResponce
    });
  }
  console.log("42 req body - ", req.body);
  console.log("42 req file - ", req.file);
  Post.create(post)
    .then((resulter) => {
      res.status(200).json({
        message: "New Post Created",
        post: resulter,
      });
      console.log("50 req file - ", req.file);
    })
    .catch((err) => {
      res.status(500).json({
        message: "post not saved",
        error: err,
      });
    });
};
//!---------------------------------------------//

//!---------get one post-----------------------//

exports.singlePost = (req, res, next) => {
  //*--get url parameters--//
  const id = req.params.id;
  console.log(id);
  Post.findByPk(id)
    .then((resulter) => {
      if (resulter) {
        res.status(200).json(resulter);
      } else {
        res.status(400).json({
          message: "can not find the post",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "something went wrong",
      });
    });
};

//!-------------------update post----------------------//

exports.updatePost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let post = await Post.findOne({
    where: {
      id: req.params.id,
      userId: req.userdata.userId
    }
  });
  console.log("post 89 - ", post);
  console.log(req.body, "90 - req body");
  console.log(req.file, ' req file 91');

  if (req.file) {

    post = {
      id: req.params.id,
      userId: req.body.userId,
      content: req.body.content,
      title: req.body.title,
      imageUrl: url + '/images/' + req.file.filename,

    };
  } else {
    post = {
      id: req.params.id,
      userId: req.body.userId,
      content: req.body.content,
      title: req.body.title,
    };
  }
  Post.update(post, {
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.status(201).json({
        message: "post updated successfully¡",
        post: post
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
};

// * ---------------------------------------------------//


//!---------get all post----------------------//

exports.getAllPosts = async (req, res, next) => {
  let loginUserId = req.userdata.userId;
  console.log("login User Id : 222", loginUserId);
  let allPosts;
  try {
    allPosts = await Post.findAll({
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [{
          model: User
        },
        {
          model: Seen
        },
        {
          model: Comment,
          include: User
        },
      ]
    })
    const resObj = await Promise.all(allPosts.map(async singlePost => getSinglePost(singlePost, loginUserId)));
    console.log(" 241", await resObj);
    res.status(200).json(resObj);
  } catch (err) {
    console.log(err)
    allPosts = res.status(500).json({
      message: 'Something went wrong'
    })
  };
}

// *---------- function for single post mapping -----------------//

const getSinglePost = async (singlePost, loginUserId) => {
  try {
    console.log("256 single post", singlePost);
    const result = await getReadStatus(singlePost, loginUserId);
    return Object.assign({}, {
      post_id: singlePost.id,
      post_creater_first_name: singlePost.user.first_name,
      post_creater_last_name: singlePost.user.last_name,
      content: singlePost.content,
      title: singlePost.title,
      imageUrl: singlePost.imageUrl,
      posted: singlePost.updatedAt,
      created: singlePost.createdAt,
      userId: singlePost.user.id,
      isRead: result,
      comments: singlePost.comments.map((singleComment) => {
        return Object.assign({}, {
          comment_id: singleComment.id,
          commented_by: singleComment.user.first_name,
          post_id: singleComment.postId,
          content: singleComment.content,
          posted: singleComment.updatedAt,
          created: singleComment.createdAt,
        })
      })
    })
  } catch (error) {
    console.log(error);
  }
};

//* -----------Here is the code inside status map----------------------//
const getReadStatus = async (singlePost, loginUserId) => {

  const result = await Seen.findOne({
    where: {
      userId: loginUserId,
      postId: singlePost.id
    }
  }).catch(err => {
    console.log(err);
  });
  //* Conditional (ternary) operator**/
  return result ? true : false;
};

//!---------Delete post----------------------//

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  //* only cretaer can delete it --//
  const userId = req.userdata.userId;
  Post.destroy({
      where: {
        id: id,
        userId: userId
      }
    })
    .then((resulter) => {
      res
        .status(200)
        .json({
          message: "post deleted succesfully"
        })
        .catch((error) => {
          res.status(500).json({
            message: "something went wrong",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(401).json({
        message: "something went wrong",
        error: error,
      });
    });
};