{userList: async (req, res) => {
    const reqParam = req.query;
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
          // For search email character wise
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
            `CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))` //Get original email address
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
    try {
      userSignUpValidation(req.body, res, async (validate) => {
        const { firstName, lastName, email } = req.body;
        // Search email is exists or not
        const userData = await models.User.findOne({
          where: Sequelize.where(
            Sequelize.literal(
              `CAST(AES_DECRYPT(email, 'setEmail') AS CHAR(100))` //Searching specific email ID 
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
          email: Sequelize.fn("AES_ENCRYPT", email, "setEmail"), // encrypt email and store into DB
        })
          .then(() =>
            res.status(200).json({ message: "User register successfully." })
          )
          .catch((e) => res.json(e));
      });
    } catch (error) {
      console.log(">>>Error :", error);
    }
  },
}