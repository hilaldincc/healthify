import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Modal from "../../components/Modal/Modal";
const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
            <Modal />

    </div>
  );
};

export default Layout;