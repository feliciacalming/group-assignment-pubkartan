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
  const [users] = await sequelize.query(
    "SELECT * FROM user ORDER BY created_at DESC;"
  );

  const response = {
    users: users,
    total: users.length,
  };

  console.log(response);
  return res.status(200).json(response);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  const user = await sequelize.query(
    `SELECT username, email FROM user WHERE user.id = $userId;`,
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );
  const userReviews = await sequelize.query(
    `SELECT review.id, review.review, review.rating, review.created_at, pub.name AS pub_name FROM review JOIN pub ON pub.id = review.fk_pub_id JOIN user ON user.id = review.fk_user_id WHERE user.id = $userId;`,
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  if (user.length == 0)
    throw new NotFoundError("☠️ Det finns ingen användare med det id:t ☠️");

  const response = {
    user,
    reviews: userReviews,
  };

  return res.json(response);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { username, email, password } = req.body;

  if (userId != req.user.userId && req.user.role !== userRoles.ADMIN) {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att uppdatera detta konto ⛔"
    );
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    await sequelize.query(
      `UPDATE user SET username=$username, email=$email, password=$password WHERE id = $userId RETURNING *;`,
      {
        bind: {
          userId: userId,
          username: username,
          email: email,
          password: hashedpassword,
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
