import asyncHandler from "express-async-handler";
import {
  calculateDailyCalorieIntake,
  getForbiddenProducts,
} from "../services/calorieService.js";
import User from "../models/User.js";

const getCalculationData = async (
  weight,
  height,
  age,
  activityLevel,
  targetWeight,
  bloodGroup
) => {
  if (
    !weight ||
    !height ||
    !age ||
    !activityLevel ||
    !targetWeight ||
    !bloodGroup
  ) {
    throw new Error(
      "Missing required fields for calculation, including targetWeight and bloodGroup."
    );
  }

  const dailyRate = calculateDailyCalorieIntake(
    weight,
    height,
    age,
    activityLevel,
    targetWeight
  );

  const forbiddenFoods = await getForbiddenProducts(bloodGroup);

  return { dailyRate, forbiddenFoods };
};

const publicCalorieIntake = asyncHandler(async (req, res) => {
  const { weight, height, age, activityLevel, targetWeight, bloodGroup } =
    req.body;

  const { dailyRate, forbiddenFoods } = await getCalculationData(
    weight,
    height,
    age,
    activityLevel,
    targetWeight,
    bloodGroup
  );

  res.status(200).json({
    status: "success",
    dailyRate,
    forbiddenFoods,
  });
});

const privateCalorieIntake = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("bloodGroup");
  const bloodGroup = req.body.bloodGroup || user?.bloodGroup;

  const { weight, height, age, activityLevel, targetWeight } = req.body;

  const { dailyRate, forbiddenFoods } = await getCalculationData(
    weight,
    height,
    age,
    activityLevel,
    targetWeight,
    bloodGroup
  );

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        dailyCalorieGoal: dailyRate,
        weight,
        height,
        age,
        activityLevel,
        targetWeight,
        bloodGroup,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    dailyRate,
    forbiddenFoods,
    message: "Calorie goal saved to profile.",
  });
});

const getUserCalorieProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select(
    "dailyCalorieGoal weight height age activityLevel targetWeight bloodGroup"
  );

  if (!user) {
    return res
      .status(404)
      .json({ status: "fail", message: "User not found for this token." });
  }

  return res.status(200).json({
    status: "success",
    dailyRate: user.dailyCalorieGoal,
    profile: {
      weight: user.weight,
      height: user.height,
      age: user.age,
      activityLevel: user.activityLevel,
      targetWeight: user.targetWeight,
      bloodGroup: user.bloodGroup,
    },
  });
});

export { publicCalorieIntake, privateCalorieIntake, getUserCalorieProfile };
