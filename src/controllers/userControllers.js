const bcrypt = require("bcrypt");
const { userRoles } = require("../constants/users");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const [users, metadata] = await sequelize.query("SELECT id, email FROM user");
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  const [user, metadata] = await sequelize.query(
    `SELECT id, email FROM user WHERE id = $userId`,
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new NotFoundError("Den användaren finns inte.");

  return res.json(user);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password, role, created_at } = req.body;

  if (userId != req.user.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError(
      "Du får inte uppdatera för det är inte ditt konto å du är då inte admin heller!"
    );
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    await sequelize.query(
      `UPDATE user SET username=$username, email=$email, password=$password, role=$role, created_at=$created_at WHERE id = $userId RETURNING *;`,
      {
        bind: {
          userId: userId,
          username: username,
          email: email,
          password: hashedpassword,
          role: role,
          created_at: created_at,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updatedUser, metadata] = await sequelize.query(
      `SELECT * FROM user WHERE id = $userId;`,
      {
        bind: {
          userId,
        },
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json(updatedUser);
  }
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
