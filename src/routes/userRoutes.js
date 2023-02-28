const express = require("express");
const router = express.Router();
const { userRoles } = require("../constants/users");
const { deleteUserById } = require("../controllers/userControllers");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");

router.delete("/:userId", isAuthenticated, deleteUserById);

module.exports = router;
