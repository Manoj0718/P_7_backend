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
const Sequelize = require("sequelize");


//!----------new post-----------------------------//
exports.createNewPost = (req, res, next) => {
  //* userId get from user middelware.--//
  const url = req.protocol + "://" + req.get("host");
  const post = {
    title: req.body.title,
    content: req.body.content,
    userId: req.userdata.userId,
    imageUrl: url + "/images/" + req.file.filename,

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
    console.log(allPosts);
    const resObj = await  allPosts.map(singlePost => getSinglePost(singlePost, loginUserId));
    console.log("after done =>", resObj);
    res.status(200).json(resObj);

  } catch (err) {
    console.log(err)
    allPosts = res.status(500).json({
      message: 'Something went wrong'
    })
  };



}


// *---------- function for single post mapping -----------------//

const getSinglePost =  (singlePost, loginUserId) => {
  //let isSeen;
  //console.log(await getReadStatus());
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
    isRead:   getReadStatus(singlePost, loginUserId),
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
};

// -----------Here is the code inside status map----------------------//


const getReadStatus =  (singlePost, loginUserId)=>{

  Seen.findOne({where: {userId: loginUserId,postId: singlePost.id}}).then((isSeen)=>{
   if(isSeen) { 
     console.log (`here is the 294  ${isSeen.postId} & ${isSeen.userId}`);
     return isSeen ? true
     : singlePost ==loginUserId ? true
     : false;
     
 }

 }).catch((err) =>{console.log (err , "291. error")});
 //console.log (`here is the 300  ${isSeen}`);
 

};


// isIdUnique(id).then(isUnique => {
//   if (isUnique) {
//       // ...
//   }
// });






// async function  getReadStatus (singlePost, loginUserId){
// // console.log (loginUserId, '288 login id');
// const isSeen= await Seen.findOne({where: {userId: loginUserId,postId: singlePost.id}}).catch((err) =>{console.log (err , "291. error")});
// if(isSeen){
//   console.log (`here is the  ${isSeen.postId} & ${isSeen.userId}`);
//   return true ;
// }
//   // return singlePost.userId === loginUserId ? true
//   //        : false;
// };


// // Seen.findOne({ where: {userId: loginUserId, postId: singlePost.id } }).then((isSeen)=>{
// //   if (isSeen) {
// //     call(isSeen,singlePost, loginUserId);
// //     // console.log(isSeen.postId, " line 291 : isSeen post Id ");
// //     }
// // }).catch((err) => {console.log(err)});

//  };
// function call(isSeen,singlePost, loginUserId) {
//   console.log(isSeen.postId, " line 301 : isSeen post Id ");
//   return isSeen ? true
//          : singlePost ==loginUserId ? true
//          : false;
// }



// *----------finished single post mapping -----------------//
//!-----------------2nd try--------------------------//

// exports.getAllPosts = async (req, res, next) => {

//   let loginUserId = req.userdata.userId;
//   // ----------------------------
//   const getReadStatus = async (singlePost, loginUserId) => {
//     if (singlePost.userId === loginUserId) return true;
//     const isSeen = await Seen.findOne({
//       where: {
//         userId: loginUserId,
//         postId: singlePost.id,
//       },
//     })
//     try {
//       if (isSeen) {
//         console.log("is Seen Here : ", isSeen)
//         return true;
//       }
//     } catch (e) {
//       console.log(e)
//     }
//   }


//   const getSinglePost = (singlePost) => {
//     // try {
//     // let promise = await singlePost;
//     //   console.log("single post Here- ", promise);
//     return Object.assign({}, {
//       post_id: singlePost.id,
//       post_creater_first_name: singlePost.user.first_name,
//       post_creater_last_name: singlePost.user.last_name,
//       content: singlePost.content,
//       title: singlePost.title,
//       imageUrl: singlePost.imageUrl,
//       posted: singlePost.updatedAt,
//       created: singlePost.createdAt,
//       userId: singlePost.user.id,
//       isRead: getReadStatus(singlePost, loginUserId),
//       comments: singlePost.comments.map((singleComment) => {
//         return Object.assign({}, {
//           comment_id: singleComment.id,
//           commented_by: singleComment.user.first_name,
//           post_id: singleComment.postId,
//           content: singleComment.content,
//           posted: singleComment.updatedAt,
//           created: singleComment.createdAt,
//         })
//       }),
//     });
//     // }
//     // catch (e) {
//     //   console.log("error get single post");
//     // }
//   }

//   try {
//     const allPosts = await Post.findAll({
//       order: [
//         ['updatedAt', 'DESC']
//       ],
//       include: [{
//           model: User
//         },
//         {
//           model: Seen,
//           include: User
//         },
//         {
//           model: Comment,
//           include: User
//         }
//       ],
//     })
//     const resobj = allPosts.map(singlePost => getSinglePost(singlePost));
//     res.status(200).json(resobj);
//     console.log("after done =>", resobj);

//   } catch (err) {
//     alert(err);
//   }

// };




