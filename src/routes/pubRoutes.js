const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const { validate } = require("../middleware/validation/validationMiddleware");
const {
  getAllPubs,
  getPubById,
  createNewPub,
  updatePub,
  deletePubById,
} = require("../controllers/pubControllers");
const { pubSchema } = require("../middleware/validation/validationSchemas");

router.get("/", getAllPubs);
router.get("/:pubId", getPubById);
router.post("/", validate(pubSchema), isAuthenticated, createNewPub);
router.put("/:pubId", validate(pubSchema), isAuthenticated, updatePub);
router.delete("/:pubId", isAuthenticated, deletePubById);

module.exports = router;
