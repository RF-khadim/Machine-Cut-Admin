import React, { useState } from "react";
import Layout from "../../layout";
import "./styles.css";
import { useMutation, useQuery } from "react-query";
import apiService from "../../services/apiService";
import { get } from "../../utils/storage";
import * as Yup from 'yup'
import Toastify from "../../components/toast";
import { ROLES } from "../../utils/constant";
import { useFormik } from 'formik'

const schema = {
  name: "",
  email: "",
  password: "",
  role: "",
  organization_name: "",
  profile_img: "",
  account_type: "",

};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("email  is required"),
  password: Yup.string(),
  role: Yup.string().required("role is required"),
  organization_name: Yup.string().required("organization is required"),
  profile_img: Yup.string().required("profile image is required"),
});

const Accounts = () => {

  const [initialValues, setInitialValues] = useState(schema);
  const [image, setImage] = useState("")

  const { refetch } = useQuery("getOwnProfile", () => apiService.getOwnProfile(), {
    enabled: !!get("token"),

    onSuccess: (data) => {
      setInitialValues({
        ...data,
        email:data?.user?.email,
        password:data?.user?.password
      })
    }

  })


  const updateUser = useMutation((data) => apiService.updateOwnProfile(data), {
    onSuccess: (data) => {
      console.log("data", data);
      Toastify("success", data?.message);
      setInitialValues(schema);
      refetch()

    },
    onError: (err) => {
      Toastify("error", err?.message);
    },
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {



      const formData = new FormData()

      console.log( Object.keys(values))

      Object.keys(values).forEach(k => {
        formData.append(k, values[k])
      })


      updateUser.mutate(formData);


    },
  });

  const { values, errors, handleChange, handleSubmit, setFieldValue } = formik;

console.log(errors)
  return (
    <Layout>
      <div className="account-header">
        <h2>Account</h2>

      </div>
      <div className="profile-container">

          <div className="input-control">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="error-message">{errors.name}</div>
            )}
          </div>
          <div className="input-control">
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={(values.email)}
              disabled
              onChange={handleChange}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          {/* <div className="input-control">
            <input
              type="text"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div> */}
          <div className="input-control">
            <select value={values.role} name="role" onChange={handleChange}>
              {
                ROLES.map(role => (
                  <option key={role} value={role} >
                    {
                      role
                    }
                  </option>
                ))
              }
            </select>

            {errors.role && (
              <div className="error-message">{errors.role}</div>
            )}
          </div>
          <div className="input-control">
            <input
              type="text"
              placeholder="Organization name"
              name="organization_name"
              value={values.organization_name}
              onChange={handleChange}
            />
            {errors.organization_name && (
              <div className="error-message">{errors.organization_name}</div>
            )}
          </div>
          <div className="input-control">
            <input
              type="text"
              placeholder="Account type"
              name="account_type"
              value={values.account_type}
              onChange={handleChange}
            />
            {errors.account_type && (
              <div className="error-message">{errors.account_type}</div>
            )}
          </div>
          <div className="input-control">
            <input
              type="file"
              placeholder="Profile Image"
              name="profile_img"
              onChange={(e) => {
                const file = e.target.files[0]
                setFieldValue("image", null)

                setFieldValue("profile_img", file)
                const reader = new FileReader();
                reader.onload = () => {
                  setImage(reader.result)

                };
                reader.readAsDataURL(file);
              }}
            />
            {errors.profile_img && (
              <div className="error-message">{errors.profile_img}</div>
            )}
          </div>
          <div className="input-control ">

            {
              values.profile_img &&
              <img src={ image ? image : values.profile_img} className="selected-image" alt="file" width={100} height={100} />
            }
          </div>

          <div className="input-control grid-one-by-2" >
            <button className="account-btn" type="button" onClick={handleSubmit}>
              {updateUser.isLoading || updateUser.isLoading ? "Please wait..." : "Submit"}
            </button>
          </div>
      </div>
    </Layout>
  );
};

export default Accounts;
