import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokensController,
} from "../../../controllers/authController.js";
import validation from "../../../middleware/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "../../../validation/authValidation.js"; // Import the schemas

const router = express.Router();

// 1. Apply validation to /register
router.post("/register", validation(registerSchema, "body"), registerUser);

// 2. Apply validation to /login
router.post("/login", validation(loginSchema, "body"), loginUser);

// 3. Apply validation to /logout
router.post("/logout", validation(refreshTokenSchema, "body"), logoutUser);

// 4. Apply validation to /refresh
router.post(
  "/refresh",
  validation(refreshTokenSchema, "body"),
  refreshTokensController
);

export default router;
