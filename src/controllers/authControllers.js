const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { UnauthenticatedError } = require("../utils/errors");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  //det man skriver in som email och lösenord
  const { email, password } = req.body;

  //kryptera det önskade lösenordet
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  //kolla om databasen är tom eller inte
  const [result, metadata] = await sequelize.query(
    "SELECT id FROM user LIMIT 1"
  );

  //lägg till användare till databasen (gör till admin om det är första användaren)
  if (!result || result.length < 1) {
    await sequelize.query(
      "INSERT INTO user (email, password, role) VALUES ($email, $password, $role)",
      {
        bind: {
          email: email,
          password: hashedpassword,
          role: userRoles.ADMIN,
        },
      }
    );
  } else {
    await sequelize.query(
      "INSERT INTO user (email, password) VALUES ($email, $password)",
      {
        bind: {
          email: email,
          password: hashedpassword,
        },
      }
    );
  }

  return res
    .status(201)
    .json({ message: "du skapade ett konto! logga in nu för fan!" });
};

exports.login = async (req, res) => {
  //mail och lösen man skriver när man loggar in
  const { email, password: candidatePassword } = req.body;

  //kolla om det finns en användare med den mailen
  const [user, metadata] = await sequelize.query(
    `SELECT * FROM user WHERE email = $email LIMIT 1;`,
    {
      bind: { email },
      type: QueryTypes.SELECT,
    }
  );

  if (!user) throw new UnauthenticatedError("Den här användaren finns inte");

  //kolla om lösenordet är korrekt
  const isPasswordCorrect = await bcrypt.compare(
    candidatePassword,
    user.password
  );

  if (!isPasswordCorrect) throw new UnauthenticatedError("Fel lösenord!!!");
  /* ändra sen till nåt annat felmeddelande så det inte är tydligt om det är mail lr lösen som är fel */

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  //skapa jwt-token
  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET);

  //returnera token
  return res.json({
    token: jwtToken,
    user: jwtPayload,
    message: "Du är inloggad!",
  });
};
