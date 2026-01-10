import asyncHandler from "express-async-handler";
import Day from "../models/Day.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const addProductToDay = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { date, productId, weight } = req.body;

  if (!date || !productId || !weight || weight <= 0) {
    res.status(400);
    throw new Error("Date, productId, and weight (must be > 0) are required.");
  }

  const standardDate = new Date(new Date(date).setHours(0, 0, 0, 0));

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const user = await User.findById(userId).select("bloodGroup");

  let isForbiddenForUser = false;

  const bloodGroupIndex = Number(user?.bloodGroup);
  if (
    bloodGroupIndex >= 1 &&
    bloodGroupIndex <= 4 &&
    Array.isArray(product.groupBloodNotAllowed)
  ) {
    const idx = bloodGroupIndex - 1; // 1–4 → 0–3
    isForbiddenForUser = !!product.groupBloodNotAllowed[idx];
  }

  const consumedCalories = (product.calories / 100) * weight;

  let dayEntry = await Day.findOne({ userId, date: standardDate });

  if (!dayEntry) {
    dayEntry = await Day.create({
      userId,
      date: standardDate,
      consumedProducts: [],
      totalCalories: 0,
    });
  }

  dayEntry.consumedProducts.push({
    productId: product._id,
    title: product.title,
    weight: weight,
    calories: consumedCalories,
    isForbiddenForUser,
  });

  dayEntry.totalCalories += consumedCalories;

  await dayEntry.save();

  res.status(201).json({
    status: "success",
    day: dayEntry,
    isForbiddenForUser,
    message: `${product.title} added successfully.`,
  });
});

const deleteProductFromDay = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { consumedProductId } = req.body;

  if (!consumedProductId) {
    res.status(400);
    throw new Error("Consumed Product ID is required for deletion.");
  }

  let dayEntry = await Day.findOne({
    userId,
    "consumedProducts._id": consumedProductId,
  });

  if (!dayEntry) {
    res.status(404);
    throw new Error("Day entry or specified product not found.");
  }

  const productToDelete = dayEntry.consumedProducts.id(consumedProductId);

  if (!productToDelete) {
    res.status(404);
    throw new Error("Product not found in the current day entry.");
  }

  const caloriesToRemove = productToDelete.calories;

  productToDelete.deleteOne();

  dayEntry.totalCalories -= caloriesToRemove;

  await dayEntry.save();

  res.status(200).json({
    status: "success",
    day: dayEntry,
    message: `${productToDelete.title} successfully removed from the day log.`,
  });
});

const getDayInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const dateQuery = req.query.date ? new Date(req.query.date) : new Date();

  const standardDate = new Date(dateQuery.setHours(0, 0, 0, 0));

  const user = await User.findById(userId).select("dailyCalorieGoal");

  if (!user || !user.dailyCalorieGoal) {
    res.status(400);
    throw new Error(
      "Daily calorie goal is not set. Please complete the setup via '/private-intake'."
    );
  }

  const dailyGoal = user.dailyCalorieGoal;

  const dayEntry = await Day.findOne({ userId, date: standardDate }).populate({
    path: "consumedProducts.productId",
    select: "title calories categories",
  });

  let consumedCalories = 0;
  let productsList = [];

  if (dayEntry) {
    consumedCalories = dayEntry.totalCalories;
    productsList = dayEntry.consumedProducts.map((product) => ({
      id: product._id,
      title: product.title,
      weight: product.weight,
      calories: product.calories,
    }));
  }

  const remainingCalories = Math.max(0, dailyGoal - consumedCalories);

  res.status(200).json({
    status: "success",
    date: standardDate.toISOString().split("T")[0],
    dailyGoal,
    consumedCalories,
    remainingCalories,
    products: productsList,
    entryExists: !!dayEntry,
  });
});

export { addProductToDay, deleteProductFromDay, getDayInfo };
