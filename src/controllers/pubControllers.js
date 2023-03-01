const { QueryTypes } = require("sequelize");
const { sequelize } = require("../database/config");

exports.getAllPubs = async (req, res) => {
  const [pubs, metadata] = await sequelize.query(`SELECT * FROM pub`);
  return res.json(pubs);
};

exports.getPubById = async (req, res) => {
  console.log("hej");
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
  console.log("hej");
};

exports.deletePubById = async (req, res) => {
  console.log("hej");
};
