const Constant = require("../services/Constant");
const { decode, verify } = require("../services/Helper");
const models = require("../models/index");
const Response = require("../services/Response");

module.exports = {
  userAuthToken: async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
     return res.status(Constant.RESPONSE_CODE.UNAUTHORIZED).json({message:"Authorization Error"})
    } else {
      const tokenData = await decode(token);
      if (tokenData) {
        verify(tokenData, (err, decoded) => {
          if (err) {
            return res.status(Constant.RESPONSE_CODE.UNAUTHORIZED).json({message:"Invalid Token"})
          }
          if (decoded.id) {
            req.authUserId = decoded.id;
            models.User
              .findOne({
                where: {
                  id: req.authUserId,
                },
                attributes: ["id"],
              })
              .then((result) => {
                if (!result) {
                    return res.status(404).json({message:"Email Not Exists"})
                }
                req.authUserId = result.id;
                return next();
              })
              .catch(() => {
                return res.status(500).json({message:"Internal server error"})
              });
          } else {
            return res.status(Constant.RESPONSE_CODE.UNAUTHORIZED).json({message:"Invalid Token"})
          }
        });
      }
    }

    return null;
  },
};
