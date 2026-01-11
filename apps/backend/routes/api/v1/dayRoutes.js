import express from "express";
import {
  addProductToDay,
  deleteProductFromDay,
  getDayInfo,
} from "../../../controllers/dayController.js";
import { protect } from "../../../middleware/authMiddleware.js";
import validation from "../../../middleware/validationMiddleware.js";
import {
  addProductSchema,
  deleteProductSchema,
  getDayInfoSchema,
} from "../../../validation/dayValidation.js";

const router = express.Router();

router.post(
  "/add-product",
  protect,
  validation(addProductSchema, "body"),
  addProductToDay
);

router.delete(
  "/delete-product",
  protect,
  validation(deleteProductSchema, "body"),
  deleteProductFromDay
);

router.get("/info", protect, validation(getDayInfoSchema, "query"), getDayInfo);

export default router;
