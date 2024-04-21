import { Link, useNavigate, useParams } from "react-router-dom"
import Header from "../../components/header"
import Layout from "../../layout"
import * as Yup from 'yup'
import { useFormik } from "formik"
import './styles.css'
import { useState } from "react"
import { useMutation, useQuery } from "react-query"
import apiService from "../../services/apiService"
import Toastify from "../../components/toast"


const schema = {
    machine_name: "",
    machine_type: "",
 }

const EditMachine = () => {

    const navigate = useNavigate()
    const [initialValues,setInitialValues] = useState(schema)
    const params = useParams()


    useQuery("getMachine",()=>apiService.getMachine(params.id),{
        onSuccess:(data)=>{
            console.log("data",data)
            setInitialValues(data)
        }
    })

    const updateMutation = useMutation((data) => apiService.updateMachine(data,params.id), {
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
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize:true,
        onSubmit: (data) => {
            console.log(data)
            updateMutation.mutate(data)
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

                        <p> Edit </p>
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
                        <button type="button" onClick={handleSubmit}>{updateMutation.isLoading ? "Please wait...":"Update"}</button>
                    </div>
                </div>


               
            </Layout>
        </div>
    )
}

export default EditMachine