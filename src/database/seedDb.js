const bcrypt = require("bcrypt");
const { sequelize } = require("./config");
const { users } = require("../data/users");
const { pubs } = require("../data/pubs");
const { reviews } = require("../data/reviews");
const { cities } = require("../data/cities");

const seedPubsDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS pub;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);

    /* ---------- User ---------- */

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

    /* ---------- City ---------- */

    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS city (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT NOT NULL
      );
      `);

    let cityInsertQuery = `INSERT INTO city (city_name) VALUES `;

    for (let i = 0; i < cities.length; i++) {
      let city_name = cities[i].city_name;

      let values = `("${city_name}")`;
      cityInsertQuery += values;
      if (i < cities.length - 1) cityInsertQuery += ", ";
    }

    cityInsertQuery += ";";

    await sequelize.query(cityInsertQuery);

    /* ---------- Pub ---------- */

    await sequelize.query(`
   CREATE TABLE IF NOT EXISTS pub (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     fk_city_id INTEGER,
     description TEXT,
     opening_hours TEXT,
     happy_hour TEXT,
     beer_price INTEGER,
     webpage TEXT,
     fk_user_id INTEGER,
     FOREIGN KEY(fk_city_id) REFERENCES city(id),
     FOREIGN KEY(fk_user_id) REFERENCES user(id)
   );
  `);

    let pubInsertQuery =
      "INSERT INTO pub (name, address, description, opening_hours, happy_hour, beer_price, webpage, fk_city_id, fk_user_id) VALUES ";

    for (let i = 0; i < pubs.length; i++) {
      let name = pubs[i].name;
      let address = pubs[i].address;
      let description = pubs[i].description;
      let opening_hours = pubs[i].opening_hours;
      let happy_hour = pubs[i].happy_hour;
      let beer_price = pubs[i].beer_price;
      let webpage = pubs[i].webpage;
      let fk_city_id = pubs[i].fk_city_id;
      let fk_user_id = pubs[i].fk_user_id;

      let values = `("${name}", "${address}", "${description}", "${opening_hours}", "${happy_hour}", "${beer_price}", "${webpage}", "${fk_city_id}", "${fk_user_id}")`;

      pubInsertQuery += values;
      if (i < pubs.length - 1) pubInsertQuery += ", ";
    }

    pubInsertQuery += ";";

    await sequelize.query(pubInsertQuery);

    /* ---------- Review ---------- */

    await sequelize.query(`
     CREATE TABLE IF NOT EXISTS review (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       review TEXT NOT NULL,
       rating INTEGER NOT NULL,
       created_at TEXT NOT NULL,
       fk_user_id INTEGER ,
       fk_pub_id INTEGER NOT NULL,

       FOREIGN KEY(fk_user_id) REFERENCES user(id),
       FOREIGN KEY(fk_pub_id) REFERENCES pub(id)
     );
    `);

    let reviewInsertQuery =
      "INSERT INTO review (review, rating, created_at, fk_user_id, fk_pub_id) VALUES ";

    for (let i = 0; i < reviews.length; i++) {
      let review = reviews[i].review;
      let rating = reviews[i].rating;
      let created_at = reviews[i].created_at;
      let fk_user_id = reviews[i].fk_user_id;
      let fk_pub_id = reviews[i].fk_pub_id;

      let values = `("${review}", ${rating}, "${created_at}", ${fk_user_id}, ${fk_pub_id})`;
      reviewInsertQuery += values;
      if (i < reviews.length - 1) reviewInsertQuery += ", ";
    }

    reviewInsertQuery += ";";

    await sequelize.query(reviewInsertQuery);

    console.log("🚀🚀🚀 Database successfully populated with data!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

seedPubsDb();
