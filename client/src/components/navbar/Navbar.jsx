import React from "react";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";
import PropTypes from "prop-types";

import "./Navbar.css";

const Navbar = (props) => {
  const {
    showLogout = false,
    handleLogout,
    showMarkAllRead = false,
    handleMarkAllRead,
  } = props;
  const location = useLocation();
  return (
    <div className="navbar mb-3">
      <ul className="flex full-height">
        <li
          className={cx("mr-2 center-y full-height", {
            selected: location.pathname === "/admin",
          })}
        >
          <Link to="/admin">Admin</Link>
        </li>
        <li
          className={cx("mr-2 center-y full-height", {
            selected: location.pathname === "/user",
          })}
        >
          <Link to="/user">User</Link>
        </li>
        <li
          className={cx("mr-2 center-y full-height", {
            selected: location.pathname === "/alerts",
          })}
        >
          <Link to="/alerts">Alerts</Link>
        </li>
        {showLogout && (
          <li className="mr-2 center-y full-height cp" onClick={handleLogout}>
            Logout
          </li>
        )}
        {showMarkAllRead && (
          <li className="mr-2 center-y full-height cp" onClick={handleMarkAllRead}>
            Mark All Alerts as read
          </li>
        )}
      </ul>
    </div>
  );
};

Navbar.propTypes = {
  showLogout: PropTypes.bool,
  handleLogout: PropTypes.func,
  showMarkAllRead: PropTypes.bool,
  handleMarkAllRead: PropTypes.func,
};

export default Navbar;
