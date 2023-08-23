const { Sequelize, Op } = require("sequelize");
const models = require("../../src/models/index");
const {
  userSignUpValidation,
} = require("../services/validation/userValidation");
const {
  encryptData,
  decryptData,
} = require("../services/Helper");

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
        console.log(e);
        res.send(e);
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
            password: "User1234"
          })
            .then(() =>
              res.status(200).json({ message: "User register successfully." })
            )
            .catch((e) => res.json(e));
        }
      });
    } catch (error) {
      console.log(">>>Error :", error);
    }
  },
  getUser: (req, res) => {},
};
