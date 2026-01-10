import CalorieProfile from "../models/CalorieProfile.js";
import {
  calculateDailyCalories,
  getForbiddenFoods,
} from "../services/calorieService.js";

export const publicCalorieIntake = async (req, res) => {
  try {
    const dailyRate = calculateDailyCalories(req.body);
    const forbiddenFoods = await getForbiddenFoods(req.body.bloodType);

    res.status(200).json({ dailyRate, forbiddenFoods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const privateCalorieIntake = async (req, res) => {
  try {
    const dailyRate = calculateDailyCalories(req.body);
    const forbiddenFoods = await getForbiddenFoods(req.body.bloodType);

    const userId = req.user._id;

    await CalorieProfile.findOneAndUpdate(
      { owner: userId },
      {
        owner: userId,
        dailyRate,
        forbiddenFoods,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ dailyRate, forbiddenFoods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserCalorieProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await CalorieProfile.findOne({ owner: userId });

    if (!profile) {
      return res.status(404).json({
        message: "No calorie profile found for this user",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
