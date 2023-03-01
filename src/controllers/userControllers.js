const { userRoles } = require("../constants/users");
const {
  notFoundError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const [users, metadata] = await sequelize.query(
    "SELECT id, email FROM users"
  );
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userIdä;
  const [user, metadata] = await sequelize.query(
    "SELECT id, email FROM user WHERE id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new notFoundError("Den användaren finns inte.");

  return res.json(user);
};

exports.updateUser = async (req, res) => {
  console.log("hej");
};

exports.deleteUserById = async (req, res) => {
  //placera användarId:t i en variabel
  const userId = req.params.userId;

  //kolla om användaren är admin || om användaren försöker deleta sig själv
  if (userId != req.user.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError(
      "Du är inte authorized till att ta bort den här!!"
    );
  }

  //ta bort användaren från databasen
  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  if (!results || results[0]) {
    throw new NotFoundError("Den användaren finns då icke!");
  }

  return res.sendStatus(204);
};