// -------------


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
//!--------------------------------------------------------//
//!--------------------------------------------------------//
//!-------------------------------------------------------//
//!----------------------------------------------------//
//!------------------------------------------------------//
//!-------------------------------------------------//


// //* This is for  get posts all try outs//--
// exports.getAllPosts = (req, res, next) => {
// let userId = req.userdata.userId;
//   Post.findAll({
//     order: [
//       ['updatedAt', 'DESC']
//     ],
//     include: [{
//         model: User,
//       },
//       {
//         model: Seen
//       },
//       {
//         model: Comment,
//         include: User,
//       },
//     ],
//   }).then(allPosts => {
//     console.log("here is the req.body",userId);
//     const resobj = allPosts.map((singlePost) => {
//      // console.log("single post Here- ", singlePost);
//       return Object.assign({}, {
//         post_id: singlePost.id,
//         post_creater_first_name: singlePost.user.first_name,
//         post_creater_last_name: singlePost.user.last_name,
//         content: singlePost.content,
//         title: singlePost.title,
//         imageUrl: singlePost.imageUrl,
//         posted: singlePost.updatedAt,
//         created: singlePost.createdAt,
//         userId: singlePost.user.id,
//         statuses: singlePost.statuses.map(stat => {
//           return Object.assign({}, {
//             stat_id: stat.id,
//             stat_postId: stat.postId,
//             stat_userId: stat.userId,
//           })
//         }),
//         comments: singlePost.comments.map((singleComment) => {
//           return Object.assign({}, {
//             comment_id: singleComment.id,
//             commented_by: singleComment.user.first_name,
//             post_id: singleComment.postId,
//             content: singleComment.content,
//             posted: singleComment.updatedAt,
//             created: singleComment.createdAt,
//           })
//         })

//       });
//     })
//     res.status(200).json(resobj);
//     console.log("after done =>", resobj);
//   }).catch((err) => {
//     console.log(err)
//   })
// };
// https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

// exports.getAllPosts = (req, res, next) => {
//   let loginUserId = req.userdata.userId;
//     Post.findAll({
//       order: [
//         ['updatedAt', 'DESC']
//       ],
//       include: [{
//           model: User,
//         },
//         {
//           model: Seen,
//           include: User,

//         },
//         {
//           model: Comment,
//           include: User,
//         },
//       ],
//     }).then(allPosts => {
//       // console.log("before map",allPosts);
//       const resobj = allPosts.map((singlePost) => {
//         console.log("single post Here- ", singlePost);
//         return Object.assign({}, {
//           post_id: singlePost.id,
//           post_creater_first_name: singlePost.user.first_name,
//           post_creater_last_name: singlePost.user.last_name,
//           content: singlePost.content,
//           title: singlePost.title,
//           imageUrl: singlePost.imageUrl,
//           posted: singlePost.updatedAt,
//           created: singlePost.createdAt,
//           userId: singlePost.user.id,
//            statuses: singlePost.statuses.map(stat => {
// //             // if( !stat.length===0){
// //             //   console.log("empty rray",stat.id);
// //             //   stat.push(" is_status : false")
// //             // } else {
// //             //   console.log("have items",stat.id);
// //             // }
// if(loginUserId ===stat.userId && singlePost.id ) {
//   return Object.assign({}, {
//     is_status : true,
//     stat_id: stat.id,
//     stat_userId : stat.userId,
//   })
// }
// // //  else if(loginUserId ===singlePost.user.id){
// // //   console.log("loginUserId",loginUserId);
// // //   console.log("userid",singlePost.user.id);
// // //   return Object.assign({}, {
// // //     is_status : true,
// // //     stat_id: stat.id,
// // //     stat_userId : stat.userId,
// // //   })
// // // }
// //  else {
// //   return Object.assign({}, {
// //     stat_id: stat.id,
// //     is_status : false,
// //     stat_userId : stat.userId,
// //   })
// // }
//         }),
//           comments: singlePost.comments.map((singleComment) => {
//             return Object.assign({}, {
//               comment_id: singleComment.id,
//               commented_by: singleComment.user.first_name,
//               post_id: singleComment.postId,
//               content: singleComment.content,
//               posted: singleComment.updatedAt,
//               created: singleComment.createdAt,
//             })
//           }),
//         });
//       })
//       res.status(200).json(resobj);
//       console.log("after done =>", resobj);
//     }).catch((err) => {
//       console.log(err)
//     })
//   };



// exports.getAllPosts =  async (req, res, next) => {

//   let loginUserId = req.userdata.userId;

// const getReadStatus =  async (singlePost, loginUserId) => {
//   if (singlePost.userId === loginUserId) return true;
//     const isSeen = await Seen.findOne({
//     where: {
//       userId: loginUserId,
//       postId:singlePost.id,
//     },
//   })
// try {
//   if(isSeen){
//   console.log("is Seen Here : ", isSeen)
//   return true;
//     }
// } catch(e){console.log(e)}

