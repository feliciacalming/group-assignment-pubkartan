const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const {
  createNewReview,
  // getReviewById,
  updateReview, // Vi hade ej med denna men det står att en anvöändare ska kunna uppdatera sina egna reviews
  deleteReviewById,
  // getReviewsByPubId,   // Minns att vi pratade om denna men kommer inte ihåg varför vi inte ville ha denna med
} = require("../controllers/reviewControllers");

// POST Create a new review /api/v1/reviews/
router.post("/", isAuthenticated, createNewReview);

// GET Review by Id /api/v1/reviews/:reviewid
// router.get("/:reviewid", getReviewById);

// PUT Update Review  /api/v1/reviews/:reviewid
// BEHÖVER VI DENNA STÅR ATT EN ANVÄNDARE SKA KUNNA UPPDATERA SIN REVIEW
router.put("/:reviewid", isAuthenticated, updateReview);

// DELETE review by Id /api/v1/reviews/:reviewid
router.delete("/:reviewid", isAuthenticated, deleteReviewById);

// GET reviews by PUB ID /api/v1/reviews/:pubid
// BEHÖVER VI DENNA? VI PRATADE OM DET MEN MINNS EJ VAD VI SA
// router.get("/:pubid", isAuthenticated, getReviewsByPubId);

module.exports = router;
