import React, { useState } from "react";
import Sidebar from "./sidebar";
import Logo from "../assets/images/logo.svg";
import User from '../assets/images/dummyUser.png'
import Hamburger from "../assets/images/hamburger.png";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import MobileSidebar from "./mobileSidebar";
import { clear } from "../utils/storage";

const Layout = ({ children, Header }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleLogout = () => {
    navigate("/login");
    clear();
  };

  return (
    <>
      {
        visible &&
        <MobileSidebar visible={visible} setVisible={setVisible} />
      }
      <div className="layout-container" style={{ display: `${visible ? "none" : "block"}` }}>
        <Sidebar />
        <section>
          {typeof Header === "function" && Header(setVisible, visible)}
          <div className="children">
            {children}
          </div>
        </section>
      </div>
    </>
  );
};

export default Layout;
