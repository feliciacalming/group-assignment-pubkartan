const { query } = require("express");
const { QueryTypes } = require("sequelize");
const {
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");

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




//exports.updateReview = async (req, res) => {
//  console.log("updateReview");
// };


exports.deleteReviewById = async (req, res) => {
  const reviewId = req.params.reviewid;
  const userId = req.user.userId;

  //console.log(reviewId);
  //console.log(userId);

  const [result_reviews] = await sequelize.query(
    `
    SELECT * FROM review WHERE id = $reviewId;`,
    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!result_reviews) throw new NotFoundError("Den här reviewn finns inte!");


  if (req.user.role == userRoles.ADMIN || userId == result_reviews.fk_user_id) {

    await sequelize.query("DELETE FROM review WHERE id = $reviewId RETURNING *", {
      bind: { reviewId: reviewId },
      type: QueryTypes.DELETE,

    });
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError("Du kan inte ta bort en review du inte skapat");
  }
};
