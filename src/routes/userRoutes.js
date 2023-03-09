const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
} = require("../controllers/userControllers");

router.get("/", isAuthenticated, getAllUsers);

router.get("/:userId", getUserById);

router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
