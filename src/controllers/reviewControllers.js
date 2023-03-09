const { QueryTypes } = require("sequelize");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");

exports.createNewReview = async (req, res) => {
  const { review, rating } = req.body;

  const pubId = req.params.pubId;
  const userId = req.user.userId;

  const [newReviewId] = await sequelize.query(
    `INSERT INTO review (review, rating, created_at, fk_user_id, fk_pub_id) VALUES ($review, $rating, $created_at, $fk_user_id, $fk_pub_id);`,
    {
      bind: {
        review: review,
        rating: rating,
        created_at: new Date().toLocaleDateString(),
        fk_user_id: userId,
        fk_pub_id: pubId,
      },
      type: QueryTypes.INSERT,
    }
  );
  return res
    .send("🔥 Du har skapat en ny recension 🔥")
    .sendStatus(201)
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/reviews/${newReviewId}`
    );
};

exports.deleteReviewById = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.userId;

  const [result_reviews] = await sequelize.query(
    `
    SELECT * FROM review WHERE id = $reviewId;`,
    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!result_reviews)
    throw new NotFoundError("⛔ Den här reviewn finns inte! ⛔");

  if (req.user.role == userRoles.ADMIN || userId == result_reviews.fk_user_id) {
    await sequelize.query(
      "DELETE FROM review WHERE id = $reviewId RETURNING *",
      {
        bind: { reviewId: reviewId },
        type: QueryTypes.DELETE,
      }
    );

    return res.sendStatus(204).json({
      message: "😱 Du har FÖR ALLTID tagit bort recensionen 😱",
    });
  } else {
    throw new UnauthorizedError(
      "⛔ Du har inte befogenhet att ta bort denna recensionen! ⛔"
    );
  }
};
