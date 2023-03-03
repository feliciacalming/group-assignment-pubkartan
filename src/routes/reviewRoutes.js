const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const {
  createNewReview,
  deleteReviewById,
} = require("../controllers/reviewControllers");
const { validate } = require("../middleware/validation/validationMiddleware");
const { reviewSchema } = require("../middleware/validation/validationSchemas");

router.post(
  "/:pubId",
  validate(reviewSchema),
  isAuthenticated,
  createNewReview
);

router.delete("/:reviewId", isAuthenticated, deleteReviewById);

module.exports = router;
