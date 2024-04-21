import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "../../components/header"
import Layout from "../../layout"
import * as Yup from 'yup'
import { useFormik } from "formik"
import './styles.css'
import { useRef, useState } from "react"
import { useMutation, useQuery } from "react-query"
import apiService from "../../services/apiService"
import Toastify from "../../components/toast"
import Delete from '../../assets/images/delete.png'
import ReactSelect from "../../components/select"


const schema = {
    machine_name: "",
    machine_type: "",
    no_of_machines: null,
    firmware_version: "",
    product_version: "",
    improvements: "",
    file: null,
    file_name: ""
}

const Firmware = () => {

    const navigate = useNavigate()
    const [initialValues,] = useState(schema)
    const fileRef = useRef(null)


    const { data: machines } = useQuery("getMachines", () => apiService.getMachines())

    console.log(machines)



    const addFirmwareMutation = useMutation((data) => apiService.addFirmwareIntoMachine(data, machines?.find(m => m?.machine_name === values?.machine_name)?._id), {
        onSuccess: (data) => {
            Toastify("success", data?.message)
            navigate("/machines")
        },
        onError: (error) => {
            Toastify("error", error?.message)

        }
    })

    const validationSchema = Yup.object({

        no_of_machines: Yup.number().required("*no of machines is required"),
        machine_name: Yup.string().required("*machine name is required"),
        machine_type: Yup.string().required("*machine type is required"),
        firmware_version: Yup.string().required("*firmware version is required"),
        product_version: Yup.string().required("*product version is required"),
        improvements: Yup.string().required("*improvements is required")
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (data) => {
            const formData = new FormData()

            Object.keys(data).forEach(k => {
                formData.append(k, data[k])
            })



            addFirmwareMutation.mutate(formData)
        }
    })


    const { values, errors, handleChange, handleSubmit, setFieldValue } = formik

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFieldValue("file", file)
        setFieldValue("file_name", file.name)
    }


    return (
        <div className="add-machine-container">
            <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Machine" />}>

                <div className="add-container">
                    <div className="d-flex add-heading">
                        <Link style={{ color: "blue" }} to="/machines" >
                            Machines {" "}
                        </Link>

                        <p> Firmware </p>
                    </div>
                </div>



                <div className="add-machine-description-container" >
                    <div className="machine-name-type">
                        <div className="input-control">
                            <lable>Machine Name</lable>
                            <ReactSelect
                                setFieldValue={setFieldValue}
                                name="machine_name"
                                onChange={handleChange}
                                value={values.machine_name}
                                options={machines?.map(p => ({
                                    value: p?.machine_name,
                                    label: p?.machine_name
                                }))}

                            />
                        </div>
                        <div className="input-control">
                            <lable>Machine Type</lable>
                            <ReactSelect
                                disabled={!values.machine_name}
                                setFieldValue={setFieldValue}
                                name="machine_type"
                                onChange={handleChange}
                                value={values.machine_type}
                                options={machines?.filter(m => m?.machine_name === values.machine_name)?.map(p => ({
                                    value: p?.machine_type,
                                    label: p?.machine_type
                                }))}

                            />
                        </div>
                    </div>
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
                            <input type="text" name="firmware_version" value={values.firmware_version} onChange={handleChange} placeholder="Type Firmware Version" />
                            {
                                errors.firmware_version &&
                                <div className="error-message">{errors.firmware_version}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Product Version</label>
                            <input type="text" name="product_version" onChange={handleChange} value={values.product_version} placeholder="Type Product Version" />
                            {
                                errors.product_version &&
                                <div className="error-message">{errors.product_version}</div>

                            }
                        </div>
                        <div className="firmware-file">
                            <h4>Firmware File</h4>
                            <div className="f-file">
                                <p>{values.file_name}</p>
                                <img style={{ cursor: 'pointer' }} onClick={() => {
                                    setFieldValue("file", null);
                                    setFieldValue("file_name", "");
                                }} src={Delete} height={25} width={25} alt="delete-file" />
                            </div>
                            <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
                            <button onClick={() => fileRef.current.click()}>Upload</button>
                        </div>
                    </div>
                    <div className="add">
                        <div></div>
                        <div></div>
                        <button className="right-btn" type="button" onClick={handleSubmit} >{addFirmwareMutation.isLoading ? "Please wait..." : "Add"}</button>
                    </div>
                    <div className="input-control text-area-box">
                        <label>Improvements</label>
                        <textarea className="improvements-box" type="text" name="improvements" value={values.improvements} onChange={handleChange} placeholder="Enter number of Machines" />
                        {
                            errors.improvements &&
                            <div className="error-message">{errors.improvements}</div>

                        }
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default Firmware
