import mongoose from "mongoose";

// 1. Tüketilen Ürün Alt Şeması (Sub-Schema)
// Bir gün içinde tüketilen her bir yiyeceği temsil eder.
const consumedProductSchema = new mongoose.Schema({
  // Tüketilen ürünün ID'si (Product modeline referans)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  // Ürünün adı (Arama modelinde değişiklik olsa bile kayıtta tutulması için)
  title: {
    type: String,
    required: true,
  },
  // Tüketilen miktar (gram)
  weight: {
    type: Number,
    required: true,
  },
  // Tüketilen ürünün toplam kalorisi (hesaplanmış değer, kolaylık için saklanır)
  calories: {
    type: Number,
    required: true,
  },
});

// 2. Ana Günlük Kayıt Şeması (Day Schema)
const daySchema = new mongoose.Schema(
  {
    // Hangi kullanıcıya ait olduğu
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Hangi güne ait olduğu (Örn: 2025-11-27T00:00:00.000Z)
    date: {
      type: Date,
      required: true,
    },
    // O gün tüketilen ürünlerin listesi
    consumedProducts: [consumedProductSchema],

    // O gün tüketilen toplam kalori miktarı (performans için tutulur)
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Aynı kullanıcı için aynı tarihte birden fazla kayıt olmasını engellemek için bileşik indeks
daySchema.index({ userId: 1, date: 1 }, { unique: true });

const Day = mongoose.model("Day", daySchema);

export default Day;
