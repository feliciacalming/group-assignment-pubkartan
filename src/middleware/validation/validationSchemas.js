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
<<<<<<< HEAD
	body('email').isEmail().withMessage('You must provide a valid email address'),
	body('password').not().isEmpty().withMessage('You must provide a password'),
]
=======
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
>>>>>>> 2702b35f08153cb89a3b686cb3c07e5f2d736b5b
