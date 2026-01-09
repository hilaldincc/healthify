import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// --- 1. Madde: Kullanıcı Bilgilerini Alma (GET /me) ---
const getMe = asyncHandler(async (req, res) => {
  // Middleware'den gelen ID'yi kullanarak veritabanından güncel, temiz veriyi çekelim.
  // Password ve gereksiz Mongoose alanları hariç.
  const user = await User.findById(req.user._id).select("-password -__v");

  if (!user) {
    // Bu normalde olmamalıdır, zira protect middleware'i kullanıcıyı bulmuştur.
    res.status(404);
    throw new Error("User not found after authentication.");
  }

  res.status(200).json({
    status: "success",
    code: 200,
    user, // Artık veritabanından çekilmiş temiz veri
  });
});

// --- 2. Madde: Kullanıcı Bilgilerini Güncelleme (PATCH /update) ---
const updateUserData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const updateFields = req.body;

  // Kullanıcının şifre güncellemesini bu rotada engelliyoruz (daha güvenli bir pratik)
  if (updateFields.password) {
    res.status(400);
    throw new Error(
      "Password update is not allowed via this endpoint. Please use a dedicated change-password route."
    );
  }

  // Kullanıcıyı bul ve güncelleyeceğimiz alanları $set ile kaydet
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    {
      new: true,
      runValidators: true, // Mongoose doğrulayıcılarını çalıştır
    }
  ).select("-password -__v");

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found.");
  }

  res.status(200).json({
    status: "success",
    user: updatedUser,
    message: "User data updated successfully.",
  });
});

export { getMe, updateUserData };
