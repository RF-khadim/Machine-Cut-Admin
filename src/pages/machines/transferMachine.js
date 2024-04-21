import { Link } from "react-router-dom"
import Header from "../../components/header"
import Layout from "../../layout"
import * as Yup from 'yup'
import { useFormik } from "formik"
import './styles.css'
import { useState } from "react"


const schema = {
    machine_serial: "",
    service_point: "",
}

const TransferMachine = () => {

    const [initialValues,] = useState(schema)

    const validationSchema = Yup.object({
        machine_serial: Yup.string().required("*machine serial is required"),
        service_point: Yup.string().required("*service point is required"),
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (data) => {
            console.log(data)
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

                        <p> Transfer Machine </p>
                    </div>
                </div>

                <div className="add-machine-detail-container">
                    <div className="add">
                        <div className="input-control">
                            <label>Machine Serial</label>
                            <input type="text" value={values.machine_serial} onChange={handleChange} name="machine_serial" placeholder="Search Machine" />
                            {
                                errors.machine_serial &&
                                <div className="error-message">{errors.machine_serial}</div>

                            }
                        </div>
                        <div className="input-control">
                            <label>Service Point</label>
                            <input type="text" value={values.service_point} onChange={handleChange} name="service_point" placeholder="Search Service Point" />
                            {
                                errors.service_point &&
                                <div className="error-message">{errors.service_point}</div>

                            }
                        </div>
                        <button type="button" onClick={handleSubmit}>Transfer</button>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default TransferMachine