const bcrypt = require("bcrypt");
const { userRoles } = require("../constants/users");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  if (req.user.role != userRoles.ADMIN) {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att hämta alla användare! ⛔"
    );
  }
  const [users, metadata] = await sequelize.query("SELECT * FROM user ");

  return res.status(200).json(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  const user = await sequelize.query(
    `SELECT review FROM review WHERE fk_user_id = (SELECT id FROM user WHERE id = $userId);`,
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  console.log(user);

  if (!user)
    throw new NotFoundError("☠️ Det finns ingen användare med det id:t ☠️");

  return res.json(user);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password, role, created_at } = req.body;

  if (userId != req.user.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att uppdatera detta konto ⛔"
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
  const userId = req.params.userId;

  if (userId != req.user.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att radera detta konto ⛔"
    );
  }

  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  if (!results || results[0]) {
    throw new NotFoundError("☠️ Den här användaren finns inte ☠️");
  }

  return res.sendStatus(204);
};
