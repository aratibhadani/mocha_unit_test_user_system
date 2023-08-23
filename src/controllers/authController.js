const { encryptData, decryptData, issueToken } = require("../services/Helper");
const { Sequelize, Op } = require("sequelize");
const models = require("../../src/models/index");
module.exports = {
  login: async (req, res) => {
    const encryptedData = encryptData(req.body); // after Front end encrpted request body No need of this Function
    const decryptedData = decryptData(encryptedData);
    const reqParam = decryptedData;
    const userData = await models.User.findOne({
      where: Sequelize.where(
        Sequelize.literal(`CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))`),
        { [Op.like]: reqParam.email }
      ),
      attributes: [
        "id",
        "password",
        [
          Sequelize.literal(
            `CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))`
          ),
          "email",
        ],
      ],
    });
    if (!userData) {
      return res.status(404).json({ message: "User Not Exists." });
    }
    if (reqParam.password !== userData.password) {
      return res.status(401).json({ message: "Password not match" });
    }

    const token = issueToken({ id: userData.id, email: userData.email });
    return res.status(200).json({
      token,
      message: "Login Success.",
    });
  },

  authCheck: (req, res) => {
    return res.status(200).json({ message: `Get ${req.authUserId} id data.` });
  },
};