//   // if(isSeen) {
//   //   console.log("isSeen ", isSeen);
//   //   return true;
//   // } else if(singlePost.userId === loginUserId){
//   //   console.log("singlePost.userId === loginUserId",singlePost.id);
//   //   return true ;
//   // } else {
//   //   console.log("Null post");
//   //   return false;
//   // }

// }

// // ---------------------

// const getSinglePost =async (singlePost) => {

//   // try {

// // let did = await singlePost;
// //   console.log("single post Here- ", did);

//   return Object.assign({}, {
//     post_id: singlePost.id,
//     post_creater_first_name: singlePost.user.first_name,
//     post_creater_last_name: singlePost.user.last_name,
//     content: singlePost.content,
//     title: singlePost.title,
//     imageUrl: singlePost.imageUrl,
//     posted: singlePost.updatedAt,
//     created: singlePost.createdAt,
//     userId: singlePost.user.id,
//     isRead: getReadStatus(singlePost, loginUserId),
//     // isRead : data(singlePost,loginUserId),
//     comments: singlePost.comments.map((singleComment) => {
//       return Object.assign({}, {
//         comment_id: singleComment.id,
//         commented_by: singleComment.user.first_name,
//         post_id: singleComment.postId,
//         content: singleComment.content,
//         posted: singleComment.updatedAt,
//         created: singleComment.createdAt,
//       })
//     }),
//   });
// // }
// // catch (e) {
// //   console.log("error get single post");
// // }


// }




// // ---------------------------


// try {

//  const allPosts= await Post.findAll({
//     order: [
//       ['updatedAt', 'DESC']
//     ],
//     include: [{
//         model: User
//       },
//       {
//         model: Seen,
//         include: User
//       },
//       {
//         model: Comment,
//         include: User
//       }
//     ],
//   })
//   const resobj = allPosts.map(singlePost => getSinglePost(singlePost));
//   res.status(200).json(resobj);
//   console.log("after done =>", resobj);

// }
// catch(err) {
//   alert(err); // TypeError: failed to fetch
// }






// // .then(allPosts => {
// //   const resobj = allPosts.map(singlePost => getSinglePost(singlePost));
// //   res.status(200).json(resobj);
// //   console.log("after done =>", resobj);
// // //  console.log("getReadStatus", getReadStatus());
// // }).catch((err) => {
// //   console.log(err)
// // });

// // -----------------------------------






//   // const data = await getReadStatus().catch((error)=>{console.log("error : ", error)});

// // -----------------------------------------------------------

// // -----






//  };




// --------------try only attrubutes-------------------

// exports.getAllPosts = (req, res, next) => {
//   let loginUserId = req.userdata.userId;
//     Post.findAll({
//       order: [
//         ['updatedAt', 'DESC']
//       ],
//       include: [{
//           model: User,
//         },
//         {
//           model: Seen,
//           where: {
//             postId : Sequelize.col('post.id') }


//           // include: User,

//         },
//         {
//           model: Comment,

//           // include: User,
//         },
//       ],
//     }).then(allPosts => {
//       res.status(200).json(allPosts)
//       //  console.log("before map",allPosts);

//       console.log("after done =>",allPosts,null);
//     }).catch((err) => {
//       console.log(err)
//     })
//   };

//* seenPost
//console.log("is Seen post here  line 247", isSeen);

// switch (true) {
//   case isSeen:
//     return true;
//     break;
//   case singlePost.userId === loginUserId:
//     return true;
//     break;
//   case isSeen == null:
  
//     return false;
//     break;

//   default:
//     return false;
// }


 
//else if (isSeen ===null) {
//   console.log ("Null 293")
// } else {
//   console.log(" not equal " ,isSeen instanceof Seen )
// }
  // let isSeen = await Seen.findOne({
  //   where: {
  //     userId: loginUserId,
  //     postId: singlePost.id,
  //   }
  // });
  // if(isSeen=== null){
  //   console.log('Error : ')

   
  // }else {
  //   console.log("isSeen instanceof Seen 300",isSeen instanceof Seen); // true
  //   console.log("isSeen.postId 301",isSeen.postId);
  //    switch (isSeen) {
  //   case isSeen:
  //     return true;
  //     break;
  //   case singlePost.userId === loginUserId:
  //     return true;
  //     break;
  //   case isSeen == null:
  //     //console.log("is Seen Post not equal", isSeen.postId);
  //     return false;
  //     break;

  //   default:
  //     return false;
  // }
  // }


//   .then((result) => {
//     //console.log(`result of userId ${loginUserId} & postId ${singlePost.id}`, result);
  
//    isSeen = result;
//      console.log(`result of isSeen ${loginUserId} & postId ${singlePost.id}`,isSeen);
//      console.log("is Seen post inside block ", isSeen);

//   }).catch((error) => {
//     console.log("error ; ", error)
//   });

// // //* here need to do something  ----
// // result = isSeen ;
  

  // if(isSeen){
  //   console.log('is SEEn Post ',isSeen.postId);
  //   return true;
  // }
  // else if (singlePost.userId === loginUserId){
  //   return true;
  // } else {
  //   return false;
  // }