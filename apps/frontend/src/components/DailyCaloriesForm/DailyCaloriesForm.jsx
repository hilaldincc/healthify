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

const NUMERIC_FIELDS = ["height", "age", "currentWeight", "desiredWeight"];

const FIELD_RULES = {
  height: { min: 100,max: 250, maxLength: 3 },
  age: { min: 18, max: 100, maxLength: 3 },
  currentWeight: {min: 20, max: 500, maxLength: 3 },
  desiredWeight: { min: 20, max: 500, maxLength: 3 },
};

const validateForm = (data) => {
  const errors = {};
  const parsedData = {};

  for (const key in data) {
    if (key !== "bloodType" && key !== "activityLevel") {
      parsedData[key] = parseInt(data[key], 10);
    } else {
      parsedData[key] = data[key];
    }
  } // zorunlu alanlar

  if (!parsedData.height || isNaN(parsedData.height)) {
    errors.height = "Height is required.";
  } else if (parsedData.height < 100 || parsedData.height > 250) {
    errors.height = "Height must be between 100 and 250 cm.";
  }

  if (!parsedData.age || isNaN(parsedData.age)) {
    errors.age = "Age is required.";
  } else if (parsedData.age < 18 || parsedData.age > 100) {
    errors.age = "Age must be between 18 and 100.";
  }

  if (!parsedData.currentWeight || isNaN(parsedData.currentWeight)) {
    errors.currentWeight = "Current weight is required.";
  } else if (parsedData.currentWeight < 20 || parsedData.currentWeight > 500) {
    errors.currentWeight = "Current weight must be between 20 and 500 kg.";
  }

  if (!parsedData.desiredWeight || isNaN(parsedData.desiredWeight)) {
    errors.desiredWeight = "Desired weight is required.";
  } else if (parsedData.desiredWeight < 20 || parsedData.desiredWeight > 500) {
    errors.desiredWeight = "Desired weight must be between 20 and 500 kg.";
  }

  if (
    !parsedData.bloodType ||
    !["A", "B", "AB", "0"].includes(parsedData.bloodType)
  ) {
    errors.bloodType = "Blood type is required.";
  }

  if (
    !data.activityLevel ||
    !ACTIVITY_LEVELS.some((level) => level.value === data.activityLevel)
  ) {
    errors.activityLevel = "Activity level is required.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const DailyCaloriesForm = ({ onFormSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    height: "",
    age: "",
    currentWeight: "",
    desiredWeight: "",
    bloodType: "",
    activityLevel: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (NUMERIC_FIELDS.includes(name)) {
      if (value === "") {
        finalValue = "";
      } else {
        finalValue = value.replace(/[^0-9]/g, "").replace(/^0+/, "");
        if (finalValue === "") {
          return;
        }

        const rule = FIELD_RULES[name];
        if (rule) {
          const numericValue = parseInt(finalValue, 10);
          if (numericValue > rule.max) {
            finalValue = String(rule.max);
          } else if (rule.maxLength && finalValue.length > rule.maxLength) {
            finalValue = finalValue.slice(0, rule.maxLength);
          }
        }
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleKeyDown = (e) => {
    if (!NUMERIC_FIELDS.includes(e.target.name)) {
      return;
    }

    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];

    if (
      allowedControlKeys.includes(e.key) ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const { selectionStart, selectionEnd, value } = e.target;
    const insertingAtStart = selectionStart === 0 && selectionEnd === 0;
    if (e.key === "0" && insertingAtStart && value.length === 0) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      console.error("Form doğrulama hatası:", validationErrors);
      return;
    }

    onFormSubmit(formData);

    setFormData({
      height: "",
      age: "",
      currentWeight: "",
      desiredWeight: "",
      bloodType: "",
      activityLevel: "",
    });
    setErrors({});
  };

  return (
    <div className={css.formContainer}>
      <h1 className="page-title">
        Calculate your daily calorie intake right now
      </h1>
      <form className={css.form} onSubmit={handleSubmit}>
        {/* Row 1: Height + Desired weight */}
        <div className={css.row}>
          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Height *
              <input
                className={`${css.inputField} ${
                  errors.height ? css.inputError : ""
                }`}
                type="text"
                name="height"
                placeholder="Enter your height (cm)"
                inputMode="numeric"
                pattern="[1-9][0-9]*"
                maxLength={FIELD_RULES.height.maxLength}
                value={formData.height}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </label>
            {errors.height && (
              <span className={css.errorMessage}>{errors.height}</span>
            )}
          </div>

          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Desired weight *
              <input
                className={`${css.inputField} ${
                  errors.desiredWeight ? css.inputError : ""
                }`}
                type="text"
                name="desiredWeight"
                placeholder="Target weight (kg)"
                inputMode="numeric"
                pattern="[1-9][0-9]*"
                maxLength={FIELD_RULES.desiredWeight.maxLength}
                value={formData.desiredWeight}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </label>
            {errors.desiredWeight && (
              <span className={css.errorMessage}>{errors.desiredWeight}</span>
            )}
          </div>
        </div>

        {/* Row 2: Age + Blood type */}
        <div className={css.row}>
          <div className={css.inputGroup}>
            <label className={css.inputLabel}>
              Age *
              <input
                className={`${css.inputField} ${errors.age ? css.inputError : ""}`}
                type="text"
                name="age"
                placeholder="How old are you?"
                inputMode="numeric"
                pattern="[1-9][0-9]*"
                maxLength={FIELD_RULES.age.maxLength}
                value={formData.age}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </label>
            {errors.age && <span className={css.errorMessage}>{errors.age}</span>}
          </div>

          <div className={css.inputGroup}>
            <span className={css.inputLabel}>Blood type *</span>
            <div className={css.radioOptions}>
              {BLOOD_GROUPS.map((type) => (
                <label key={type.value} className={css.radioOption}>
                  <input
                    type="radio"
                    name="bloodType"
                    value={type.value}
                    checked={formData.bloodType === type.value}
                    onChange={handleChange}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
            {errors.bloodType && (
              <span className={css.errorMessage}>{errors.bloodType}</span>
            )}
          </div>
        </div>

        {/* Row 3: Current weight */}
        <div className={css.row}>
          <div className={`${css.inputGroup} ${css.fullWidth}`}>
            <label className={css.inputLabel}>
              Current weight *
              <input
                className={`${css.inputField} ${
                  errors.currentWeight ? css.inputError : ""
                }`}
                type="text"
                name="currentWeight"
                placeholder="Your current weight (kg)"
                inputMode="numeric"
                pattern="[1-9][0-9]*"
                maxLength={FIELD_RULES.currentWeight.maxLength}
                value={formData.currentWeight}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </label>
            {errors.currentWeight && (
              <span className={css.errorMessage}>{errors.currentWeight}</span>
            )}
          </div>
        </div>

        {/* Row 4: Activity level */}
        <div className={css.row}>
          <div className={`${css.inputGroup} ${css.fullWidth}`}>
            <label className={css.inputLabel}>
              Activity level *
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className={`${css.inputField} ${
                  errors.activityLevel ? css.inputError : ""
                }`}
              >
                <option value="" disabled>
                  Select activity level
                </option>
                {ACTIVITY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            {errors.activityLevel && (
              <span className={css.errorMessage}>{errors.activityLevel}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`calculation-btn ${css.submitBtn}`}
          disabled={isLoading}
        >
          {isLoading ? "Calculating..." : "Start losing weight"}
        </button>
      </form>
    </div>
  );
};

export default DailyCaloriesForm;
