const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authControllers");
const {
  loginSchema,
  registerSchema,
} = require("../middleware/validation/validationSchemas");
const { validate } = require("../middleware/validation/validationMiddleware");

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
