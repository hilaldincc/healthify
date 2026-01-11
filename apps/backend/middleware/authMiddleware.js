import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/**
 * Kullanıcının isteğinde geçerli bir Access Token olup olmadığını kontrol eder.
 * Token varsa, doğrular ve kullanıcı bilgilerini req.user'a ekler.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Authorization Header'ını Kontrol Et
  // Token varsa ve "Bearer" ile başlıyorsa
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Token'ı "Bearer" kısmından ayır
      token = req.headers.authorization.split(" ")[1];

      // 2. Token'ı Doğrula (KRİTİK ADIM: ENV değişkeni ile doğrulama)
      // Bu anahtarın authController'da token oluşturulurken kullanılanla AYNI olması gerekir!
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Kullanıcıyı Bul
      // Doğrulanmış ID ile kullanıcıyı veritabanından çek ve şifresini hariç tut.
      req.user = await User.findById(decoded.id).select("-password");

      // 4. Sonraki Middleware'e Geç
      next();
    } catch (error) {
      // Token yanlış, süresi dolmuş veya secret yanlışsa (invalid signature) bu hata döner.
      console.error("JWT Doğrulama Hatası:", error.message);
      res.status(401);
      throw new Error("Not authorized, invalid token.");
    }
  }

  // Token hiç sağlanmadıysa
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided.");
  }
});

// Refresh Token işlemleri için yer tutucu
const refreshProtect = (req, res, next) => {
  // Refresh token mantığı burada işlenir
  next();
};

export { protect, refreshProtect };
