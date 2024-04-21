import React, { useState } from "react";

import sidebar from "../assets/data/sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.css";
import Logo from "../assets/images/logo.svg";
import Close from "../assets/images/close-img.png";
import GreaterThan from "../assets/images/greaterthan.png";



const MobileSidebar = ({ setVisible }) => {
  const navigate = useNavigate()
  const [hasMenu, setHasMenu] = useState("")

  return (
    <div className="mobile-sidebar-container">
      <img src={Close} onClick={() => setVisible(false)} className="close" alt="close" width={50} height={50} />
      <div className="logo-container">
        <img
          src={Logo}
          onClick={() => navigate("/")}
          alt="logo"
          className="logo"
          width={200}
          height={150}
        />
      </div>
      <div className="sidebar-links-container">
        {sidebar.map((s) => (
          <>
            <NavLink
              className={`sidebar-links ${window.location.pathname === s.href || s?.menuLinks?.find(m => m.href === (window.location.pathname))?.title ? "active" : ""
                }`}
              to={s.href}
              style={{
                display: "flex",
                justifyContent: "space-between"
              }}
              onClick={() => {
                if (hasMenu) {
                  setHasMenu("")
                } else {

                  setHasMenu(s.title)
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <img alt={s.icon} src={s.icon} width={38} height={38} />
                {s.title}{" "}
              </div>
              <div >

                {s.hasMenu && <img src={GreaterThan}
                  className="greaterthan" width={20} height={20} alt="greaterthan" />}

              </div>
            </NavLink>
            {
              s?.hasMenu && hasMenu === s.title && s.menuLinks?.map(m => (
                <NavLink
                  to={m.href}
                  className="menuLinks"
                >
                  {
                    m.title
                  }
                </NavLink>
              ))
            }
          </>
        ))
        }
      </div >
    </div >
  );
};

export default MobileSidebar;
