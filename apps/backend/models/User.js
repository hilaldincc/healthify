import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please fill in the name field."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter an email address."],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
      minlength: 6,
      select: false,
    },
    token: {
      type: String,
      default: null,
    },
    dailyCalorieGoal: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    age: {
      type: Number,
    },
    activityLevel: {
      type: Number, // Şimdi NUMERIC
    },
    targetWeight: {
      type: Number,
    },
    bloodGroup: {
      type: Number, // 💉 Kan grubu eklendi
    },
  },
  {
    timestamps: true,
  }
);

// Unique index (email)
userSchema.index({ email: 1 }, { unique: true });

// Password hashing before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
