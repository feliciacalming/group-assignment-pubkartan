const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("pubsDb", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "pubsDb.sqlite"),
});

module.exports = {
  sequelize,
};
