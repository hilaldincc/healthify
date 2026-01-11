import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // MongoDB'deki '_id' alanı otomatik olarak yönetilecektir.

    categories: {
      type: String,
      required: [true, "Product must have a category."],
    },
    weight: {
      type: Number,
      required: true,
      default: 100, // Varsayılan ağırlık 100 gram (JSON'daki gibi)
    },
    title: {
      type: String,
      required: [true, "Product must have a title."],
      unique: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    // groupBloodNotAllowed: Kan grubuna göre yasaklanmış ürünleri tutan dizi.
    // Dizi indisleri (1'den 4'e kadar) kan gruplarına karşılık gelir:
    // [0: null/unused, 1: Kan Grubu 1 (0), 2: Kan Grubu 2 (A), 3: Kan Grubu 3 (B), 4: Kan Grubu 4 (AB)]
    groupBloodNotAllowed: {
      type: [Boolean],
      required: true,
      validate: {
        validator: function (v) {
          // Dizinin 5 elemanlı olduğunu ve ilk elemanın (index 0) null/false olduğunu varsayıyoruz.
          return v && v.length === 5;
        },
        message: "groupBloodNotAllowed must be an array of 5 boolean values.",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Arama işlemini hızlandırmak için 'title' alanına indeks ekleyelim.
productSchema.index({ title: "text" });

// Eğer 'category' alanına göre filtreleme yapılıyorsa:
productSchema.index({ category: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
