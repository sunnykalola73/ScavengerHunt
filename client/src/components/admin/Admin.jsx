import React, { useState, useEffect } from "react";
import _map from "lodash/map";
import { Table, InputGroup, FormControl, Button } from "react-bootstrap";
import axios from "axios";

import Navbar from "../navbar";

import { parseData } from "./helper";

import "bootstrap/dist/css/bootstrap.css";
import "./Admin.css";

const BASE_PATH = "";

const Admin = (props) => {
  const [items, setItems] = useState();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const bankDetail = localStorage.getItem("bankDetail");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setItems(parseData(JSON.parse(bankDetail)));
      setUser(foundUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { userName, password };
    if (userName && password) {
      const response = await axios.post(`${BASE_PATH}/user/authentication`, user);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("bankDetail", JSON.stringify(response.data.results));
      console.log(response);
      console.log(parseData(response.data.results));
      setItems(parseData(response.data.results));
    }
  };

  const handleLogout = () => {
    setUser();
    setUserName("");
    setPassword("");
    localStorage.clear();
  };

  // Address: "Platform Number 9 3/4 "
  // Branch Incharge: "Mr Kung fu Pandey"
  // Branch Name: "Badlapur"
  // City: "Pasadena"
  // Contact Number: "9831670869, 24896229"
  // Insitution Name: "Beetle Nut"
  // Pincode covered: "700018, 700024, 700044, 700066"

  return (
    <div>
      <Navbar showLogout={!!user} handleLogout={handleLogout} />
      {user ? (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Insitution Name</th>
              <th>Branch Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Contact Number</th>
              <th>Branch Incharge</th>
              <th>Pincode covered</th>
            </tr>
          </thead>
          <tbody>
            {_map(items, (item) => (
              <tr>
                <td className="pr-1">{item["insitutionName"]}</td>
                <td className="pr-1">{item["branchName"]}</td>
                <td className="pr-1">{item["address"]}</td>
                <td className="pr-1">{item["city"]}</td>
                <td className="pr-1">{item["contactNo"].join(" , ")}</td>
                <td className="pr-1">{item["branchIncharge"]}</td>
                <td className="pr-1">{item["pincode"].join(" , ")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="admin-form">
          <div>Login</div>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="username"
              aria-label="username"
              aria-describedby="basic-addon1"
              value={userName}
              onChange={(e) => {
                console.log(e.target.value);
                setUserName(e.target.value);
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="password"
              aria-label="password"
              aria-describedby="basic-addon1"
              type="password"
              value={password}
              onChange={(e) => {
                console.log(e.target.value);
                setPassword(e.target.value);
              }}
            />
          </InputGroup>
          <Button
            as="input"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
            disabled={!userName || !password}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default Admin;
