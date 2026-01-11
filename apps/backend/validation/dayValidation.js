import Joi from "joi";

const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

export const addProductSchema = Joi.object({
  date: Joi.string().pattern(dateFormat).required().messages({
    "string.pattern.base": "Date must be in YYYY-MM-DD format.",
    "any.required": "Date is required.",
  }),
  productId: Joi.string().length(24).required().messages({
    "string.length": "Invalid product ID format.",
    "any.required": "Product ID is required.",
  }),
  weight: Joi.number().min(1).required().messages({
    "number.min": "Weight must be at least 1 gram.",
    "any.required": "Weight (grams) is required.",
  }),
});

export const deleteProductSchema = Joi.object({
  consumedProductId: Joi.string().length(24).required().messages({
    "string.length": "Invalid consumed product ID format.",
    "any.required": "Consumed product ID is required.",
  }),
});

export const getDayInfoSchema = Joi.object({
  date: Joi.string().pattern(dateFormat).messages({
    "string.pattern.base": "Date must be in YYYY-MM-DD format.",
  }),
});