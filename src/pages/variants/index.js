import { Table } from "antd"
import Header from "../../components/header"
import Layout from "../../layout"
import { useState } from "react";
import './styles.css'
import Modal from "../../components/modal";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import apiService from "../../services/apiService";
import Toastify from "../../components/toast";
import Edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import ConfirmationModal from "../../components/modal/confirmationModal";
import UpdateVariant from "./updateVariant";

const schema = {
    name: ""
}



const Variants = () => {
    const [id, setId] = useState("");
    const [deleteId,setDeleteId] = useState("")
    const [initialValues, setInitialValues] = useState(schema)
    const [isDelete, setIsDelete] = useState(false)


    const { data: allVariants, isLoading: loadingVariants, refetch: refetchVariants } = useQuery(["getAllVariants"], () => apiService.getVariants())

    const addVariantMutation = useMutation((data) => apiService.addVariant(data), {
        onSuccess: (data) => {
            setIsOpen(false)
            Toastify("success", data?.message)
            setInitialValues(schema)
            refetchVariants()
        },
        onError: (data) => {
            Toastify("success", data?.message)
        }
    })
    const updateVariantMutation = useMutation((data) => apiService.updateVariant(data), {
        onSuccess: (data) => {
            setIsOpen(false)
            Toastify("success", data?.message)
            refetchVariants()
        
        },
        onError: (data) => {
            Toastify("success", data?.message)
        }
    })


    const deleteVariant = useMutation("delete variant", (data) => apiService.deleteVariant(data), {
        onSuccess: (data) => {
            setIsDelete(false)
            Toastify("success", data?.message)
            refetchVariants()
        },
        onError: (data) => {
            Toastify("success", data?.message)
        }
    })

    const validationSchema = Yup.object({
        name: Yup.string().required("*name is required")
    })

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (data,{resetForm}) => {

            if (id) {
                updateVariantMutation.mutate({...data,_id:id},{
                    onSuccess:()=>{
                        resetForm()
                        setId("")
                    }
                })
            } else {
                addVariantMutation.mutate(data,{
                    onSuccess:()=>{
                        resetForm()
                    }
                })
            }

        }
    })

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Property Values",
            dataIndex: "values",
            render: (data) => {
                return (
                    <div>
                        {data?.map((d,index) => (
                            <span>{d?.name}
                            {index !== data?.length - 1 && "," }
                            </span>
                        ))}
                    </div>
                )
            }
        },
        {
            title: "Variant Image",
            dataIndex: "image",
            render: (data,row) => {
                return (
                    <img src={row?.values[0]?.image && row?.values[0]?.image} alt="variant" width={30} height={30} />
                )
            }
        },
        {
            title: "Edit",
            render: (data, row) => {
                return (
                    <>
                        <img
                            src={Edit}
                            onClick={() => {
                                setId(row?._id)
                                setInitialValues(row);
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
                            setDeleteId(row?._id)
                            setIsDelete(true)
                        }} height={20} alt="delete" />
                    </>
                );
            },
        },

    ]

    const { values, errors, handleChange, handleSubmit } = formik

    const [isOpen, setIsOpen] = useState(false);

    const handleYes = () => {
        deleteVariant.mutate({
            _id: deleteId
        })
    }

    return (
        <Layout Header={( setVisible,visible) => <Header title="Variants" setVisible={setVisible} visible={visible} />}>
            <ConfirmationModal yesTitle={deleteVariant.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this material?" yesClick={handleYes} noClick={() => setIsDelete(false)} />

            {
                 !id &&
                <div className="variant-header">
                    <h2>Variants</h2>
                    <button onClick={() => setIsOpen(true)} className="add-variant-btn">
                        Add Variant
                    </button>
                </div>
            }
            <Modal
                content={<div className="variant-modal">
                    <div className="input-control">
                        <label >Name</label>
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
                    <button type="button" onClick={handleSubmit}>Add Variant</button>
                </div>}
                isOpen={isOpen}
                label='Variant'
                setIsOpen={setIsOpen}

            />

            {
                !id  &&
                <Table
                    dataSource={Array.isArray(allVariants) && allVariants.length > 0 ? allVariants : []}
                    scroll={{ x: "100%" }}
                    style={{ marginTop: "30px" }}
                    columns={columns} loading={loadingVariants}
                />
            }
            {
                id && !isDelete && <UpdateVariant refetchVariants={refetchVariants} allVariants={allVariants} formik={formik} setId={setId} isEdit={id} setIsOpen={setIsOpen} title={id ? "Update" : "Save"} />
            }
        </Layout>
    )
}

export default Variants