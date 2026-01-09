import Joi from "joi";

// Regex for a strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please enter a valid email address.",
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    "any.required": "Password is required.",
    "string.pattern.base":
      "Password must be at least 8 characters long and contain uppercase, lowercase, and a digit.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required.",
  }),
});
