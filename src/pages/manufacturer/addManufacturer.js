
import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "../../components/header"
import Layout from "../../layout"
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import * as Yup from 'yup'
import { useFormik } from "formik"
import './styles.css'
import { useState } from "react"
import { useMutation, useQuery } from "react-query"
import apiService from "../../services/apiService"
import Toastify from "../../components/toast"


const schema = {
    email: "",
    address: "",
    secondary_address: "",
    city: "",
    country: "",
    zip: "",
    phone:null,
    name: "",
}

const AddManufacturer = () => {

    const navigate = useNavigate()
    const params = useParams()
    const [initialValues, setInitialValues] = useState(schema)

    useQuery("getManufacturer", () => apiService.getManufacturer(params.id), {
        onSuccess: (data) => {
            console.log("data", data)
            setInitialValues({ ...data, email: data?.user?.email, password: data?.user?.password, confirm_password: data?.user?.password })

        },
        enabled: !!params.id
    })






    const validationSchema = Yup.object({

        email: Yup.string().email().required("*email is required"),
        address: Yup.string().required("*address is required"),
        secondary_address: Yup.string(),
        city: Yup.string().required("*city is required"),
        country: Yup.string().required("*country is required"),
        zip: Yup.string().required("*zip is required"),
        name: Yup.string().required("*name is required"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {

            console.log("data",data)
            if (params.id) {

                editManufactureMutation.mutate(data)
            } else {

                console.log("data",data)
                addManufacutureMutation.mutate(data)
            }
        }
    })

    const addManufacutureMutation = useMutation((data) => apiService.addManufacturer(data), {
        onSuccess: (data) => {
            Toastify("success", data?.message)
            navigate("/manufacturer")
        },
        onError: (error) => {
            Toastify("error", error?.message)

        }
    })
    const editManufactureMutation = useMutation((data) => apiService.updateManufacturer(data, params.id), {
        onSuccess: (data) => {
            Toastify("success", data?.message)
            navigate("/manufacturer")
        },
        onError: (error) => {
            Toastify("error", error?.message)

        }
    })

    const { values, errors, handleChange, handleSubmit } = formik

    return (
        <div className="dist-member-container">
            <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Manufacturer" />}>

                <div className="dist-container">
                    <div className="d-flex dist-heading">
                        <Link style={{ color: "blue" }} to="/manufacturer" >
                            Manufacturer {" "}
                        </Link>

                        <p>{params.id ? "Edit Manufacturer " : "Add Manufacturer"} </p>
                    </div>
                </div>


                <div className="dist-container d-flex" style={{ alignItems: "center", gap: "50px" }} >
                    <p>{params.id && values.company_name} </p>
                    {
                        params.id &&
                        <span className="bg-primary" style={{ padding: "0px 10px", borderRadius: "5px", color: "white" }}>{values.status ? "Active" : "In Active"}</span>
                    }
                </div>



                <div className="add-btn" style={{ gap: "20px" }} >
                    <div></div>

                    <button className="right-btn" type="button" onClick={handleSubmit} >{addManufacutureMutation.isLoading || editManufactureMutation.isLoading ? "Please wait..." : params.id ? "Update" : "Add"}</button>
                    {
                        params.id &&
                        <div className='profile-toggler'>
                            <label>ACTIVE ON/OFF</label>
                            <Toggle
                                icons={false}
                                name="status"
                                onChange={handleChange}
                                checked={values.status}
                                value={values.status}
                                defaultValue={values.status}
                                defaultChecked={values.status}
                            />
                        </div>
                    }
                </div>

                <div className="dist-member-desc-container" >
                    
                    <div className="add-dist">

                        <div className="input-control">
                            <label>Manufacturer Name</label>
                            <input type="text" disabled={params.id} name="name" value={values.name} onChange={handleChange} placeholder="Enter manufacturer name" />
                            {
                                errors.name &&
                                <div className="error-message">{errors.name}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Manufacturer Email</label>
                            <input type="email" disabled={params.id} name="email" value={values.email} onChange={handleChange} placeholder="Enter manufacturer email" />
                            {
                                errors.email &&
                                <div className="error-message">{errors.email}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Manufacturer Telephone number</label>
                            <input type="number" name="company_phone" value={values.phone} onChange={handleChange} placeholder="Type manufacturer number" />
                            {
                                errors.phone &&
                                <div className="error-message">{errors.phone}</div>

                            }
                        </div>

                        <div className="input-control">
                            <label>Address Line 1</label>
                            <input type="text" name="address" onChange={handleChange} value={values.address} placeholder="Type Company Address" />
                            {
                                errors.address &&
                                <div className="error-message">{errors.address}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Address Line 2</label>
                            <input type="text" name="secondary_address" onChange={handleChange} value={values.secondary_address} placeholder="Type Company Address" />
                            {
                                errors.secondary_address &&
                                <div className="error-message">{errors.secondary_address}</div>

                            }
                        </div>


                        <div className="input-control">
                            <label>City</label>
                            <input type="text" name="city" onChange={handleChange} value={values.city} placeholder="Type City" />
                            {
                                errors.city &&
                                <div className="error-message">{errors.city}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>country</label>
                            <input type="text" name="country" onChange={handleChange} value={values.country} placeholder="Type Country" />
                            {
                                errors.country &&
                                <div className="error-message">{errors.country}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Zip Code</label>
                            <input type="text" name="zip" onChange={handleChange} value={values.zip} placeholder="Type Zip" />
                            {
                                errors.zip &&
                                <div className="error-message">{errors.zip}</div>

                            }
                        </div>
                      


                    </div>

                </div>
            </Layout>
        </div>
    )
}

export default AddManufacturer