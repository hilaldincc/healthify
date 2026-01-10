import mongoose from "mongoose";

const consumedProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
});

const daySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    consumedProducts: [consumedProductSchema],

    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

daySchema.index({ userId: 1, date: 1 }, { unique: true });

const Day = mongoose.model("Day", daySchema);

export default Day;
