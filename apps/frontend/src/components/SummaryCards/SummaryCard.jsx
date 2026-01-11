// src/components/SummaryCards/SummaryCard.jsx
import React from "react";
import styles from "./SummaryCard.module.css";

const SummaryCard = ({
  date,
  dailyRate,
  consumed = 0,
  forbiddenFoods = [],
}) => {
  const formatKcal = (value) =>
    value != null && !Number.isNaN(value)
      ? `${Math.round(value)} kcal`
      : "000 kcal";

  const left =
    dailyRate != null ? Math.max(0, Math.round(dailyRate - consumed)) : null;

  const percentOfNormal =
    dailyRate && dailyRate > 0
      ? Math.round((consumed / dailyRate) * 100)
      : 0;

  return (
    <div className={styles.card}>
      {/* SOL KOLON – Summary */}
      <div className={styles.summaryCol}>
        <h2 className={styles.title}>Summary for {date}</h2>

        <ul className={styles.list}>
          <li className={styles.item}>
            <span>Left</span>
            <span>{formatKcal(left)}</span>
          </li>
          <li className={styles.item}>
            <span>Consumed</span>
            <span>{formatKcal(consumed)}</span>
          </li>
          <li className={styles.item}>
            <span>Daily rate</span>
            <span>{formatKcal(dailyRate)}</span>
          </li>
          <li className={styles.item}>
            <span>% of normal</span>
            <span>{percentOfNormal}%</span>
          </li>
        </ul>
      </div>

      {/* SAĞ KOLON – Food */}
      <div className={styles.foodCol}>
        <h3 className={styles.foodTitle}>Food not recommended</h3>

        {forbiddenFoods.length === 0 ? (
          <p className={styles.foodText}>Your diet will be displayed here</p>
        ) : (
          <ul className={styles.foodList}>
            {forbiddenFoods.map((food, index) => (
              <li key={index} className={styles.foodItem}>
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
