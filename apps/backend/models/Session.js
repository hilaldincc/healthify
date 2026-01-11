import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User modeline referans
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true, // Her refresh token benzersiz olmalı
    },
    // Tokenın ne zaman geçerliliğini yitireceği (güvenlik için önemli)
    expiresAt: {
      type: Date,
      required: true,
    },
    // Oturumun nerede oluşturulduğunu izlemek için (Örn: Cihaz bilgisi)
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true, // created/updated at alanları
  }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
