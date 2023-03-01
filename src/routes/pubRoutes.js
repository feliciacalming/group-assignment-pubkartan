const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const {
  getAllPubs,
  getPubById,
  createNewPub,
  updatePub,
  deletePubById,
} = require("../controllers/pubControllers");

// GET All pubs /api/v1/pubs
router.get("/", getAllPubs);

// GET Pub by Id /api/v1/pubs/:pubid
router.get("/:pubId", getPubById);

// POST Create a new pub /api/v1/pubs/
router.post("/", isAuthenticated, createNewPub);

// PUT Update pub by Id /api/v1/pubs/:pubid
router.put("/:pubId", isAuthenticated, updatePub);

// DELETE pub by Id /api/v1/pubs/:pubid
router.delete("/:pubId", isAuthenticated, deletePubById);

module.exports = router;
