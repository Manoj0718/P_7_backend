const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_SECREAT_TOKEN");

    const userId = decodedToken.userId;

    if (req.body.userId && res.body.userId !== userId) {
      throw "Invalid userId";
    } else {
      //todo - need to use this req.userdata to create post,user id.--//
      req.userdata = decodedToken;
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid Request authentication!"),
    });
  }
};
