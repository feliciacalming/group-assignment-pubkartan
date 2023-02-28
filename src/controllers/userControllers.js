const { userRoles } = require("../constants/users");
const {
  notFoundError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

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
