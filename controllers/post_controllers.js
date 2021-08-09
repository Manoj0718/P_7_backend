const db = require("../module/models");
const fs = require("fs");
const Post = db.post;
const User = db.user;
const Comment = db.comments;
const Seen = db.status;
const Validator = require("fastest-validator");
const {
  status
} = require("../module/models");

//!----------new post-----------------------------//
exports.createNewPost = (req, res, next) => {
  //* userId get from user middelware.--//
  const url = req.protocol + "://" + req.get("host");
  const post = {
    title: req.body.title,
    content: req.body.content,
    userId: req.userdata.userId,
    imageUrl: url + "/images/" + req.file.filename,
    seen: [req.body.seen],
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
  }

  const v = new Validator();
  const validationResponce = v.validate(post, schema);

  if (validationResponce !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      error: validationResponce
    });
  }
  Post.create(post)
    .then((resulter) => {
      res.status(200).json({
        message: "New Post Created",
        post: resulter,
      });
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
  //--get url parameters--//
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
//!------------------------------------------//

//!---------update post p6 way----------------------//
// exports.updatePost = (req,res,next) => {
//   const id = req.params.id;
//   const body = req.body;
//   console.log("body",body);
//   const updatePost = {
//     title : req.body.title,
//     content : req.body.content,
//     imageUrl:req.body.imageUrl,
//   }
//   const userId = req.userdata.userId;
//   Post.update(updatePost, { where: { id:id, userId: userId }}).then(result=>{
//     res.status(200).json({ message : "post Updated",post : updatePost})
//   }).catch(err=>{
//     res.status(404).json({ message : 'not updated', error : err })                         
//   });

// }

// exports.updatePost = async (req, res) => {
//   let post = await Post.findOne({ where: { id: req.params.id } });
//   console.log('image01',post.imageUrl);
//   console.log('updatePost', post);
//    const body = req.body;
//    console.log("full body", body);

//   if(req.files) {
//     console.log('image2',post.imageUrl);
//     const filename = req.file.filename;
//     fs.unlink("images/" + filename, (error) => {
//       if (error) {s
//         console.log(error);
//         console.log('image3',post.imageUrl);
//       } else {
//         console.log("successfully deleted local image");
//         console.log('image4',post.imageUrl);

//       }
//     });
//     const url = req.protocol + "://" + req.get("host");
//     post = {
//       title: req.body.title,
//       content: req.body.content,
//       imageUrl: url + "/images/" + req.file.filename,

//     };
//     console.log('image5',post.imageUrl);
//   } else {
//     post = {
//       title: req.body.title,
//       content: req.body.content,
//       imageUrl: req.body.imageUrl,

//     };
//     console.log('image6',post.title);
//   }

//   try {
//     const response = await Post.update(post, { where: { id: req.params.id } });
//     res.status(200).json({ message: "Post updated successfully!" });
//     console.log('image7',post.imageUrl);
//     console.log('image8',post.title);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: err.message });
//   }
// };

//TODO - First Try--------//
exports.updatePost = async (req, res) => {
  let post = await Post.findOne({
    where: {
      id: req.params.id
    }
  });
  console.log("updateing post", post);
  let body = req.body;
  let file = req.file;
  console.log("request body", body);
  console.log("request file", file);

  if (req.file) {
    console.log("request file", req.file);
    const filename = post.image.split("../images")[1];
    console.log("filename", filename);
    fs.unlink("images/" + filename, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("successfully deleted local image");
      }
    });
    const url = req.protocol + "://" + req.get("host");
    post = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: url + "/images/" + req.file.filename,
    };
  } else {
    console.log("file thinks nothing change in image", req.file);
    post = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      userId: req.userdata.userId,
    };
  }

  try {
    const userId = req.userdata.userId;
    const response = await Post.update(post, {
      where: {
        id: req.params.id,
        userId: userId
      }
    });
    res.status(201).json({
      message: "Post updated successfully!",
      response: post,
      responce: response,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message
    });
  }
};
//!-----------------------------------------//

//!---------get all post----------------------//

// //* This is for posts//--
exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [
      ['updatedAt', 'DESC']
    ],
    include: [
      {
        model: User,
      },
      {model:Seen},
      {
        model: Comment,
        include: User,
      },
    ],
  }).then(allPosts => {
    //console.log("all post", allPosts);
    const resobj = allPosts.map((singlePost) => {
      console.log("single post Here- ", singlePost);
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
        statuses : singlePost.statuses.map(stat=>{
          return Object.assign({},{
            stat_id: stat.id,
            stat_postId : stat.postId,
            stat_userId : stat.userId,
          })
                      }),
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

      });
    })
    res.status(200).json(resobj);
    console.log("after done =>", resobj);
  }).catch((err) => {
    console.log(err)
  })
};
// https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

//!-------------------------------------------//

//!---------Delete post----------------------//

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  const userId = req.userdata.userId; //- only cretaer can delete it --//
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
//!-------------------------------------------//