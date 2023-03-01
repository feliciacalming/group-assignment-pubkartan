const bcrypt = require("bcrypt");
const { sequelize } = require("./config");
const { users } = require("../data/users");
const { pubs } = require("../data/pubs");
const { reviews } = require("../data/reviews");
const { cities } = require("../data/cities");

const seedPubsDb = async () => {
  try {
    // Drop tables if exist
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS pub;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);

    // Create user table
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL, 
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT "USER",
      created_at TEXT NOT NULL
      );
      `);

    let userInsertQuery = `INSERT INTO user (username, email, password, role, created_at) VALUES `;

    let userInsertQueryVariables = [];

    for (let i = 0; i < users.length; i++) {
      let username = users[i].username;
      let email = users[i].email;
      let password = users[i].password;
      let role = users[i].role;
      let created_at = users[i].created_at;

      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      let values = `("${username}", "${email}", "${hashedpassword}", "${role}", "${created_at}")`;
      userInsertQuery += values;
      if (i < users.length - 1) userInsertQuery += ", ";
    }

    userInsertQuery += ";";

    await sequelize.query(userInsertQuery);

    //city

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS city (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT NOT NULL
    );
   `);

    let cityInsertQuery = "INSERT INTO city (city_name) VALUES ";

    let cityInsertQueryVariables = [];

    console.log(cities);
    cities.forEach((city, index, array) => {
      let string = "(";
      for (let i = 1; i < 2; i++) {
        string += `$${cityInsertQueryVariables.length + i}`;
        if (i < 1) string += ",";
      }
      cityInsertQuery += string + ")";
      if (index < array.length - 1) cityInsertQuery += ",";

      const variables = [city.city_name];
      cityInsertQueryVariables = [...cityInsertQueryVariables, ...variables];
      console.log(cityInsertQueryVariables);
    });

    cityInsertQuery += ";";

    await sequelize.query(cityInsertQuery, {
      bind: cityInsertQueryVariables,
    });

    //city

    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS city (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_name TEXT NOT NULL
      );
      `);

    let cityInsertQuery = "INSERT INTO city (city_name) VALUES ";

    let cityInsertQueryVariables = [];

    console.log(cities);
    cities.forEach((city, index, array) => {
      let string = "(";
      for (let i = 1; i < 2; i++) {
        string += `$${cityInsertQueryVariables.length + i}`;
        if (i < 1) string += ",";
      }
      cityInsertQuery += string + ")";
      if (index < array.length - 1) cityInsertQuery += ",";

      const variables = [city.city_name];
      cityInsertQueryVariables = [...cityInsertQueryVariables, ...variables];
      console.log(cityInsertQueryVariables);
    });

    cityInsertQuery += ";";

    await sequelize.query(cityInsertQuery, {
      bind: cityInsertQueryVariables,
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
          happy_hour TEXT,
          beer_price TEXT,
          webpage TEXT,
          fk_user_id INTEGER,

          FOREIGN KEY(fk_city_id) REFERENCES city(id),
          FOREIGN KEY(fk_user_id) REFERENCES user(id),
          fk_city_id INTEGER NOT NULL,
          fk_user_id INTEGER NOT NULL,

          FOREIGN KEY(fk_city_id) REFERENCES city(id),
          FOREIGN KEY(fk_user_id) REFERENCES user(id)
        );
       `);

    let pubInsertQuery =
      "INSERT INTO pub (name, address, description, opening_hours, happy_hour, beer_price, webpage, fk_city_id, fk_user_id) VALUES ";

    let pubInsertQueryVariables = [];

    pubs.forEach((pub, index, array) => {
      let string = "(";
      for (let i = 1; i < 10; i++) {
        string += `$${pubInsertQueryVariables.length + i}`;
        if (i < 9) string += ",";
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
        pub.fk_city_id,
        pub.fk_user_id,
      ];
      pubInsertQueryVariables = [...pubInsertQueryVariables, ...variables];
    });

    pubInsertQuery += ";";

    await sequelize.query(pubInsertQuery, {
      bind: pubInsertQueryVariables,
    });

    /************ Reviews ***********/

    // Create review table
    await sequelize.query(`
     CREATE TABLE IF NOT EXISTS review (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       review TEXT NOT NULL,
       rating INTEGER NOT NULL,
       created_at TEXT NOT NULL,
       fk_user_id INTEGER NOT NULL,
       fk_pub_id INTEGER NOT NULL,
       
       FOREIGN KEY(fk_user_id) REFERENCES user(id),
       FOREIGN KEY(fk_pub_id) REFERENCES pub(id)
     );
    `);

    let reviewInsertQuery =
      "INSERT INTO review (review, rating, created_at, fk_user_id, fk_pub_id) VALUES ";

    let reviewInsertQueryVariables = [];

    reviews.forEach((review, index, array) => {
      let string = "(";
      for (let i = 1; i < 6; i++) {
        string += `$${reviewInsertQueryVariables.length + i}`;
        if (i < 5) string += ",";
      }
      reviewInsertQuery += string + ")";
      if (index < array.length - 1) reviewInsertQuery += ",";

      const variables = [
        review.review,
        review.rating,
        review.created_at,
        review.fk_user_id,
        review.fk_pub_id,
      ];
      reviewInsertQueryVariables = [
        ...reviewInsertQueryVariables,
        ...variables,
      ];
    });

    reviewInsertQuery += ";";

    await sequelize.query(reviewInsertQuery, {
      bind: reviewInsertQueryVariables,
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
