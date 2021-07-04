const db = require("../module/models");
const fs = require("fs");
const Post = db.post;
const User = db.user;
const Comment = db.comments;
//const User = db.user;

//!----------new post-----------------------------//
exports.createNewPost = (req, res, next) => {
  //req.body.post = JSON.parse(req.body.post);
  //todo - this what i mean, cz logged.--//
  //console.log(req.file);
  const url = req.protocol + "://" + req.get("host");
  const post = {
    title: req.body.title,
    content: req.body.content,
    userId: req.userdata.userId,
    imageUrl: url + "/images/" + req.file.filename,
    // take from token, here hardcoded
  };

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
exports.updatePost = (req,res,next) => {
  const id = req.params.id;
  const body = req.body;
  console.log("bosy",body);
  const updatePost = {
    title : req.body.title,
    content : req.body.content,
    imageUrl:req.body.imageUrl,
  }
  const userId = req.userdata.userId;
  Post.update(updatePost, { where: { id:id, userId: userId }}).then(result=>{
    res.status(200).json({ message : "post Updated",post : updatePost})
  }).catch(err=>{
    res.status(404).json({ message : 'not updated', error : err })                         
  });

}

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
// exports.updatePost = (req, res, next) => {
//   let sauce =  Post.findOne({ where: { id: req.params.id } });
//   console.log('updatePost', sauce);
//   const body = req.body;
//   console.log("full body", body);

//     if (req.file) {
//         req.body.sauce = JSON.parse(req.body.sauce);
//         const url = req.protocol + "://" + req.get("host");
//         sauce = {
//             id: req.params.id,
//             title: req.body.sauce.title,
//               content: req.body.sauce.content,
//             imageUrl: url + "/images/" + req.file.filename,
            
//         };
//     } else {
//         sauce = {
//             id: req.params.id,
//             title: req.body.title,
//               content: req.body.content
//         };
//     }

//     const userId = req.userdata.userId;
//     Post.update(sauce,{ where: { id: req.params.id, userId: userId } } )
//      .then((resulter) => {
//        res.status(200).json({
//         result: resulter, //*this is a boolen**/
//          message: "Post Updated",
//         post: updatedPost,
//          id:updatedPost.imageUrl,
//        });

//     })
//     .catch((error) => {
//        res.status(500).json({
//          message: "Not Working",
//          error: error,
//        });
//      });
  // console.log( "reqbody ",req.body);
  // const id = req.params.id;
  // const url = req.protocol + "://" + req.get("host");
  // let updatedPost = {
  //   title: req.body.title,
  //   content: req.body.content,
  //   //TODO - file name  "imageUrl": "http://localhost:3200/images/undefined"
  //   //TODO - frontend can not update, backend can update texts.
  //   imageUrl:url + "/images/" + req.file.filename,
  //   //imageUrl: url+"/images/"+req.filename,
  //   //imageUrl: url+"/images/"+req.body.filename,
  // };
  // const userId = req.userdata.userId;
  // //const userId = 1;
  // Post.update(updatedPost, { where: { id: id, userId: userId } })
  //   .then((resulter) => {
  //     res.status(200).json({
  //       result: resulter, //*this is a boolen**/
  //       message: "Post Updated",
  //       post: updatedPost,
  //       id:updatedPost.imageUrl,
  //     });

  //   })
  //   .catch((error) => {
  //     res.status(500).json({
  //       message: "Not Working",
  //       error: error,
  //     });
  //   });
//};
//!-----------------------------------------//

//!---------get all post----------------------//
exports.getAllPosts = async (req, res, next) => {
  User.findAll({
    //*  Will order through an associated model's createdAt using the model names as the associations' names.
    order:[[Post,'updatedAt','DESC']],
    include: [
      {
        model: db.post,
        include: [{ model: Comment }],
      },
    ],
  })
    .then((Users) => {
      const resObj = Users.map((user) => {
        console.log("Users All - ", Users);
        return Object.assign(
          {},
          {
            first_name: user.first_name,
            last_name: user.last_name,
            id:user.id,
            // posted: post.post.createdAt,
            posts: user.posts.map((post) => {
              return Object.assign(
                {},
                {
                  post_id: post.id,
                  post_creatoe_first_name: user.first_name,
                  post_creatoe_last_name: user.last_name,
                  content: post.content,
                  title: post.title,
                  imageUrl: post.imageUrl,
                  posted: post.updatedAt,
                  created: post.createdAt,
                  comments: post.comments.map((comment) => {
                    return Object.assign(
                      {},
                      {
                        comment_id: comment.id,
                        creatoe_first_name: user.first_name,
                        post_id: comment.post_id,
                        content: comment.content,
                        posted: comment.updatedAt,
                        created: comment.createdAt,
                      }
                    );
                  }),
                }
              );
            }),
          }
        );
      });
      res.status(200).json(resObj);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

//!-------------------------------------------//

//!---------Delete post----------------------//

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  const userId = req.userdata.userId; //- only cretaer can delete it --//
  Post.destroy({ where: { id: id, userId: userId } })
    .then((resulter) => {
      res
        .status(200)
        .json({ message: "post deleted succesfully" })
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
