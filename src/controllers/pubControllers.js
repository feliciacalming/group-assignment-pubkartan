const { QueryTypes } = require("sequelize");
const {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");

exports.getAllPubs = async (req, res) => {
  let city = req.query.city;
  let limit = req.query.limit || 15;
  let pubs;

  if (!city) {
    pubs = await sequelize.query(
      `SELECT pub.name, pub.address, city.city_name AS city, pub.description, pub.opening_hours, pub.happy_hour, pub.beer_price, pub.webpage FROM pub LEFT JOIN city ON city.id = pub.fk_city_id LIMIT $limit;`,
      { bind: { limit } }
    );
  } else {
    city = city.trim();
    city = city[0].toUpperCase() + city.substring(1).toLowerCase();

    pubs = await sequelize.query(
      `SELECT pub.name, pub.address, city.city_name AS city, pub.description, pub.opening_hours, pub.happy_hour, pub.beer_price, pub.webpage FROM pub LEFT JOIN city ON city.id = pub.fk_city_id WHERE city.city_name = $city LIMIT $limit;`,
      { bind: { city: city, limit } }
    );
  }

  return res.status(200).json(pubs);
};

exports.getPubById = async (req, res) => {
  const pubId = req.params.pubId;
  const pub = await sequelize.query(
    `SELECT pub.name, pub.address, city.city_name AS city, pub.description, pub.opening_hours, pub.happy_hour, pub.beer_price, pub.webpage, AVG(review.rating) AS rating FROM pub LEFT JOIN city ON city.id = pub.fk_city_id LEFT JOIN review ON pub.id = review.fk_pub_id WHERE pub.id = $pubId`,
    {
      bind: { pubId },
      type: QueryTypes.SELECT,
    }
  );

  const pubReviews = await sequelize.query(
    `SELECT review.id, review.review, review.rating, review.created_at, user.username AS username FROM review JOIN user ON pub.id = review.fk_pub_id JOIN pub ON user.id = review.fk_user_id WHERE pub.id = $pubId;`,
    {
      bind: { pubId },
      type: QueryTypes.SELECT,
    }
  );

  if (!pub) throw new NotFoundError("☠️ Det finns ingen pub med det id:t ☠️");

  const response = {
    pub: pub,
    reviews: pubReviews,
  };

  return res.status(200).json(response);
};

exports.createNewPub = async (req, res) => {
  const {
    name,
    address,
    city,
    description,
    opening_hours,
    happy_hour,
    beer_price,
    webpage,
  } = req.body;

  const userId = req.user.userId;

  let cityId;
  let city_name = city.trim();
  city_name = city_name[0].toUpperCase() + city_name.substring(1).toLowerCase();

  const [checkForExistingPub] = await sequelize.query(
    `SELECT name AS pub_name, address AS pub_address, city.city_name, city.id AS city_id 
    FROM city 
    LEFT JOIN pub ON pub.name = $name AND pub.fk_city_id = city.id AND address = $address 
    WHERE city.city_name = $city`,
    {
      bind: {
        name: name,
        city: city_name,
        address: address,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (!checkForExistingPub) {
    const [newCity] = await sequelize.query(
      `INSERT INTO city (city_name) VALUES ($city);`,
      { bind: { city: city_name }, type: QueryTypes.INSERT }
    );

    cityId = newCity;
  } else if (
    checkForExistingPub.pub_name &&
    checkForExistingPub.city_name &&
    checkForExistingPub.pub_address
  ) {
    throw new BadRequestError(
      "⛔Den här puben finns redan i den här staden på den här adressen!⛔"
    );
  } else {
    cityId = checkForExistingPub.city_id;
  }

  const [newPubId] = await sequelize.query(
    `INSERT INTO pub (name, address, fk_city_id, description, opening_hours, happy_hour, beer_price, webpage, fk_user_id) 
    VALUES ($name, $address, $fk_city_id, $description, $opening_hours, $happy_hour, $beer_price, $webpage, $fk_user_id);`,
    {
      bind: {
        name: name,
        address: address,
        fk_city_id: cityId,
        description: description,
        opening_hours: opening_hours,
        happy_hour: happy_hour,
        beer_price: beer_price,
        webpage: webpage,
        fk_user_id: userId,
      },
      type: QueryTypes.INSERT,
    }
  );

  return res
    .send("🔥 Wohoo du har skapat en ny pub 🔥")
    .sendStatus(201)
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/pubs/${newPubId}`
    );
};

exports.updatePub = async (req, res) => {
  const pubId = req.params.pubId;

  const {
    name,
    address,
    city,
    description,
    opening_hours,
    happy_hour,
    beer_price,
    webpage,
  } = req.body;

  const userId = req.user.userId;
  const [pub] = await sequelize.query(
    `
    SELECT * FROM pub WHERE id = $pubId;`,
    {
      bind: { pubId: pubId },
      type: QueryTypes.SELECT,
    }
  );

  if (!pub) throw new NotFoundError("☠️ Det finns ingen pub med det id:t ☠️");

  if (req.user.role == userRoles.ADMIN || userId == pub.fk_user_id) {
    const [updatedPub, metadata] = await sequelize.query(
      `UPDATE pub SET name=$name, address=$address, fk_city_id=$fk_city_id, description=$description, opening_hours=$opening_hours, happy_hour=$happy_hour, beer_price=$beer_price, webpage=$webpage, fk_user_id=$fk_user_id WHERE id = $pubId RETURNING *;`,
      {
        bind: {
          pubId: pubId,
          name: name,
          address: address,
          fk_city_id: city,
          description: description,
          opening_hours: opening_hours,
          happy_hour: happy_hour,
          beer_price: beer_price,
          webpage: webpage,
          fk_user_id: userId,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return res.status(200).json(updatedPub);
  } else {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att uppdatera denna pub! ⛔"
    );
  }
};

exports.deletePubById = async (req, res) => {
  const pubId = req.params.pubId;
  const userId = req.user.userId;

  const pub = await sequelize.query(
    `
    SELECT * FROM pub WHERE id = $pubId;`,
    {
      bind: { pubId: pubId },
      type: QueryTypes.SELECT,
    }
  );

  console.log(pub);

  if (pub.length <= 0) {
    throw new NotFoundError("☠️ Det finns ingen pub med det id:t ☠️");
  }

  let pubOwner = await sequelize.query(
    `
    SELECT fk_user_id FROM pub WHERE id = $pubId;`,
    {
      bind: { pubId: pubId },
      type: QueryTypes.SELECT,
    }
  );

  for (let i = 0; i < pubOwner.length; i++) {
    pubOwner = pubOwner[i].fk_user_id;
  }
  console.log(userId);
  console.log(pubOwner);

  if (userId == pubOwner || req.user.role == userRoles.ADMIN) {
    await sequelize.query("DELETE FROM review WHERE fk_pub_id = $pubId", {
      bind: { pubId: pubId },
      type: QueryTypes.DELETE,
    });

    await sequelize.query("DELETE FROM pub WHERE id = $pubId", {
      bind: { pubId: pubId },
      type: QueryTypes.DELETE,
    });
  } else {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att ta bort denna pub! ⛔"
    );
  }
  return res.sendStatus(204);
};
