const { body } = require("express-validator");

exports.registerSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage(
      "You must provide a password that is at least 5 characters long"
    ),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password").not().isEmpty().withMessage("You must provide a password"),
];

exports.reviewSchema = [
  body("review")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 250 })
    .withMessage("Your review must be between 5 and 250 characters"),
];
