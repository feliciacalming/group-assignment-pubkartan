const { QueryTypes } = require("sequelize");
const { NotFoundError } = require("../utils/errors");
const { sequelize } = require("../database/config");

exports.getAllPubs = async (req, res) => {
  const [pubs, metadata] = await sequelize.query(`SELECT * FROM pub`);
  return res.json(pubs);
};

exports.getPubById = async (req, res) => {
  const pubId = req.params.pubId;

  const [pub, metadata] = await sequelize.query(
    `SELECT * FROM pub WHERE id = $pubId`,
    { bind: { pubId }, type: QueryTypes.SELECT }
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

  const [newPubId] = await sequelize.query(
    `INSERT INTO pub (name, address, city, description, opening_hours, happy_hour, beer_price, webpage) VALUES ($name, $address, $city, $description, $opening_hours, $happy_hour, $beer_price, $webpage);`,
    {
      bind: {
        name: name,
        address: address,
        city: city,
        description: description,
        opening_hours: opening_hours,
        happy_hour: happy_hour,
        beer_price: beer_price,
        webpage: webpage,
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

  const [updatedPub, metadata] = await sequelize.query(
    `UPDATE pub SET name=$name, address=$address, city=$city, description=$description, opening_hours=$opening_hours, happy_hour=$happy_hour, beer_price=$beer_price, webpage=$webpage WHERE id = $pubId RETURNING *;`,
    {
      bind: {
        pubId: pubId,
        name: name,
        address: address,
        city: city,
        description: description,
        opening_hours: opening_hours,
        happy_hour: happy_hour,
        beer_price: beer_price,
        webpage: webpage,
      },
      type: QueryTypes.UPDATE,
    }
  );

  if (!updatedPub)
    throw new NotFoundError("Du försöker uppdatera en pub som inte finns??");

  return res.status(200).json(updatedPub);
};

exports.deletePubById = async (req, res) => {
  console.log("hej");
};
