const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const {
  createNewReview,
  deleteReviewById,
} = require("../controllers/reviewControllers");

// POST Create a new review /api/v1/reviews/
router.post("/", isAuthenticated, createNewReview);

// DELETE review by Id /api/v1/reviews/:reviewid
router.delete("/:reviewId", isAuthenticated, deleteReviewById);

module.exports = router;
