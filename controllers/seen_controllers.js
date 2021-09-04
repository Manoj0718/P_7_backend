const db = require("../module/models");
const seenPost = db.status;

exports.reactPost = async (req, res, next) => {
    try {
        const singleShow = {
            userId: req.userdata.userId,
            postId: req.body.postId,
        };

        //* check user alredy seen that post 

        const alredyExists = await seenPost.findOne({
            where: {
                userId: req.userdata.userId,
                postId: req.body.postId
            }
        }).catch(err => {
            console.error(err)
        });
        if (alredyExists) {
            return res.status(402).json({
                message: "User Alredy Marked This Post As Read Post"
            });
        };
        const newStatus = await seenPost.create(singleShow);
        res.status(200).json({
            message: "user marked this post ass seen",
            response: newStatus
        });

    } catch (err) {
        console.log("before error", singleShow);
        return res.status(500).
        json({
            error: err,
            message: "something went wrong backend"
        });
    }

};


exports.getreactions = async (req, res) => {
    try {
        const allseen = await seenPost.findall(
            res.status(200).json({
                message: "user reacted to these posts",
                response: allseen
            })
        );
    } catch (error) {
        res.status(401).json({
            error: error
        });
    }
}