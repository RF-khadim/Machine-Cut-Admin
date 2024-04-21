import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="container">
      <div className="controls">
        <h3>Register</h3>
        <div className="input-control">
          <input
            type="text"
            placeholder="Enter your email address"
            id="email"
          />
        </div>
        <div className="input-control">
          <input type="text" placeholder="Enter your password" id="password" />
        </div>

        <div className="links">
          <Link to="/signup">Already have an account?</Link>

          <button type="button" id="login-btn">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
