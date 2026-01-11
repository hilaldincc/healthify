import React from 'react';
import css from './DailyCalorieIntake.module.css';
import {useNavigate} from 'react-router-dom';

const DailyCalorieIntake = ({ dailyRate, forbiddenFoods, onClose }) => {
    const navigate = useNavigate();

    const handleStartLosingWeight = () => {
        if (onClose) {
            onClose();
        }
        navigate('/login');
    };

    const hasForbiddenFoods = forbiddenFoods && forbiddenFoods.length > 0;

    return (
        <div className={css.intakeBody}> 

            <h2 className={`page-title ${css.intakeTitle}`}>Your recommended daily calorie intake is</h2> 
            
            {/* Kalori Değeri Bölümü */}
            <div className={css.rateBox}>
                <span className={`modal-calorie-text ${css.dailyRate}`}>{dailyRate}</span>
                <span className={css.unit}> kkal</span>
            </div>
            
            <hr className={css.divider} />

            {/* Yasaklı Yiyecekler Başlığı */}
            <h3 className={css.subtitle}>Foods you should not eat</h3>
            
            {/* Yiyecek Listesi */}
            <ol className={css.foodList}>
                {hasForbiddenFoods ? (
                    forbiddenFoods.map((food, index) => (
                        <li key={index} className={css.foodItem}>{food}</li>
                    ))
                ) : (
                    <li className={css.noFoodItem}>No forbidden foods for your blood type</li>
                )}
            </ol>

            <button 
                onClick={handleStartLosingWeight}
                className={`calculation-btn ${css.intakeButtonFix}`}
            >
                Start losing weight
            </button>
        </div>
    );
};

export default DailyCalorieIntake;