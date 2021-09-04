const db = require("../module/models");
const Comments = db.comments;
const Post = db.post;
const Validator = require("fastest-validator")

//!----------new commment-----------------------------//

exports.create_New_Comments = (req, res, next) => {

  const comment = {
    content: req.body.content,
    userId: req.userdata.userId,
    postId: req.body.postId,
  };
  console.log("req body", req.body);
  ///-----------------------------//
  //* Validation //
  const schema = {
    content: {
      type: "string",
      optional: false,
      max: "500"
    }
  };

  const v = new Validator();
  const validationResponce = v.validate(comment, schema);

  if (validationResponce !== true) {
    return res.status(400).json({
      message: "Validation Failed",
      error: validationResponce
    });
  }

  Comments.create(comment)
    .then((result) => {
      res.status(201).json({
        messag: " New Comment created",
        comment: result
      });
    })
    .catch((err) => {
      res.status(500).json({
        messag: "comment not created",
        err: err
      });
    });
};
//!---------------------------------------------//

//!----------GET all commment-----------------------------//
exports.get_All_Comments = (req, res, next) => {
  Comments.findAll()
    .then((result) => {
      res.status(200).json({
        result: result
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "something went wrong",
        error: err
      });
    });
};
//!---------------------------------------------//

//!----------------GET SIngle comment-----------------------------//

exports.get_single_comment = (req, res, next) => {
  const id = req.params.id;
  Comments.findByPk(id)
    .then((result) => {
      if (result) {
        res.status(200).json({
          result: result
        });
      } else {
        res.status(401).json({
          message: "No Post"
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "something went wrong",
        error: err
      });
    });
};

//!------------------------------------------------------//

//!----------------Destroy SIngle comment-----------------------------//

exports.delete_comments = (req, res, next) => {
  const id = req.params.id;
  const userId = req.userdata.userId;
  Comments.destroy({
      where: {
        id: id,
        userId: userId
      }
    })
    .then((result) => {
      res.status(200).json({
        message: "comment deleted",
      });
    })
    .catch((error) => {
      res.status(401).json({
        message: "something went wrong",
        error: error,
      });
    });
};

//!---------------------------------------------------//