const { Sequelize, Op } = require("sequelize");
const models = require("../../src/models/index");
const {
  userSignUpValidation,
} = require("../services/validation/userValidation");
const { encryptData, decryptData } = require("../services/Helper");

module.exports = {
  userList: async (req, res) => {
    const encryptedData = encryptData(req.body); // after Front end encrpted request body No need of this Function
    const decryptedData = decryptData(encryptedData);
    const reqParam = decryptedData;
    reqParam.search = reqParam.search
      ? decodeURIComponent(reqParam.search)
      : "";
    let condition;
    if (reqParam.search) {
      condition = {
        ...condition,
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${reqParam.search.trim()}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${reqParam.search.trim()}%`,
            },
          },
          Sequelize.where(
            Sequelize.literal(
              `CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))`
            ),
            { [Op.like]: `%${reqParam.search.trim()}%` }
          ),
        ],
      };
    }
    await models.User.findAll({
      where: condition,
      attributes: [
        "id",
        "firstName",
        "lastName",
        [
          Sequelize.literal(
            `CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))`
          ),
          "email",
        ],
      ],
    })
      .then((userData) => res.json({ data: userData }))
      .catch((e) => {
        return res.status(500).send(response);
      });
  },
  addUser: (req, res) => {
    const encryptedData = encryptData(req.body); // after Front end encrpted request body No need of this Function
    const decryptedData = decryptData(encryptedData);
    try {
      userSignUpValidation(decryptedData, res, async (validate) => {
        if (validate) {
          const { firstName, lastName, email } = decryptedData;
          // Search email
          const userData = await models.User.findOne({
            where: Sequelize.where(
              Sequelize.literal(
                `CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))`
              ),
              { [Op.like]: email }
            ),
            attributes: ["id"],
          });
          if (userData) {
            return res.status(400).json({
              message: "User already exists.",
            });
          }
          await models.User.create({
            firstName,
            lastName,
            email: Sequelize.fn("AES_ENCRYPT", email, "setEmail"),
            password: "User1234",
          })
            .then(() =>
              res.status(200).json({ message: "User register successfully." })
            )
            .catch((e) => res.status(500).send(response));
        }
      });
    } catch (error) {
      return res.status(500).send(response);
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.params.id;
      const userData = await models.User.findOne({
        where: { id },
        attributes: ["id", "firstName", "lastName"],
      });
      if (!userData) {
        return res.status(404).json({
          message: "User not exists.",
        });
      }
      res
        .status(200)
        .json({ data: userData, message: "User register successfully." });
    } catch (error) {
      return res.status(500).send(response);
    }
  },
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(">>>>>",id);
      const reqParam = req.body;
      const userData = await models.User.findOne({
        where: { id },
        attributes: ["id", "firstName", "lastName"],
      });
      if (!userData) {
        return res.status(404).json({
          message: "User not exists.",
        });
      }
      userData.firstName = reqParam.firstName && reqParam.firstName;
      userData.lastName = reqParam.lastName && reqParam.lastName;
      userData.save();
      res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
      return res.status(500).send(response);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const userData = await models.User.findOne({
        where: { id },
        attributes: ["id"],
      });
      if (!userData) {
        return res.status(404).json({
          message: "User not exists.",
        });
      }
      // await models.User.destroy({
      //   where: { id },
      // });
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      return res.status(500).send(response);
    }
  },
};
