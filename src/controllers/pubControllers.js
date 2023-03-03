const { QueryTypes } = require("sequelize");
const {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");

exports.getAllPubs = async (req, res) => {
  let city = req.query.city;
  let limit = req.query.limit || 10;

  if (!city) {
    let pubs = await sequelize.query(
      `SELECT pub.name, pub.address, pub.description, pub.opening_hours, pub.happy_hour, pub.beer_price, pub.webpage FROM pub LIMIT $limit;`,
      { bind: { limit } }
    );

    return res.json(pubs);
  } else {
    pubs = await sequelize.query(
      `SELECT pub.name, pub.address, pub.description, pub.opening_hours, pub.happy_hour, pub.beer_price, pub.webpage, city.city_name FROM pub LEFT JOIN city ON city.id = pub.fk_city_id WHERE city.city_name = $city LIMIT $limit;`,
      { bind: { city, limit } }
    );
  }

  return res.json(pubs);
};

exports.getPubById = async (req, res) => {
  const [pub, metadata] = await sequelize.query(
    `SELECT * FROM pub WHERE id = $pubId`,
    {
      bind: { pubId },
      type: QueryTypes.SELECT,
    }
  );

  if (!pub) throw new NotFoundError("Den puben finns inte!!!!");

  return res.status(200).json(pub);
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

  console.log(userId);

  const [newPubId] = await sequelize.query(
    `INSERT INTO pub (name, address, fk_city_id, description, opening_hours, happy_hour, beer_price, webpage, fk_user_id) VALUES ($name, $address, $fk_city_id, $description, $opening_hours, $happy_hour, $beer_price, $webpage, $fk_user_id);`,
    {
      bind: {
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
      type: QueryTypes.INSERT,
    }
  );

  return res
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/pubs/${newPubId}`
    )
    .sendStatus(201);
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
  const [users_pubs] = await sequelize.query(
    `
    SELECT * FROM pub WHERE id = $pubId;`,
    {
      bind: { pubId: pubId },
      type: QueryTypes.SELECT,
    }
  );

  if (!users_pubs) throw new NotFoundError("Den här puben finns inte!");

  if (req.user.role == userRoles.ADMIN || userId == users_pubs.fk_user_id) {
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
    throw new UnauthorizedError("Du kan inte ändra en pub du inte skapat");
  }
};

exports.deletePubById = async (req, res) => {
  const pubId = req.params.pubId;
  const userId = req.user.userId;

  console.log(pubId);
  console.log(userId);

  const [users_pubs] = await sequelize.query(
    `
    SELECT * FROM pub WHERE id = $pubId;`,
    {
      bind: { pubId: pubId },
      type: QueryTypes.SELECT,
    }
  );

  if (!users_pubs) throw new NotFoundError("Den här puben finns inte!");

  const pub_reviews = await sequelize.query(
    `SELECT * FROM review WHERE fk_pub_id = $pubId;`,
    {
      bind: { pubId: pubId },
      type: QueryTypes.SELECT,
    }
  );

  console.log(pub_reviews);

  if (req.user.role == userRoles.ADMIN || userId == users_pubs.fk_user_id) {
    if (pub_reviews.length > 0) {
      await sequelize.query("DELETE FROM review WHERE fk_pub_id = $pubId", {
        bind: { pubId: pubId },
        type: QueryTypes.DELETE,
      });
    }
    await sequelize.query("DELETE FROM pub WHERE id = $pubId RETURNING *", {
      bind: { pubId: pubId },
      type: QueryTypes.DELETE,
    });
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError("Du kan inte ta bort en pub du inte skapat");
  }
};
