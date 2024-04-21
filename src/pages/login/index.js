import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Login, RequestLogin } from "../../redux/actions";
import { useNavigate } from "react-router-dom";

const initialValue = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const [initialValues] = useState(initialValue);
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.auth);
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().email().required("*email is required"),
    password: yup.string().required("*password is required"),
  });

  useEffect(() => {
    if (state?.user && !state?.error) {
      navigate("/");
    }
  }, [state, navigate]);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(RequestLogin());
      dispatch(Login(values));
      console.log(values);
    },
  });

  const { values, errors, handleChange, handleSubmit } = formik || {};

  console.log(errors, values);
  return (
    <div className="container">
      <div className="controls">
        <h3>Login</h3>
        <div className="login-input-control">
          <input
            type="text"
            name="email"
            value={values.email}
            placeholder="Enter your email address"
            id="email"
            onChange={handleChange}
          />
          <br />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>
        <div className="login-input-control">
          <input
            type="password"
            value={values.password}
            onChange={handleChange}
            name="password"
            placeholder="Enter your password"
            id="password"

          />
          <br />
          {errors.password && (
            <small className="error">{errors.password}</small>
          )}
        </div>
        {state?.error && (
          <small
            className="error"
            style={{ display: `${state.error ? "block" : "none"} ` }}
          >
            {state?.error}
          </small>
        )}
        <div className="links">
          <button onClick={handleSubmit} type="submit" id="login-btn">
            {state?.loading ? "Please wait ..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
