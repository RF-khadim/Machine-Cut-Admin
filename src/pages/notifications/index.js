import { useState } from "react"
import Header from "../../components/header"
import Layout from "../../layout"
import './styles.css'
import * as Yup from 'yup'
import { useFormik } from "formik"


const schema = {
    machine_serial: "",
    single_notification_message: "",
    multiple_notification_message: "",
}


const Notifications = () => {

    const [initialValues,] = useState(schema)

    const validationSchema = Yup.object({
        machine_serial: Yup.string().required("*serial number is required"),
        single_notification_message: Yup.string().required("*message is required"),
        multiple_notification_message: Yup.string().required("*message is required")
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (data) => {
            console.log("data", data)
        }
    })

    const { values, errors, handleSubmit, handleChange } = formik

    return (
        <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Notifications" />}>

            <div className="notification-container">
                <div className="notification">
                    <h5>Notifications to one Machine</h5>
                    <div className="notification-detail">
                        <div className="d-flex j-btw" style={{ alignItems: "center" }}>
                            <div className="input-control">
                                <label>Machine Serial</label>
                                <input type="text" onChange={handleChange} value={values.machine_serial} name="machine_serial" placeholder="Enter machine serial" />
                                {
                                    errors.machine_serial &&
                                    <div className="error-message">{errors.machine_serial}</div>

                                }
                            </div>
                            <button className="send-not-btn" type="button" onClick={handleSubmit} >Send</button>
                        </div>
                        <div className="input-control" style={{ marginTop: "30px" }}>
                            <label>Message</label>
                            <textarea className="text-area" type="text" onChange={handleChange} name="single_notification_message" value={values.single_notification_message} placeholder="Type message" />
                            {
                                errors.single_notification_message &&
                                <div className="error-message">{errors.single_notification_message}</div>

                            }
                        </div>
                    </div>
                </div>
                <div className="notification" style={{ marginTop: "30px" }}>
                    <h5>Notifications to All Machine</h5>
                    <div className="notification-detail">
                        <div className="all-machine-notification">
                            <div className="input-control" style={{ width: "100%" }}>
                                <label>Message</label>
                                <textarea className="text-area" onChange={handleChange} style={{ width: "100%" }} value={values.multiple_notification_message} name="multiple_notification_message" type="text" placeholder="Type message" />
                                {
                                    errors.multiple_notification_message &&
                                    <div className="error-message">{errors.multiple_notification_message}</div>

                                }
                            </div>
                            <button style={{ width: "180px" }} type="button" onClick={handleSubmit}>Send</button>
                        </div>

                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default Notifications