import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";

const { JWT_SECRET } = process.env;
const REFRESH_SECRET = process.env.REFRESH_SECRET || JWT_SECRET; // Refresh token için farklı bir secret kullanmak daha güvenlidir

// Token oluşturma yardımcı fonksiyonu
const createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// 1. Yeni Kullanıcı Kayıt Mantığı
async function registerUser(name, email, password) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // 409 Conflict (Çakışma) için hata fırlat
    throw new Error("Email address already in use.");
  }

  // Şifreyi hash'le
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
}

// 2. Kullanıcı Giriş Mantığı
async function loginUser(email, password, ipAddress) {
  // ipAddress parametresi eklendi
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  // 1. ACCESS TOKEN (Kısa ömürlü, korumalı rotalar için)
  const accessToken = createToken({ id: user._id }, JWT_SECRET, "15m");

  // 2. REFRESH TOKEN (Uzun ömürlü, yeni access token almak için)
  const refreshToken = createToken({ id: user._id }, REFRESH_SECRET, "7d");

  // 3. Oturum Veritabanına Kaydetme
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 gün

  await Session.create({
    userId: user._id,
    refreshToken: refreshToken,
    expiresAt: expiresAt,
    ipAddress: ipAddress,
  });

  const { password: _, ...userData } = user.toObject();

  return { accessToken, refreshToken, user: userData }; // Yanıtta iki token döndür
}

// 3. Oturum Kapatma (Logout) Mantığı
async function logoutUser(refreshToken) {
  // Veritabanından oturumu sil
  const result = await Session.deleteOne({ refreshToken });

  // Eğer bir şey silinmediyse (token bulunamadı veya geçersizdi)
  if (result.deletedCount === 0) {
    throw new Error("Logout failed. Invalid refresh token.");
  }
  return true;
}

// 4. Token Yenileme Mantığı
async function refreshTokens(oldRefreshToken) {
  // 1. Tokenı kontrol et ve Session modelinde bul
  const session = await Session.findOne({ refreshToken: oldRefreshToken });

  if (!session || session.expiresAt < new Date()) {
    // Oturum bulunamadı, süresi doldu veya geçersiz
    throw new Error("Invalid or expired refresh token.");
  }

  // 2. Tokenın gerçekten bizim REFRESH_SECRET ile oluşturulduğunu doğrula
  try {
    const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET);
  } catch (error) {
    throw new Error("Refresh token verification failed.");
  }

  // 3. Yeni Access Token ve Refresh Token oluştur
  const newAccessToken = createToken({ id: session.userId }, JWT_SECRET, "15m");
  const newRefreshToken = createToken(
    { id: session.userId },
    REFRESH_SECRET,
    "7d"
  );

  // 4. Veritabanındaki eski tokenı yenisiyle güncelle
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  session.refreshToken = newRefreshToken;
  session.expiresAt = expiresAt;
  await session.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    userId: session.userId,
  };
}

export { registerUser, loginUser, logoutUser, refreshTokens };
