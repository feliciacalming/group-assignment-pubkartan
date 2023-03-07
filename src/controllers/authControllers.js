const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthenticatedError, UnauthorizedError } = require("../utils/errors");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [result, metadata] = await sequelize.query(
    "SELECT id FROM user LIMIT 1"
  );

  if (!result || result.length < 1) {
    await sequelize.query(
      "INSERT INTO user (username, email, password, role, created_at) VALUES ($username, $email, $password, $role, $created_at)",
      {
        bind: {
          username: username,
          email: email,
          password: hashedpassword,
          role: userRoles.ADMIN,
          created_at: new Date().toLocaleDateString(),
        },
      }
    );
  } else {
    await sequelize.query(
      "INSERT INTO user (username, email, password, created_at) VALUES ($username, $email, $password, $created_at)",
      {
        bind: {
          username: username,
          email: email,
          password: hashedpassword,
          created_at: new Date().toLocaleDateString(),
        },
      }
    );
  }

  return res.status(201).json({
    message: "🔥 Ditt konto är skapat, logga in och hitta dina bästa pubar! 🔥",
  });
};

exports.login = async (req, res) => {
  const { email, password: candidatePassword } = req.body;

  const [user, metadata] = await sequelize.query(
    `SELECT * FROM user WHERE email = $email LIMIT 1;`,
    {
      bind: { email },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new UnauthorizedError();

  const isPasswordCorrect = await bcrypt.compare(
    candidatePassword,
    user.password
  );

  if (!isPasswordCorrect)
    throw new UnauthenticatedError("⛔ Inloggning misslyckades ⛔");

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET);

  return res.json({
    token: jwtToken,
    user: jwtPayload,
    message: "🚀 Du är inloggad!",
  });
};
