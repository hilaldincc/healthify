import express from "express";
import { getMe, updateUserData } from "../../../controllers/userController.js";
import { protect } from "../../../middleware/authMiddleware.js";
import validation from "../../../middleware/validationMiddleware.js";
import { updateUserSchema } from "../../../validation/userValidation.js";

const router = express.Router();
// GET /me rotasında body veya query olmadığı için doğrulama gerekmez.
router.get("/me", protect, getMe);
// PATCH /update rotasına doğrulama eklendi
router.patch(
  "/update",
  protect,
  validation(updateUserSchema, "body"),
  updateUserData
);

export default router;
