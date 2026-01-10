import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    categories: {
      type: String,
      required: [true, "Product must have a category."],
    },
    weight: {
      type: Number,
      required: true,
      default: 100,
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
    groupBloodNotAllowed: {
      type: [Boolean],
      required: true,
      validate: {
        validator: function (v) {
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

productSchema.index({ title: "text" });

productSchema.index({ category: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
