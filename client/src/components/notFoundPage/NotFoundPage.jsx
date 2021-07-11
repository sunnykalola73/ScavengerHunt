import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = (props) => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <li className="mr-2 center-y full-height">
        <Link to="/">Go To Home Page</Link>
      </li>
    </div>
  );
};

export default NotFoundPage;
