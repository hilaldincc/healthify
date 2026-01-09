// src/components/CalculatorForm/CalculatorForm.jsx
import React, { useState } from "react";
import styles from "./CalculatorForm.module.css";

const initialState = {
  height: "",
  age: "",
  currentWeight: "",
  desiredWeight: "",
  bloodType: "",
  activityLevel: "",
};

const CalculatorForm = ({ onSubmit }) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!values.height || Number(values.height) <= 0) {
      newErrors.height = "Height is required";
    }
    if (!values.age || Number(values.age) <= 0) {
      newErrors.age = "Age is required";
    }
    if (!values.currentWeight || Number(values.currentWeight) <= 0) {
      newErrors.currentWeight = "Current weight is required";
    }
    if (!values.desiredWeight || Number(values.desiredWeight) <= 0) {
      newErrors.desiredWeight = "Desired weight is required";
    }
    if (!values.bloodType) {
      newErrors.bloodType = "Blood type is required";
    }
    if (!values.activityLevel) {
      newErrors.activityLevel = "Activity level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      height: Number(values.height),
      age: Number(values.age),
      currentWeight: Number(values.currentWeight),
      desiredWeight: Number(values.desiredWeight),
      bloodType: Number(values.bloodType), // 1,2,3,4
      activityLevel: Number(values.activityLevel),
    });
  };

  // Ekranda gözüken etiketler ↔ backend value mapping’i
  const bloodOptions = [
    { value: "1", label: "0" },
    { value: "2", label: "AB" },
    { value: "3", label: "A" },
    { value: "4", label: "B" },
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Height + Desired weight */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="height" className={styles.label}>
            Height *
          </label>
          <input
            id="height"
            type="number"
            name="height"
            value={values.height}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.height && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠</span>
              <span>{errors.height}</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="desiredWeight" className={styles.label}>
            Desired weight *
          </label>
          <input
            id="desiredWeight"
            type="number"
            name="desiredWeight"
            value={values.desiredWeight}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.desiredWeight && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠</span>
              <span>{errors.desiredWeight}</span>
            </div>
          )}
        </div>
      </div>

      {/* Age + Blood type */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="age" className={styles.label}>
            Age *
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={values.age}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.age && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠</span>
              <span>{errors.age}</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Blood type *</span>
          <div className={styles.radioGroup}>
            {bloodOptions.map((opt) => (
              <label key={opt.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="bloodType"
                  value={opt.value}
                  checked={values.bloodType === opt.value}
                  onChange={handleChange}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.bloodType && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠</span>
              <span>{errors.bloodType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Current weight + Activity level yan yana */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Current weight *</label>
          <input
            type="number"
            name="currentWeight"
            value={values.currentWeight}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.currentWeight && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠</span>
              <span>{errors.currentWeight}</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Activity level *</label>
          <select
            name="activityLevel"
            value={values.activityLevel}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="" disabled>
              Select activity level
            </option>
            <option value="1.2">Minimum (Sedentary)</option>
            <option value="1.375">
              Low (Light exercise 1–3 times/week)
            </option>
            <option value="1.55">
              Medium (Moderate exercise 3–5 times/week)
            </option>
            <option value="1.725">
              High (Hard exercise 6–7 times/week)
            </option>
            <option value="1.9">
              Maximum (Daily intense exercise or job)
            </option>
          </select>
          {errors.activityLevel && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠</span>
              <span>{errors.activityLevel}</span>
            </div>
          )}
        </div>
      </div>

      <button type="submit" className={styles.button}>
        Start losing weight
      </button>
    </form>
  );
};

export default CalculatorForm;