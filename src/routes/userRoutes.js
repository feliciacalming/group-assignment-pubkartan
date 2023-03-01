const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUserById,
} = require("../controllers/userControllers");

// GET All users /api/v1/users
router.get("/", isAuthenticated, getAllUsers);

// GET User by Id /api/v1/users/:userid
router.get("/:userId", isAuthenticated, getUserById);

// PUT Update user by Id /api/v1/users/:userid
// VI HADE INTE MED DENNA MEN BEHÖVER VI INTE KUNN AUPPDATERA EN USER MED ÄNDRINGAR
router.put("/:userId", isAuthenticated, updateUser);

// DELETE user by Id /api/v1/users/:userid
router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
