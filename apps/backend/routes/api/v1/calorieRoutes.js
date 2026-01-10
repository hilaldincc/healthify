import express from "express";
import {
  publicCalorieIntake,
  privateCalorieIntake,
  getUserCalorieProfile,
} from "../../../controllers/calorieController.js";
import { protect } from "../../../middleware/authMiddleware.js";
import validation from "../../../middleware/validationMiddleware.js";
import { calorieInputSchema } from "../../../validation/userValidation.js";

const router = express.Router();

router.post(
  "/intake",
  validation(calorieInputSchema, "body"),
  publicCalorieIntake
);

router.get("/debug/forbidden/:group", (req, res, next) => {
  import("../../../controllers/calorieController.js")
    .then((mod) => mod.debugForbiddenProducts(req, res, next))
    .catch(next);
});

router.post(
  "/private-intake",
  protect,
  validation(calorieInputSchema, "body"),
  privateCalorieIntake
);

router.get("/me", protect, getUserCalorieProfile);

export default router;
