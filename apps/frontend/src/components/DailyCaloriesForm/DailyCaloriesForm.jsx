import React, { useState } from "react";
import css from "./DailyCaloriesForm.module.css";

const BLOOD_GROUPS = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "AB", value: "AB" },
  { label: "0", value: "0" },
];

const ACTIVITY_LEVELS = [
  { label: "Minimum (Sedentary)", value: "1.2" },
  { label: "Low (Light exercise 1-3 times/week)", value: "1.375" },
  { label: "Medium (Moderate exercise 3-5 times/week)", value: "1.55" },
  { label: "High (Hard exercise 6-7 times/week)", value: "1.725" },
  { label: "Maximum (Daily intense exercise or job)", value: "1.9" },
];

const DailyCaloriesForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    height: "",
    age: "",
    currentWeight: "",
    desiredWeight: "",
    bloodType: "",
    levelActivity: "",
  });

  const [errors, setErrors] = useState({});

  const validateAndParse = () => {
    const parsedData = {
      height: Number(formData.height),
      age: Number(formData.age),
      currentWeight: Number(formData.currentWeight),
      desiredWeight: Number(formData.desiredWeight),
      bloodType: formData.bloodType,
      levelActivity: Number(formData.levelActivity),
    };

    const validationErrors = {};

    if (!parsedData.height || isNaN(parsedData.height)) {
      validationErrors.height = "Height is required.";
    } else if (parsedData.height < 100 || parsedData.height > 250) {
      validationErrors.height = "Height must be between 100 and 250 cm.";
    }

    if (!parsedData.age || isNaN(parsedData.age)) {
      validationErrors.age = "Age is required.";
    } else if (parsedData.age < 18 || parsedData.age > 100) {
      validationErrors.age = "Age must be between 18 and 100.";
    }

    if (!parsedData.currentWeight || isNaN(parsedData.currentWeight)) {
      validationErrors.currentWeight = "Current weight is required.";
    } else if (
      parsedData.currentWeight < 20 ||
      parsedData.currentWeight > 500
    ) {
      validationErrors.currentWeight =
        "Current weight must be between 20 and 500 kg.";
    }

    if (!parsedData.desiredWeight || isNaN(parsedData.desiredWeight)) {
      validationErrors.desiredWeight = "Desired weight is required.";
    } else if (
      parsedData.desiredWeight < 20 ||
      parsedData.desiredWeight > 500
    ) {
      validationErrors.desiredWeight =
        "Desired weight must be between 20 and 500 kg.";
    }

    if (!parsedData.bloodType) {
      validationErrors.bloodType = "Blood type is required.";
    }

    if (!parsedData.levelActivity || isNaN(parsedData.levelActivity)) {
      validationErrors.levelActivity = "Activity level is required.";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      console.error("Form validation error:", validationErrors);
      return null;
    }

    return parsedData;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsed = validateAndParse();
    if (!parsed) return;

    if (onSubmit) onSubmit(parsed);
  };

  return (
    <div className={css.formContainer}>
      <h1 className="page-title">
        Calculate your daily calorie intake right now
      </h1>

      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.row}>
          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Height *
              <input
                className={css.inputField}
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
            </label>
            {errors.height && (
              <p className={css.errorMessage}>{errors.height}</p>
            )}
          </div>

          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Age *
              <input
                className={css.inputField}
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </label>
            {errors.age && <p className={css.errorMessage}>{errors.age}</p>}
          </div>
        </div>

        <div className={css.row}>
          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Current weight *
              <input
                className={css.inputField}
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
              />
            </label>
            {errors.currentWeight && (
              <p className={css.errorMessage}>{errors.currentWeight}</p>
            )}
          </div>

          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Desired weight *
              <input
                className={css.inputField}
                type="number"
                name="desiredWeight"
                value={formData.desiredWeight}
                onChange={handleChange}
              />
            </label>
            {errors.desiredWeight && (
              <p className={css.errorMessage}>{errors.desiredWeight}</p>
            )}
          </div>
        </div>

        <div className={css.radioOptions}>
          <p className={css.inputLabel}>Blood type *</p>

          {BLOOD_GROUPS.map((b) => (
            <label key={b.value} className={css.radioOption}>
              <input
                type="radio"
                name="bloodType"
                value={b.value}
                checked={formData.bloodType === b.value}
                onChange={handleChange}
              />
              {b.label}
            </label>
          ))}

          {errors.bloodType && (
            <p className={css.errorMessage}>{errors.bloodType}</p>
          )}
        </div>

        <div className={css.radioOptions}>
          <p className={css.inputLabel}>Activity level *</p>

          {ACTIVITY_LEVELS.map((a) => (
            <label key={a.value} className={css.radioOption}>
              <input
                type="radio"
                name="levelActivity"
                value={a.value}
                checked={formData.levelActivity === a.value}
                onChange={handleChange}
              />
              {a.label}
            </label>
          ))}

          {errors.levelActivity && (
            <p className={css.errorMessage}>{errors.levelActivity}</p>
          )}
        </div>

        <button type="submit" className={css.button}>
          Start losing weight
        </button>
      </form>
    </div>
  );
};

export default DailyCaloriesForm;
