const { sequelize } = require("./config");
const { users } = require("../data/users");
const { pubs } = require("../data/pubs");

const seedPubsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS pub;`);

    // Create user table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT "USER"
    );
   `);

    let userInsertQuery = "INSERT INTO user (email, password, role) VALUES ";

    let userInsertQueryVariables = [];

    users.forEach((user, index, array) => {
      let string = "(";
      for (let i = 1; i < 4; i++) {
        string += `$${userInsertQueryVariables.length + i}`;
        if (i < 3) string += ",";
      }
      userInsertQuery += string + ")";
      if (index < array.length - 1) userInsertQuery += ",";

      const variables = [user.email, user.password, user.role];
      userInsertQueryVariables = [...userInsertQueryVariables, ...variables];
    });

    userInsertQuery += ";";

    await sequelize.query(userInsertQuery, {
      bind: userInsertQueryVariables,
    });

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
          webpage TEXT,
          fk_user_id INTEGER NOT NULL,
          FOREIGN KEY(fk_user_id) REFERENCES user(id)
        );
       `);

    let pubInsertQuery =
      "INSERT INTO pub (name, address, city, description, opening_hours, webpage, fk_user_id) VALUES ";

    let pubInsertQueryVariables = [];

    pubs.forEach((pub, index, array) => {
      let string = "(";
      for (let i = 1; i < 8; i++) {
        string += `$${pubInsertQueryVariables.length + i}`;
        if (i < 7) string += ",";
      }
      pubInsertQuery += string + ")";
      if (index < array.length - 1) pubInsertQuery += ",";

      const variables = [
        pub.name,
        pub.address,
        pub.city,
        pub.description,
        pub.opening_hours,
        pub.webpage,
        pub.fk_user_id,
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
