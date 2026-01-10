import React from "react";
import css from "./DailyCalorieIntake.module.css";
import { useNavigate } from "react-router-dom";

const DailyCalorieIntake = ({ dailyRate, forbiddenFoods, onClose }) => {
  const navigate = useNavigate();

  const handleStartLosingWeight = () => {
    if (onClose) onClose();
    navigate("/login");
  };

  const hasForbiddenFoods = forbiddenFoods && forbiddenFoods.length > 0;

  return (
    <div className={css.intakeBody}>
      <h2 className={`page-title ${css.intakeTitle}`}>
        Your recommended daily calorie intake is
      </h2>

      <div className={css.rateBox}>
        <span className={`modal-calorie-text ${css.dailyRate}`}>
          {dailyRate}
        </span>
        <span className={css.unit}> kkal</span>
      </div>

      <hr className={css.divider} />

      <h3 className={css.subtitle}>Foods you should not eat</h3>

      <ol className={css.foodList}>
        {hasForbiddenFoods ? (
          forbiddenFoods.map((food, index) => (
            <li key={index} className={css.foodItem}>
              {food}
            </li>
          ))
        ) : (
          <li className={css.foodItem}>No forbidden foods found.</li>
        )}
      </ol>

      <button className={css.startButton} onClick={handleStartLosingWeight}>
        Start losing weight
      </button>
    </div>
  );
};

export default DailyCalorieIntake;
