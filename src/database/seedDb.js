const bcrypt = require("bcrypt");
const { sequelize } = require("./config");
const { users } = require("../data/users");
const { pubs } = require("../data/pubs");

const seedPubsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS pub;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);

    // Create user table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT "USER"
    );
   `);

    let userInsertQuery = `INSERT INTO user (email, password, role) VALUES `;

    let userInsertQueryVariables = [];

    for (let i = 0; i < users.length; i++) {
      let email = users[i].email;
      let password = users[i].password;
      let role = users[i].role;

      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      let values = `("${email}", "${hashedpassword}", "${role}")`;
      userInsertQuery += values;
      if (i < users.length - 1) userInsertQuery += ", ";
    }

    userInsertQuery += ";";

    await sequelize.query(userInsertQuery);

    /************ Pubs ***********/

    // Create pubs table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS pub (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          description TEXT,
          opening_hours TEXT,
          happy_hour TEXT,
          beer_price TEXT,
          webpage TEXT
        );
       `);

    let pubInsertQuery =
      "INSERT INTO pub (name, address, city, description, opening_hours, happy_hour, beer_price, webpage) VALUES ";

    let pubInsertQueryVariables = [];

    pubs.forEach((pub, index, array) => {
      let string = "(";
      for (let i = 1; i < 9; i++) {
        string += `$${pubInsertQueryVariables.length + i}`;
        if (i < 8) string += ",";
      }
      pubInsertQuery += string + ")";
      if (index < array.length - 1) pubInsertQuery += ",";

      const variables = [
        pub.name,
        pub.address,
        pub.city,
        pub.description,
        pub.opening_hours,
        pub.happy_hour,
        pub.beer_price,
        pub.webpage,
      ];
      pubInsertQueryVariables = [...pubInsertQueryVariables, ...variables];
    });

    pubInsertQuery += ";";

    await sequelize.query(pubInsertQuery, {
      bind: pubInsertQueryVariables,
    });

    console.log("Database successfully populated with data...");
  } catch (error) {
    // Log eny eventual errors to Terminal
    console.error(error);
  } finally {
    // End Node process
    process.exit(0);
  }
};

seedPubsDb();
