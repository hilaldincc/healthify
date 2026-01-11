import express from "express";
import {
  searchProducts,
  getForbiddenProducts,
} from "../../../controllers/productController.js";

const router = express.Router();

router.get("/search", searchProducts);
router.get("/forbidden", getForbiddenProducts);

export default router;
