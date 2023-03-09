const { body } = require("express-validator");

exports.registerSchema = [
  body("email")
    .isEmail()
    .withMessage("✉️ Du måste ange en korrekt e-mailadress ✉️"),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 5 })
    .withMessage("🔐 Du måste ange ett lösenord som är minst 5 tecken 🔐"),
];

exports.loginSchema = [
  body("email")
    .isEmail()
    .withMessage("✉️ Du måste ange en korrekt e-mailadress ✉️"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("🔐 Du måste ange ett lösenord 🔐"),
];

exports.reviewSchema = [
  body("rating")
    .not()
    .isEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage("⛔ Ditt betyg måste vara mellan 1-5 ⛔"),
];

exports.pubSchema = [
  body("name")
    .not()
    .isEmpty()
    .isLength({ min: 1, max: 25 })
    .withMessage("💃🏻 Du måste ange ett namn på puben! 💃🏻"),
  body("address")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 25 })
    .withMessage("📬Du måste ange en adress!📬"),
  body("description")
    .isLength({ max: 150 })
    .withMessage("✍🏻 Din beskrivning får vara max 150 tecken!"),
];
