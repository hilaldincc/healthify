import React from 'react';
import styles from './DailyCalorieIntake.module.css';

const DailyCalorieIntake = ({ calories, forbiddenFoods }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your recommended daily calorie intake is</h2>
      <div className={styles.caloriesCount}>
        {calories} <span className={styles.unit}>ккал</span>
      </div>
      <div className={styles.foodListContainer}>
        <h3 className={styles.listTitle}>Foods you should not eat</h3>
        <ol className={styles.list}>
  {forbiddenFoods && forbiddenFoods.map((food, index) => (
    <li key={index} className={styles.listItem}>{food}</li>
  ))}
</ol>
      </div>
      <button className={styles.button}>Start losing weight</button>
    </div>
  );
};

export default DailyCalorieIntake;