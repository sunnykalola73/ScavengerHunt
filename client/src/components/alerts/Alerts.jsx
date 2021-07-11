import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import _map from "lodash/map";
import cx from "classnames";

import Navbar from "../navbar";

import "./Alerts.css";

const BASE_PATH = "";

const Alerts = (props) => {
  const [user, setUser] = useState();
  const [alerts, setAlerts] = useState();

  useEffect(() => {
    async function fetchAlerts() {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        setUser(foundUser);
        const response = await axios.post(`${BASE_PATH}/user/alerts`, {
          userName: foundUser.userName,
        });
        console.log(response);
        console.log(response.data.alerts);
        setAlerts(response.data.alerts);
      }
    }
    fetchAlerts();
  }, []);

  const handleMarkAllRead = () => {
    async function markRead() {
      await axios.post(`${BASE_PATH}/user/alerts/markRead`, {
        userName: user.userName,
      });
      setAlerts((alerts) =>
        _map(alerts, (alert) => ({ ...alert, isRead: true }))
      );
    }
    markRead();
  };

  return (
    <div>
      <Navbar showMarkAllRead={user} handleMarkAllRead={handleMarkAllRead} />
      {user ? (
        <div>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Pincode</th>
              </tr>
            </thead>
            <tbody>
              {_map(alerts, (alert) => (
                <tr className={cx({ "alert-unread": !alert.isRead })}>
                  <td className="pr-1">{alert["name"]}</td>
                  <td className="pr-1">{alert["contactNo"]}</td>
                  <td className="pr-1">{alert["pincode"]}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>Please Login to latest alerts.</div>
      )}
    </div>
  );
};

export default Alerts;
