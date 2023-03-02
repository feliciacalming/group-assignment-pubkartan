const { query } = require("express");
const { QueryTypes } = require("sequelize");
const { NotFoundError } = require("../utils/errors");
const { sequelize } = require("../database/config");

exports.createNewReview = async (req, res) => {
  const {
    review,
    rating,
    created_at,
    user_id,
    pub_id,
  } = req.body;


  const [newReviewId] = await sequelize.query(
    `INSERT INTO review (review, rating, created_at, fk_user_id, fk_pub_id) VALUES ($review, $rating, $created_at, $fk_user_id, $fk_pub_id);`,
    {
      bind: {
        review: review,
        rating: rating,
        created_at: created_at,
        fk_user_id: user_id,
        fk_pub_id: pub_id,
      },
      type: QueryTypes.INSERT,
    }
  );
  await sequelize.query(``);
  return res
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/reviews/${newReviewId}`
    )
    .sendStatus(201);
};




exports.updateReview = async (req, res) => {
  console.log("updateReview");
};

exports.deleteReviewById = async (req, res) => {
  
  const reviewId = req.params.reviewid;

  //kolla om användaren är admin || om användaren försöker deleta sig själv
  // if (userId != req.user.userId && req.user.role !== userRoles.ADMIN) {
  //   throw new UnauthorizedError(
  //     "Du är inte authorized till att ta bort den här!!"
  //   );
  // }

  //ta bort användaren från databasen
  const [results, metadata] = await sequelize.query(
    "DELETE FROM review WHERE id = $reviewId RETURNING *",
    {
      bind: { reviewId },
    }
  );

  //console.log(results);

  if (!results || results[0]) {
    throw new NotFoundError("Den reviewn finns då icke!");
  }

  return res.sendStatus(204);
};
