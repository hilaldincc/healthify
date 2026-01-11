import Joi from "joi";

// Kan grubu sadece 1, 2, 3, 4 olabilir.
const BLOOD_GROUPS = [1, 2, 3, 4];

// Aktivite seviyesi çarpanları 1.2, 1.375, 1.55, 1.725, 1.9 olmalıdır.
const ACTIVITY_LEVELS = [1.2, 1.375, 1.55, 1.725, 1.9];

// Kadınlar için kalori hesaplama formülüne göre gerekli tüm alanları içerir
export const calorieInputSchema = Joi.object({
  weight: Joi.number().min(30).max(300).required().messages({
    "number.base": "Weight must be a number.",
    "number.min": "Weight must be at least 30 kg.",
    "any.required": "Weight is required.",
  }),
  height: Joi.number().min(100).max(250).required().messages({
    "number.min": "Height must be at least 100 cm.",
    "any.required": "Height is required.",
  }),
  age: Joi.number().min(18).max(150).required().messages({
    "number.min": "Age must be at least 18.",
    "any.required": "Age is required.",
  }),
  activityLevel: Joi.number()
    .valid(...ACTIVITY_LEVELS)
    .required()
    .messages({
      "any.only": "Invalid activity level multiplier.",
    }),
  targetWeight: Joi.number().min(30).max(300).required().messages({
    "number.min": "Target weight must be at least 30 kg.",
    "any.required": "Target weight is required.",
  }),
  bloodGroup: Joi.number()
    .valid(...BLOOD_GROUPS)
    .required()
    .messages({
      "any.only": "Blood group must be 1, 2, 3, or 4.",
    }),
});

// Kullanıcı sadece bu alanlardan birini veya birkaçını gönderebilir
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  weight: Joi.number().min(30).max(300),
  height: Joi.number().min(100).max(250),
  age: Joi.number().min(18).max(150),
  activityLevel: Joi.number().valid(...ACTIVITY_LEVELS),
  targetWeight: Joi.number().min(30).max(300),
  bloodGroup: Joi.number().valid(...BLOOD_GROUPS),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
  });
