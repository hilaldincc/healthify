import React, { useEffect } from "react";
import css from "./Modal.module.css";

const BackArrowIcon = ({ className }) => (
  <svg
    className={className}
    width="15"
    height="9"
    viewBox="0 0 15 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.4142 1.20703V4.20703H1.41418M1.41418 4.20703L4.91418 0.707031M1.41418 4.20703L4.91418 7.70703"
      stroke="black"
      strokeWidth="2"
    />
  </svg>
);

const CloseXIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css.closeXIcon}
  >
    <g clipPath="url(#clip0_13001_132)">
      <path
        d="M15.8333 5.3415L14.6583 4.1665L9.99998 8.82484L5.34164 4.1665L4.16664 5.3415L8.82498 9.99984L4.16664 14.6582L5.34164 15.8332L9.99998 11.1748L14.6583 15.8332L15.8333 14.6582L11.175 9.99984L15.8333 5.3415Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_13001_132">
        <rect width="20" height="20" />
      </clipPath>
    </defs>
  </svg>
);

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modalWrapper}>
        {/* 1. Mobil Top Bar */}
        <div className={css.topBar}>
          <button className={css.closeButtonMobile} onClick={onClose}>
            <BackArrowIcon className={css.closeIcon} />
          </button>
        </div>

        {/* 2. Masaüstü Kapatma Butonu (Sadece masaüstünde sağ üstte görünür) */}
        <button className={css.closeButtonDesktop} onClick={onClose}>
          <CloseXIcon />
        </button>

        {/* Modalın içeriği (DailyCalorieIntake) */}
        <div className={css.modalContent}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;