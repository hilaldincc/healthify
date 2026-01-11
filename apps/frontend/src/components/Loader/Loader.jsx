import React from "react";
import styles from "./Loader.module.css";

const Loader = ({ size = 40, color = "#fc842d", full = false }) => {
//Full page için
  if (full) {
    return (
      <div className={styles.fullOverlay}>
        <div
          className={styles.loader}
          style={{
            width: size,
            height: size,
            borderColor: `${color}30`,
            borderTopColor: color,
          }}
        />
      </div>
    );
  }
 //Inner kısım için
  return (
    <div
      className={styles.loader}
      style={{
        width: size,
        height: size,
        borderColor: `${color}30`,
        borderTopColor: color,
      }}
    />
  );
};

export default Loader;