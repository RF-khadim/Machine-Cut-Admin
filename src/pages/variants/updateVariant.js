
import BackArrow from '../../assets/images/backArrow.png'
import SearchIcon from '../../assets/images/search.png'
import Delete from "../../assets/images/delete.png";
import { Table } from 'antd';
import { useMutation } from 'react-query';
import apiService from '../../services/apiService';
import Toastify from '../../components/toast';
import { useState } from 'react';
import Modal from '../../components/modal';
import *  as Yup from 'yup'
import Edit from "../../assets/images/edit.png";
import ConfirmationModal from "../../components/modal/confirmationModal";
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useRef } from 'react';
import { ChromePicker } from 'react-color';

const schema = {
    name: "",
    color: "",
    position: "",
    image: null

}

const UpdateVariant = ({ formik, setIsOpen, isEdit, title, allVariants, setId, refetchVariants }) => {
    const { values, errors, handleChange } = formik || {};
    const [isDelete, setIsDelete] = useState(false)
    const imageRef = useRef()
    const [valueId, setValueId] = useState("")
    const [search, setSearch] = useState("")
    const [initialValues, setInitialValues] = useState(schema)
    const [openVariant, setOpenVariant] = useState(false)

    const addVariant = useMutation((data) => apiService.addVariantValues({ ...data, _id: isEdit }), {
        onSuccess: (data) => {
            setOpenVariant(false)
            refetchVariants()
            Toastify("success", data?.message)
            setInitialValues(schema)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })

    useEffect(() => {
        if (!openVariant) {
            setInitialValues(schema)
        }
    }, [openVariant])

    const updateVariant = useMutation((data) => apiService.updateVariantValues({ ...data, _id: isEdit }), {
        onSuccess: (data) => {
            setOpenVariant(false)
            setValueId("")
            refetchVariants()
            Toastify("success", data?.message)
            setInitialValues(schema)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })
    const deleteVariantValue = useMutation((data) => apiService.deleteVariantValue(data), {
        onSuccess: (data) => {
            setIsDelete(false)
            refetchVariants()
            setValueId("")
            Toastify("success", data?.message)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })


    const validationSchema = Yup.object({
        name: Yup.string().required("*name is required"),
        // color: Yup.string().required("*color is required"),
        // position: Yup.number().required("*position is required")
    })


    const variantFormik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (data, { resetForm }) => {
            console.log(data)
            if (valueId) {
                updateVariant.mutate(
                    { ...data, value_id: valueId },
                    {
                        onSuccess: (data) => {
                            resetForm()
                        }
                    }
                )
            } else {
                addVariant.mutate({ values: data }, {
                    onSuccess: (data) => {
                        resetForm()
                    }
                })

            }
        }
    })


    const { values: variantValues, errors: variantErrors, handleChange: handleVariantChange, handleSubmit: handleVariantSubmit, setFieldValue: setVariantFieldValue } = variantFormik

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",

        },
        // {
        //     title: "Color",
        //     dataIndex: "color",
        //     key: "color",

        // },
        // {
        //     title: "Position",
        //     dataIndex: "position",
        //     key: "position",

        // },
        {
            title: "Edit",
            render: (data, row) => {
                return (
                    <>
                        <img
                            src={Edit}
                            onClick={() => {
                                setValueId(row?._id)
                                setInitialValues(row)
                                setOpenVariant(true)
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
                            setValueId(row?._id)
                            setIsDelete(true)
                        }} height={20} alt="delete" />
                    </>
                );
            },
        },
    ];



    const variantData = allVariants.find((v) => v?._id === isEdit).values

    const handleYes = () => {
        deleteVariantValue.mutate({
            value_id: valueId,
            _id: isEdit
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        const reader = new FileReader()

        reader.onload = () => {
            setVariantFieldValue("image", reader.result)
        }
        reader.readAsDataURL(file)
    }

    console.log('variantData', variantData)

    return (
        <div className="variant-update-container">
            <ConfirmationModal yesTitle={deleteVariantValue.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this material?" yesClick={handleYes} noClick={() => setIsDelete(false)} />

            <Modal

                content={<div>
                    <div className="input-control">
                        <label >Variant Name*</label>
                        <input
                            type="text"
                            placeholder="Variant Name"
                            name="name"
                            value={variantValues.name}
                            onChange={handleVariantChange}
                        />
                        {variantErrors.name && (
                            <div className="error-message">{variantErrors.name}</div>
                        )}
                    </div>
                    {/* <div className="input-control">
                        <label >Color*</label>
                        <ChromePicker
                            
                            color={variantValues.color}
                            onChange={(color) => handleVariantChange({ target: { name: 'color', value: color.hex } })}
                        />
                        {variantErrors.color && (
                            <div className="error-message">{variantErrors.color}</div>
                        )}
                    </div>
                    <div className="input-control">
                        <label >Position*</label>
                        <input
                            type="number"
                            placeholder="Position"
                            name="position"
                            value={variantValues.position}
                            onChange={handleVariantChange}
                        />
                        {variantErrors.position && (
                            <div className="error-message">{variantErrors.position}</div>
                        )}
                    </div> */}
                    <div style={{ paddingTop: "15px" }} className="input-control">
                        <label >Default Image*</label>
                        <input
                            type="file"
                            placeholder="image"
                            name="image"
                            ref={imageRef}
                            style={{
                                display: "none"
                            }}
                            onChange={handleImageChange}
                        />
                        <button onClick={() => imageRef.current.click()}>Select Image</button>
                    </div>
                    {
                        variantValues.image && <img className='variant-default-image' src={variantValues.image} width={50} height={50} alt='variant' />
                    }
                    <div className="input-control">

                        <button style={{ float: "right" }} type='button' onClick={handleVariantSubmit} >Update variant</button>
                    </div>
                </div>}
                isOpen={openVariant}
                setIsOpen={setOpenVariant}
                label="Open variant"

            />
            <div className='variant-update-header'>
                <img src={BackArrow} onClick={() => {
                    setIsOpen(false);
                    setId("")
                }} alt='backarrow' height={30} width={30} />
                <h2 className='name'>{title}</h2>
                <button type='button' onClick={formik.handleSubmit}>{isEdit ? "Update" : "Save"}</button>
            </div>
            <div className='variant-grid'>
                <h5>Basic information</h5>
                <div className='grid'>
                    <div className="input-control">
                        <label >Name*</label>
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
                </div>
            </div>
            <div className='variant-grid'>
                <h5>Product Values</h5>
                <div>
                    <div className='search-container'>
                        <div className='search-control'>
                            <input type='search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search variant`} className='search-input' />
                            {
                                !search &&
                                <img src={SearchIcon} width={30} height={30} alt='search-icon' />
                            }
                        </div>
                        {/* <div className='delete'>

                            <img src={Delete} width={30} height={30} alt='search-icon' />
                        </div> */}
                        <button onClick={() => setOpenVariant(true)}>Add value</button>
                    </div>
                    <div className='grid'>
                        <Table
                            scroll={{ x: "100%" }}
                            dataSource={search ? variantData.filter(v => v?.name?.includes(search)) : variantData}
                            columns={columns}

                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateVariant