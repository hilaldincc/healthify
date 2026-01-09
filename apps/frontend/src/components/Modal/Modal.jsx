import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/modal/modalSlice";
import { selectIsModalOpen } from "../../redux/modal/modalSelectors";
import styles from "./Modal.module.css";

export default function Modal({ children }) {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsModalOpen);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(closeModal());
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );
}
