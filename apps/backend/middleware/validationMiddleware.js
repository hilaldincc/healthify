import Joi from "joi";

const validation = (schema, property) => (req, res, next) => {
  // Validate the specified property (e.g., req.body) against the Joi schema
  const { error } = schema.validate(req[property]);

  if (error) {
    // If validation fails, construct a 400 response
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ message: errorMessage });
  }

  next(); // Validation successful, proceed to the next handler/controller
};

export default validation;
