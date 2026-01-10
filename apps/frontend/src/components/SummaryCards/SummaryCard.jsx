import React from "react";
import styles from "./SummaryCard.module.css";

const SummaryCard = ({
  date,
  dailyRate,
  consumed = 0,
  forbiddenFoods = [],
}) => {
  const safeDailyRate = Number(dailyRate) || 0;
  const safeConsumed = Number(consumed) || 0;

  const left = Math.max(safeDailyRate - safeConsumed, 0);
  const percent =
    safeDailyRate > 0
      ? Math.min(Math.round((safeConsumed / safeDailyRate) * 100), 100)
      : 0;

  return (
    <div className={styles.card}>
      <div className={styles.summary}>
        <h3 className={styles.title}>Summary for {date}</h3>

        <ul className={styles.list}>
          <li className={styles.item}>
            <span>Left</span>
            <span>{left} kcal</span>
          </li>
          <li className={styles.item}>
            <span>Consumed</span>
            <span>{safeConsumed} kcal</span>
          </li>
          <li className={styles.item}>
            <span>Daily rate</span>
            <span>{safeDailyRate} kcal</span>
          </li>
          <li className={styles.item}>
            <span>n% of normal</span>
            <span>{percent}%</span>
          </li>
        </ul>
      </div>

      <div className={styles.food}>
        <h3 className={styles.foodTitle}>Food not recommended</h3>

        {!forbiddenFoods.length ? (
          <p className={styles.foodText}>Your diet will be displayed here</p>
        ) : (
          <ul className={styles.foodList}>
            {forbiddenFoods.map((food, idx) => (
              <li key={idx} className={styles.foodItem}>
                {food}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
