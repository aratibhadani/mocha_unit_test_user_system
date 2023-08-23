"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }
  User.init(
    {
      firstName: DataTypes.STRING(20),
      lastName: DataTypes.STRING(20),
      email: `VARBINARY(300)`,
      password: DataTypes.STRING(200),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
