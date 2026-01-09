import React, { useState } from "react";
import css from "./Header.module.css";
import { Link } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectUsername,
} from "../../redux/auth/authSelectors";
import { useSelector, useDispatch } from "react-redux";
import logoText from "../../assets/icons/logo-text.svg";
import logoIcon from "../../assets/icons/logo-icon.svg";
import menuIcon from "../../assets/icons/menu-icon.svg";
import closeIcon from "../../assets/icons/menu-close-icon.svg";
import { logOut } from "../../redux/auth/authOperations";

const Header = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const userName = useSelector(selectUsername);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logOut());
    closeMenu();
  };

  const userMenu = (
    <div className={css.userInfo}>
      <span className={css.userName}>{userName}</span>
      <div className={css.userSeparator}></div>
      <button type="button" onClick={handleLogout} className={css.exitBtn}>
        Exit
      </button>
    </div>
  );

  return (
    <header className={css.header}>
      <div className={css.headerWrapper}>
        {/* LOGO */}
        <Link to="/" className={css.logoContainer} onClick={closeMenu}>
          <img src={logoIcon} alt="Logo" className={css.logoIcon} />
          <img
            src={logoText}
            alt="SlimMom"
            className={`${css.logoText} ${
              !isLoggedIn ? css.logoTextSignedOut : ""
            }`}
          />
        </Link>
        <div className={css.logoSeparator}></div>
        {/* NAVİGASYON */}
        <div className={css.headerText}>
          {isLoggedIn ? (
            <>
              <div className={css.desktopNav}>
                <Link to="/diary" className="header-text">
                  DIARY
                </Link>
                <Link to="/calculator" className="header-text">
                  CALCULATOR
                </Link>
              </div>
              <div className={css.spacer}>
                <div className={css.desktopUserBar}>{userMenu}</div>

                <div className={css.hamburgerBtn} onClick={toggleMenu}>
                  <img src={isMenuOpen ? closeIcon : menuIcon} alt="Menu" />
                </div>
              </div>

              {isMenuOpen && (
                <div className={css.mobileMenuOverlay}>
                  <div className={css.mobileMenuContent}>
                    <Link
                      to="/diary"
                      className="navigation-text"
                      onClick={closeMenu}
                    >
                      DIARY
                    </Link>
                    <Link
                      to="/calculator"
                      className="navigation-text"
                      onClick={closeMenu}
                    >
                      CALCULATOR
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={css.authNav}>
              <Link to="/login" className="header-text">
                LOG IN
              </Link>
              <Link to="/register" className="header-text">
                REGISTRATION
              </Link>
            </div>
          )}
        </div>
      </div>
      {isLoggedIn && (
        <div className={css.mobileUserBar}>
          <div className={css.mobileUserContent}>{userMenu}</div>
        </div>
      )}
    </header>
  );
};

export default Header;