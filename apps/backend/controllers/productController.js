import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { getForbiddenProducts as getForbiddenProductsService } from "../services/calorieService.js";

const searchProducts = asyncHandler(async (req, res) => {
  const { query, bloodGroup } = req.query;

  if (!query || query.trim() === "") {
    res.status(400);
    throw new Error(
      'A valid "query" parameter is required to perform a search'
    );
  }

  const bloodGroupIndex = parseInt(bloodGroup, 10);

  let filter = {};

  filter.$text = { $search: query };

  if (bloodGroupIndex >= 1 && bloodGroupIndex <= 4) {
    filter[`groupBloodNotAllowed.${bloodGroupIndex}`] = false;
  }

  const products = await Product.find(filter)
    .limit(20)
    .select("title calories categories weight groupBloodNotAllowed");

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

const getForbiddenProducts = asyncHandler(async (req, res) => {
  const { bloodGroup } = req.query;
  const bloodGroupIndex = parseInt(bloodGroup, 10);

  if (!bloodGroupIndex || bloodGroupIndex < 1 || bloodGroupIndex > 4) {
    res.status(400);
    throw new Error(
      'You must submit a valid "bloodGroup" parameter (1, 2, 3, or 4)'
    );
  }

  const forbiddenFoods = await getForbiddenProductsService(bloodGroupIndex);

  res.status(200).json({
    status: "success",
    bloodGroup: bloodGroupIndex,
    count: forbiddenFoods.length,
    forbiddenFoods,
  });
});

export { searchProducts, getForbiddenProducts };
