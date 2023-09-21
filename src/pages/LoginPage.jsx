import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import videoBg from "../assets/videoBg.mp4";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().email("Invalid email address").required("Required"),
      password: yup
        .string("Password must be string")
        .required("Password is required")
        .min(8, "Min length must be 8"),
    }),
    onSubmit: (values) => {
      setEmail(email);
      setPassword(password);
      if (
        values.email === "abbasovr455@gmail.com" &&
        values.password === "rustam2005"
      ) {
        navigate("/products");
      } else {
        toast.error("error");
      }
    },
  });

  console.log(formik.errors);
  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="main">
        <video src={videoBg} autoPlay loop muted />
      </div>
      <form
        className="container w-25 mt-4 form-bg"
        onSubmit={formik.handleSubmit}
      >
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="text-danger">{formik.errors.email}</p>
          ) : null}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="text-danger">{formik.errors.password}</p>
          ) : null}
        </div>

        <div className="form-group mb-3">
          <input value="Send" type="submit" className="btn btn-primary w-100" />
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
