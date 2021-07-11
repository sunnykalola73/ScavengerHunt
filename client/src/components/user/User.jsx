import React, { useState } from "react";
import _map from "lodash/map";
import { InputGroup, FormControl, Button, Alert, Table } from "react-bootstrap";
import axios from "axios";
import _isEmpty from "lodash/isEmpty";

import Navbar from "../navbar";

import { parseData } from "./helper";

import "./User.css";

const PINCODE_REGEX = /^\d{6}$/;

const BASE_PATH = "";

const User = (props) => {
  const [pincode, setPincode] = useState();
  const [error, setError] = useState("");
  const [items, setItems] = useState();
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");

  console.log(items);

  const handleSubmit = () => {
    if (!PINCODE_REGEX.test(pincode)) {
      setError("Please enter proper 6 digit pincode");
      setItems(null);
    } else if (_isEmpty(name)) {
      setError("Please enter your name");
    } else if (_isEmpty(contactNo)) {
      setError("Please enter your contact number");
    } else {
      axios
        .post(`${BASE_PATH}/branch-detail`, { pincode, contactNo, name })
        .then((response) => {
          setItems(parseData(response.data.result));
        })
        .catch((e) => {
          setError("Bad Bad luck, No dounut for you!!");
        });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="user-form">
        {error && <Alert variant="danger">{error}</Alert>}
        <InputGroup className="mb-3" required={true}>
          <FormControl
            placeholder="Name"
            aria-label="name"
            aria-describedby="basic-addon1"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                handleSubmit();
              }
            }}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Contact Number"
            aria-label="contact number"
            aria-describedby="basic-addon1"
            value={contactNo}
            onChange={(e) => {
              setContactNo(e.target.value);
              setError("");
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                handleSubmit();
              }
            }}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Pincode"
            aria-label="pincode"
            aria-describedby="basic-addon1"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value);
              setError("");
            }}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                handleSubmit();
              }
            }}
          />
        </InputGroup>
        <Button
          as="input"
          type="submit"
          value="Submit"
          disabled={!name || !contactNo || !pincode}
          onClick={handleSubmit}
        />{" "}
      </div>
      {items && (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Insitution Name</th>
              <th>Branch Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Contact Number</th>
              <th>Branch Incharge</th>
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
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default User;
