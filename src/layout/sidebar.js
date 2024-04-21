import React, { useState } from "react";

import sidebar from "../assets/data/sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles.css";
import Logo from "../assets/images/logo.svg";
import GreaterThan from "../assets/images/greaterthan.png";


const Sidebar = () => {
  const navigate = useNavigate()
  const [hasMenu, setHasMenu] = useState("")
  return (
    <div className="sidebar-container">
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
          <NavLink
            className={`sidebar-links ${window.location.pathname === s.href || s?.menuLinks?.find(m=>m.href===(window.location.pathname))?.title ? "active" : ""
              }`}
            to={s.href}
            onMouseOver={() => {
              if (s.hasMenu && s.menuLinks.length > 0) {
                setHasMenu(s.title)
              }
            }}
          >
            <img alt={s.icon} src={s.icon} width={38} height={38} />
            {s.title}{" "}
            {s.hasMenu && <img src={GreaterThan}
              onMouseLeave={() => setHasMenu("")}
              onMouseOut={()=>setHasMenu("")}
              onMouseOver={() => setHasMenu(s.title)} className="greaterthan" width={20} height={20} alt="greaterthan" />}
            {
              s.hasMenu && hasMenu === s.title && (
                <div onMouseLeave={() => setHasMenu("")} className="sidebar-side-menu">
                  {
                    s.menuLinks?.map(subLink => (

                      <NavLink
                        className={`sidebar-links`}
                        to={subLink.href}
                      >{subLink.title}</NavLink>
                    ))
                  }
                </div>
              )
            }
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
