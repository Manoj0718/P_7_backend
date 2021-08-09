const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../module/models");
const User = db.user;
const Comment = db.comments;
const PostAll = db.post;
const Validator = require ("fastest-validator");

//! -------------sign up function ------//

exports.signup = async (req, res, next) => {
  const user_password = bcrypt.hashSync(req.body.user_password, 8);
  const { first_name, last_name, user_email, user_hobbies, user_bio } =
    req.body;

  const alreadyExistsUser = await User.findOne({ where: { user_email } }).catch(
    (err) => {
      console.log("Error : ", err);
    }
  );
  if (alreadyExistsUser) {
    return res.status(402).json({ message: "Email already exists" });
  }
  const user = new User({
    first_name,
    last_name,
    user_email,
    user_password,
    user_hobbies,
    user_bio,
  });
  const savedUser = await user.save().catch((error) => {
    console.log("Error : ", error);
    res.status(500).json({ message: "Can not save user" });
  });
  if (savedUser) {
    res.status(200).json({ message: "Thank You , New User" });
  }
};
//! ---------- End Signup function ------//

//! ----------login function ------//

exports.login = (req, res, next) => {
  User.findOne({ where: { user_email: req.body.user_email } })
    .then((loginUser) => {
      if (loginUser === null) {
        res.status(404).json({
          message: "user not in the database",
        });
      }
      bcrypt
        .compare(req.body.user_password, loginUser.user_password)
        .then((valid) => {
          if (!valid) {
            res.status(402).json({
              message: "wrong password",
              error:new Error('wrong password'),
            });
          }
          const token = jwt.sign(
            { userId: loginUser.id },
            "RANDOM_SECREAT_TOKEN",
            {
              expiresIn: "24h",
            }
         
          );
         
          res.status(200).json({
            user: loginUser,
            token: token,
          });
        });

    })
    .catch((err) => {
      res.status(500).json({
        error: "new error",
        err,
      });
    });
};

//! ---------- End Of login function ------//

//! -------------Delete function ------//

exports.delete = async (req, res) => {
  const id = req.params.id;
   //Todo = Destroy User is enoug ?? post comments all removeing
  try{
const deleteUser = User.destroy({ where: { id: id}})
console.log(deleteUser);
res.status(200).json({
  deleteMessage:deleteUser,
  message: "User deleted",
});
  }
  catch(error){
    res.status(500).json({
      error: error.message
    })
  }
};

//! ----------End of Delete function ------//

//! -------------Get All Users function ------//
exports.getAllUsers = async (req, res,next) => {
try{
  //* here i return the result updated order.
  //*DESC useing, cause i need to display data order of new
  const allUsers = await User.findAll({order:[['updatedAt','DESC']]});
res.status(200).json({ message: allUsers})
}
catch(error){
res.status(500).json({ ErrorMessage :error})
}

}
//! ----------End function ------//


//! -------------get single user function ------//

exports.singleUser = (req,res,next)=>{
  const id = req.params.id;
  console.log(id);
  User.findByPk(id).then((result)=>{
    if(result){
      res.status(200).json(result);
      console.log(result);
    }else{
      res.status(500).json({ message: "user can not find"})
    }
  }).catch((err)=>{
    res.status(404).json({
      error : err,
      message:"something went wrong"
    });
  });
}
//! ----------End function ------//

//! -------------update single user function ------//
exports.updateSingleUser = (req,res,next)=>{
  const id = req.params.id;
  let updateUser = {
    first_name:req.body.first_name,
    last_name:req.body.last_name,
    user_password:req.body.user_password,
    user_hobbies:req.body.user_hobbies,
    user_bio:req.body.user_bio
  }
  User.update(updateUser,{ where: { id: id}}).then((result)=>{
    res.status(200).json(
      { message : "user Updated",
    user:updateUser});
  }).catch((error)=>res.status(504).json({ message: "somethuing went wrong", error:error}))
}



//! ----------End function ------//
