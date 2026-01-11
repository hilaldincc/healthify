import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Session from "../models/Session.js";
// Eğer logout ve refresh'te authService kullanıyorsanız, buraya dahil edin:
// import * as authService from '../services/authService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Yeni Refresh Token oluşturma fonksiyonu
const generateRefreshToken = (id) => {
  // JWT_REFRESH_SECRET ve JWT_REFRESH_EXPIRES_IN kullanılıyor
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

// --- POST /api/v1/auth/register ---
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Yeni kullanıcı oluşturma (Şifre User.js modelindeki pre('save') hook'unda hashlenir)
  const user = await User.create({ name, email, password });

  if (user) {
    const accessToken = generateToken(user._id);

    res.status(201).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// --- POST /api/v1/auth/login ---
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    // Yeni Access Token oluştur
    const accessToken = generateToken(user._id);

    // Yeni Refresh Token oluştur
    const refreshToken = generateRefreshToken(user._id);

    // Refresh Token'ın bitiş süresini hesapla (örn: .env'deki değere göre)
    // JWT_REFRESH_EXPIRES_IN = "30d" olduğu için bu hesaplamayı yapıyoruz.
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Eski oturumları temizle (opsiyonel ama iyi güvenlik pratiği)
    // await Session.deleteMany({ userId: user._id });

    // YENİ Session'ı veritabanına kaydet
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt,
      ipAddress: req.ip, // Kullanıcının IP adresini al
    });

    res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken, // <-- Yanıta Refresh Token'ı ekleyin
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
});

// --- POST /api/v1/auth/logout ---
const logoutUser = asyncHandler(async (req, res) => {
  // 1. İsteğin body'sinden Refresh Token'ı alın
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error("Refresh token required for logout.");
  }

  // 2. Token'ı veritabanından bul ve sil
  const result = await Session.deleteOne({ refreshToken });

  // 3. Yanıt
  if (result.deletedCount === 0) {
    // Token bulunamazsa da 204 döndürmek iyi bir pratik olabilir,
    // ancak hata vermek de isteğe bağlıdır.
    res.status(404);
    throw new Error("Session not found.");
  }

  // Başarılı silme (204 No Content)
  res.status(204).end();
});

// --- POST /api/v1/auth/refresh ---
const refreshTokensController = asyncHandler(async (req, res) => {
  // 1. İsteğin body'sinden Refresh Token'ı alın
  const { refreshToken: oldRefreshToken } = req.body;

  if (!oldRefreshToken) {
    res.status(400);
    throw new Error("Refresh token required.");
  }

  // 2. Refresh Token'ı veritabanında bulun
  const session = await Session.findOne({ refreshToken: oldRefreshToken });

  // Oturum yoksa veya süresi dolmuşsa hata ver
  if (!session || session.expiresAt < new Date()) {
    res.status(401);
    throw new Error("Invalid or expired refresh token.");
  }

  // 3. Refresh Token'ı doğrula (JWT ile)
  let decoded;
  try {
    // Refresh Token'ı doğrulamak için JWT_REFRESH_SECRET kullanılır
    decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    // İmza yanlışsa (invalid signature)
    res.status(401);
    throw new Error("Invalid refresh token signature.");
  }

  // 4. Token yenileme: Yeni token çiftini oluştur
  const newAccessToken = generateToken(decoded.id);
  const newRefreshToken = generateRefreshToken(decoded.id);

  // 5. Veritabanındaki oturumu güncelle (Token'ı değiştir ve süreyi uzat)
  session.refreshToken = newRefreshToken;
  session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 gün uzat
  // session.ipAddress = req.ip; // Opsiyonel: IP değiştiyse güncelle
  await session.save();

  // 6. Yeni token çiftini yanıtla
  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export { registerUser, loginUser, logoutUser, refreshTokensController };
