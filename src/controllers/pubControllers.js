const { QueryTypes } = require("sequelize");
const { NotFoundError } = require("../utils/errors");
const { sequelize } = require("../database/config");

exports.getAllPubs = async (req, res) => {
  let query;
  let options = {};
  query = `SELECT * FROM pubs`;
};

exports.getPubById = async (req, res) => {
  const pubId = req.params.pubId;

  const [pub, metadata] = await sequelize.query(
    `SELECT * FROM pub WHERE id = $pubId`,
    { bind: { pubId }, type: QueryTypes.SELECT }
  );

  if (!pub) throw new NotFoundError("Den puben finns inte!!!!");

  return res.json(pub);
};

exports.createNewPub = async (req, res) => {
  console.log("hej");
};

exports.updatePub = async (req, res) => {
  console.log("hej");
};

exports.deletePubById = async (req, res) => {
  console.log("hej");
};
