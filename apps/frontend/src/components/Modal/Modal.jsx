import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { closeModal } from "../../redux/modal/modalSlice";
import { selectIsModalOpen } from "../../redux/modal/modalSelectors";
import styles from "./Modal.module.css";
// İÇERİĞİ BURAYA IMPORT EDİYORUZ
import DailyCalorieIntake from "../DailyCalorieIntake/DailyCalorieIntake"; 

export default function Modal() { // children prop'una artık gerek yok
  const dispatch = useDispatch();
const isOpen = useSelector(selectIsModalOpen);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.code === "Escape") dispatch(closeModal());
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && dispatch(closeModal())}>
      <div className={styles.modal}>
        <button className={styles.backBtn} onClick={() => dispatch(closeModal())}> &#8592; </button>
        <button className={styles.closeBtn} onClick={() => dispatch(closeModal())}> &times; </button>

        <div className={styles.content}>
        
          <DailyCalorieIntake 
            calories={2800} 
            forbiddenFoods={["Flour products", "Milk", "Red meat", "Smoked meats"]} 
          />
        </div>
      </div>
    </div>
  );
}