import Layout from "../../layout";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import "./styles.css";
import Modal from "../../components/modal";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import apiService from "../../services/apiService";
import Toastify from "../../components/toast";
import { Table } from "antd";
import Edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import ConfirmationModal from "../../components/modal/confirmationModal";
import "./styles.css";
import { ROLES } from "../../utils/constant";

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
  password: Yup.string().required("password is required"),
  role: Yup.string().required("role is required"),
  organization_name: Yup.string(),
  profile_img: Yup.string().required("profile image is required"),
});
const Users = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false)
  const [, setImage] = useState(null)
  const [initialValues, setInitialValues] = useState(schema);
  const [id, setId] = useState("")

  const { data, isLoading: loadingUsers, refetch } = useQuery("getUser", () =>
    apiService.getUsers()
  );

  const addUser = useMutation((data) => apiService.addUser(data), {
    onSuccess: (data) => {
      Toastify("success", data?.message);
      setIsOpen(false);
      setId("")
      setInitialValues(schema);
      refetch()
    },
    onError: (err) => {
      Toastify("error", err?.message);
    },
  });
  const updateUser = useMutation((data) => apiService.updateParticularUser(data, id), {
    onSuccess: (data) => {
      console.log("data", data);
      Toastify("success", data?.message);
      setIsOpen(false);
      setId("")
      setInitialValues(schema);
      refetch()

    },
    onError: (err) => {
      Toastify("error", err?.message);
    },
  });
  // 
  const deleteUser = useMutation(() => apiService.deleteParticularUser(id), {
    onSuccess: (data) => {
      Toastify("success", data?.message);
      setIsOpen(false);
      setIsDelete(false)
      setId("")
      // 
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


      delete values.image
      delete values.profile
      delete values._id

      const formData = new FormData()

      Object.keys(values).forEach(k => {
        formData.append(k, values[k])
      })



      if (id) {
        updateUser.mutate(formData);
      } else {

        addUser.mutate(formData);
      }

    },
  });



  useEffect(() => {
    if (!isOpen) {
      setInitialValues(schema)
    }
  }, [isOpen])

  const { values, errors, handleChange, handleSubmit, setFieldValue } = formik;

  const columns = [
    { title: "Name", dataIndex: ["profile", "name"], key: "name" },
    {
      title: "Email", dataIndex: "email", key: "email",
    },

    { title: "Organization Name", dataIndex: ["profile", "organization_name"], key: "organization_name" },
    { title: "Role", dataIndex: ["profile", "role"], key: "role" },
    {
      title: "Profile Image", dataIndex: ["profile", "profile_img"], key: "profile_img", render: (data) => {
        return (
          <img src={data} alt="profileimage" width={50} height={50} />
        )
      }
    },
    { title: "Account Type", dataIndex: ["profile", "account_type"], key: "account_type" }, {
      title: "Edit",
      render: (data, row) => {
        return (
          <>
            <img
              src={Edit}
              onClick={() => {
                setId(row?.profile?._id)

                setInitialValues({
                  ...row,
                  name: row?.profile?.name,
                  role: row?.profile?.role,
                  profile_img: row?.profile?.profile_img
                });
                setIsOpen(true);
              }}
              width={20}
              height={20}
              alt="edit"
            />
          </>
        );
      },
    },
    {
      title: "Delete",
      render: (data, row) => {
        return (
          <>
            <img src={Delete} width={20} onClick={() => {
              setId(row?.profile?._id)
              setIsDelete(true)
            }} height={20} alt="delete" />
          </>
        );
      },
    },
  ];


  const handleYes = () => {
    deleteUser.mutate({
      _id: id
    })
  }

  return (
    <Layout>

      <ConfirmationModal yesTitle={deleteUser.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this user?" yesClick={handleYes} noClick={() => setIsDelete(false)} />
      <Modal
        label="Add User"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={
          <div className="user-modal-content">

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
                onChange={handleChange}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="input-control">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
            </div>
            <div className="input-control">
              <select value={values.role} name="role" onChange={handleChange}>
                <option selected> Select role </option>
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
              <button className="add-user-btn" type="button" onClick={handleSubmit}>
                {addUser.isLoading || updateUser.isLoading ? "Please wait..." : "Submit"}
              </button>
            </div>
          </div>
        }
      />
      <div className="user-header">
        <h2>User</h2>
        <button className="add-user-btn" onClick={() => setIsOpen(true)}>Add User</button>
      </div>

      <Table
        scroll={{ x: "100%" }}

        dataSource={Array.isArray(data) && data?.length>0 ? data :[]} columns={columns} loading={loadingUsers} />;

    </Layout>
  );
};

export default Users;
