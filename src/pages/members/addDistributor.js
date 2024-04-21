
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
import ReactSelect from "../../components/select"


const schema = {
    parent: undefined,
    id: "",
    company_name: "",
    company_phone: null,
    email: "",
    address: "",
    secondary_address: "",
    city: "",
    country: "",
    zip: "",
    name: "",
    account_number: "",
    password: "",
    confirm_password: "",
    img: "",
    status: false
}

const AddDistributor = () => {

    const navigate = useNavigate()
    const params = useParams()
    const [initialValues, setInitialValues] = useState(schema)

    useQuery("getProfile", () => apiService.getProfile(params.id), {
        onSuccess: (data) => {
            console.log("data", data)
            setInitialValues({ ...data, email: data?.user?.email, password: data?.user?.password, confirm_password: data?.user?.password })

        },
        enabled: !!params.id
    })



    const { data: profiles } = useQuery("getProfiles", () => apiService.getProfiles())



    const validationSchema = Yup.object({

        parent: Yup.string().nullable(),
        id: Yup.string().required("*id is required"),
        company_name: Yup.string().required("*company name is required"),
        company_phone: Yup.number().required("*company phone is required"),
        email: Yup.string().email().required("*email is required"),
        address: Yup.string().required("*address is required"),
        secondary_address: Yup.string(),
        city: Yup.string().required("*city is required"),
        country: Yup.string().required("*country is required"),
        zip: Yup.string().required("*zip is required"),
        name: Yup.string().required("*name is required"),
        account_number: Yup.string().required("*account number is required"),
        password: Yup.string().required("*password is required"),
        status: Yup.boolean(),
        confirm_password: Yup.string().test('passwords-match', 'Passwords must match', function (value) { return this.parent.password === value }),

        img: Yup.string(),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (data) => {

            if(!data.parent){
                delete data.parent
            }

            data.role = "distributor"

            const formData = new FormData()

            Object.keys(data).forEach(k => {
                formData.append(k, data[k])
            })


            if (params.id) {

                editDistributorMutation.mutate(formData)
            } else {

                addDistributorMutation.mutate(formData)
            }
        }
    })

    const addDistributorMutation = useMutation((data) => apiService.register(data), {
        onSuccess: (data) => {
            Toastify("success", data?.message)
            navigate("/members")
        },
        onError: (error) => {
            Toastify("error", error?.message)

        }
    })
    const editDistributorMutation = useMutation((data) => apiService.updateOneProfile(data, params.id), {
        onSuccess: (data) => {
            Toastify("success", data?.message)
            navigate("/members")
        },
        onError: (error) => {
            Toastify("error", error?.message)

        }
    })

    const { values, errors, handleChange, handleSubmit, setFieldValue } = formik

    console.log(errors)

    return (
        <div className="dist-member-container">
            <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Member" />}>

                <div className="dist-container">
                    <div className="d-flex dist-heading">
                        <Link style={{ color: "blue" }} to="/members" >
                            Members {" "}
                        </Link>

                        <p>{params.id ? "Edit Distributor " : "Add Distributor"} </p>
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

                    <button className="right-btn" type="button" onClick={handleSubmit} >{addDistributorMutation.isLoading || editDistributorMutation.isLoading ? "Please wait..." : params.id ? "Update" : "Add"}</button>
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
                    <div className="member-type">
                        <div className="input-control" >
                            <lable>Parent Name</lable>
                            <ReactSelect
                            
                                setFieldValue={setFieldValue}
                                name="parent"
                                onChange={handleChange}
                                value={values.parent}
                                options={profiles?.map(p => ({
                                    value: p?._id,
                                    label: p?.name
                                }))}

                            />
                        </div>

                        <div className="input-control">
                            <label>ID</label>
                            <input type="text" name="id" value={values.id} onChange={handleChange} placeholder="Type ID" />
                            {
                                errors.id &&
                                <div className="error-message">{errors.id}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Company Name</label>
                            <input type="text" name="company_name" value={values.company_name} onChange={handleChange} placeholder="Enter Company Name" />
                            {
                                errors.company_name &&
                                <div className="error-message">{errors.company_name}</div>

                            }
                        </div>
                    </div>
                    <div className="add-dist">

                        <div className="input-control">
                            <label>Company Email</label>
                            <input type="email" disabled={params.id} name="email" value={values.email} onChange={handleChange} placeholder="Enter email" />
                            {
                                errors.email &&
                                <div className="error-message">{errors.email}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Company Telephone number</label>
                            <input type="text" name="company_phone" value={values.company_phone} onChange={handleChange} placeholder="Type Company Address" />
                            {
                                errors.company_phone &&
                                <div className="error-message">{errors.company_phone}</div>

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
                        <div className="input-control">
                            <label>User Name</label>
                            <input type="text" name="name" onChange={handleChange} value={values.name} placeholder="Type User Name" />
                            {
                                errors.name &&
                                <div className="error-message">{errors.name}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Account Number</label>
                            <input type="text" name="account_number" onChange={handleChange} value={values.account_number} placeholder="Type Account Number" />
                            {
                                errors.account_number &&
                                <div className="error-message">{errors.account_number}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Password</label>
                            <input type="password" disabled={params.id} name="password" onChange={handleChange} value={values.password} placeholder="Type Password" />
                            {
                                errors.password &&
                                <div className="error-message">{errors.password}</div>

                            }
                        </div>
                        <div className="input-control confirm-password">
                            <label>Confirm Password</label>
                            <input type="password" disabled={params.id} name="confirm_password" onChange={handleChange} value={values.confirm_password} placeholder="Type Confirm Password" />
                            {
                                errors.confirm_password &&
                                <div className="error-message">{errors.confirm_password}</div>

                            }
                        </div>


                    </div>

                </div>
            </Layout>
        </div>
    )
}

export default AddDistributor