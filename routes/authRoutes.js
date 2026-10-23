
const express = require("express");
const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");

const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

router.post("/register", registerValidation, register);
router.post("/login", login);

module.exports = router;


