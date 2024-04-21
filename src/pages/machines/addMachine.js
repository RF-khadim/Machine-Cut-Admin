import { Link, useNavigate } from "react-router-dom"
import Header from "../../components/header"
import Layout from "../../layout"
import * as Yup from 'yup'
import { useFormik } from "formik"
import './styles.css'
import { useState } from "react"
import { useMutation } from "react-query"
import apiService from "../../services/apiService"
import Toastify from "../../components/toast"


const schema = {
    machine_name: "",
    machine_type: "",
    number_of_machines:0
}

const AddMachine = () => {

    const navigate = useNavigate()
    const [initialValues,] = useState(schema)

    const addMutation = useMutation((data) => apiService.addMachine(data), {
        onSuccess: (data) => {
            Toastify("success", data?.message)
            navigate("/machines")
        },
        onError: (error)=>{
            Toastify("error", error?.message)

        }
    })

    const validationSchema = Yup.object({
        machine_name: Yup.string().required("*machine name is required"),
        machine_type: Yup.string().required("*machine type is required"),
        number_of_machines: Yup.number().required("*machine number is required")
    })

    const formik = useFormik({
        initialValues,
        validationSchema,

        onSubmit: (data) => {
            console.log(data)
            addMutation.mutate(data)
        }
    })

    const { values, errors, handleChange, handleSubmit } = formik

    return (
        <div className="add-machine-container">
            <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Machine" />}>

                <div className="add-container">
                    <div className="d-flex add-heading">
                        <Link style={{ color: "blue" }} to="/machines" >
                            Machines {" "}
                        </Link>

                        <p> Add </p>
                    </div>
                </div>

                <div className="add-machine-detail-container">
                    <div className="add">
                        <div className="input-control">
                            <label>Machine Name</label>
                            <input type="text" value={values.machine_name} onChange={handleChange} name="machine_name" placeholder="Type Machine Name" />
                            {
                                errors.machine_name &&
                                <div className="error-message">{errors.machine_name}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Machine Type</label>
                            <input type="text" value={values.machine_type} onChange={handleChange} name="machine_type" placeholder="Type Machine Type" />
                            {
                                errors.machine_type &&
                                <div className="error-message">{errors.machine_type}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Number Of Machines</label>
                            <input type="number" value={values.number_of_machines} onChange={handleChange} name="number_of_machines" placeholder="Type Number Of Machines" />
                            {
                                errors.number_of_machines &&
                                <div className="error-message">{errors.number_of_machines}</div>

                            }
                        </div>
                        <button type="button" onClick={handleSubmit}>{addMutation.isLoading ? "Please wait...":"Add"}</button>
                    </div>
                </div>


                {/* <div className="add-machine-description-container" >
                    <div className="add">
                        <div className="input-control">
                            <label>Number Of Machines</label>
                            <input type="text" name="no_of_machines" values={values.no_of_machines} onChange={handleChange} placeholder="Enter number of Machines" />
                            {
                                errors.no_of_machines &&
                                <div className="error-message">{errors.no_of_machines}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Firmware Version</label>
                            <input type="text" name="firmware_version" value={values.firmware_version} onChange={handleChange} placeholder="Type Machine Type" />
                            {
                                errors.firmware_version &&
                                <div className="error-message">{errors.firmware_version}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Product Version</label>
                            <input type="text" name="product_version" value={values.product_version} placeholder="Type Machine Type" />
                            {
                                errors.product_version &&
                                <div className="error-message">{errors.product_version}</div>

                            }
                        </div>
                    </div>
                    <div className="add">
                        <div></div>
                        <div></div>
                        <button className="right-btn" type="button" onClick={handleSubmit} >Add</button>
                    </div>
                    <div className="input-control text-area-box">
                        <label>Improvements</label>
                        <textarea className="improvements-box" type="text" name="improvements" value={values.improvements} onChange={handleChange} placeholder="Enter number of Machines" />
                        {
                            errors.improvements &&
                            <div className="error-message">{errors.improvements}</div>

                        }
                    </div>
                </div> */}
            </Layout>
        </div>
    )
}

export default AddMachine