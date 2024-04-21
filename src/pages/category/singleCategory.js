import { useEffect, useState } from "react"
import Modal from "../../components/modal"
import Layout from "../../layout"
import * as Yup from 'yup'
import './styles.css'
import { useFormik } from "formik"
import Toastify from "../../components/toast"
import { useMutation, useQuery } from "react-query"
import apiService from "../../services/apiService"
import Card from "../../components/card"
import { useParams } from "react-router-dom"

const schema = {
    file: null,
    name: "",
    type: "",
    description: ""
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    file: Yup.mixed().required("*file is required"),
    description: Yup.string(),
    type: Yup.string()
});

const SingleCategory = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [image, setImage] = useState("")
    const [id, setId] = useState("")
    const [initialValue, setInitialValues] = useState(schema)

    const params = useParams()

    console.log(params)


    const { data: singleCategory, refetch } = useQuery(["getSingleCategory",params?.id], () =>
        apiService.getCategory(params?.id),
        {
            enabled: !!params.id
        }
    );



    const addCategory = useMutation((data) => apiService.addCategory(data), {
        onSuccess: (data) => {
            Toastify("success", data?.message);
            setIsOpen(false);
            setInitialValues(schema);
            refetch()
        },
        onError: (err) => {
            Toastify("error", err?.message);
        },
    });
    const updateCategory = useMutation((data) => apiService.updateCategory(data, id), {
        onSuccess: (data) => {
            Toastify("success", data?.message);
            setIsOpen(false);
            setInitialValues(schema);
            refetch()

        },
        onError: (err) => {
            Toastify("error", err?.message);
        },
    });
    const deleteCategory = useMutation((data) => apiService.deleteCategory(data, id), {
        onSuccess: (data) => {
            Toastify("success", data?.message);
            setIsOpen(false);
            setInitialValues(schema);
            refetch()
        },
        onError: (err) => {
            Toastify("error", err?.message);
        },
    });


    const formik = useFormik({
        initialValues: initialValue,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            console.log("values", values.file)

            const formData = new FormData()
            formData.append("file", values.file)
            formData.append("name", values.name)
            formData.append("parent", singleCategory?.result?.[0]?._id)

            if (id) {

                updateCategory.mutate(formData);
            } else {

                addCategory.mutate(formData);
            }

        },
    });

    const { values, errors, handleChange, handleSubmit, setFieldValue } = formik


    useEffect(() => {
        if (!isOpen) {
            setInitialValues(schema)
        }
    }, [isOpen])



    console.log(singleCategory)
    return (
        <Layout>
            <Modal
                label="Add Category"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                content={
                    <div className="category-modal-content">
                        <div className="input-control">
                            <input
                                type="text"
                                placeholder="Sub Category Name"
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
                                placeholder="Sub Category Description"
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                            />
                            {errors.description && (
                                <div className="error-message">{errors.description}</div>
                            )}
                        </div>
                        <div className="input-control">
                            <input
                                type="text"
                                placeholder="Sub Category Type"
                                name="type"
                                value={values.type}
                                onChange={handleChange}
                            />
                            {errors.type && (
                                <div className="error-message">{errors.type}</div>
                            )}
                        </div>
                        <div className="input-control">
                            <input
                                type="file"
                                placeholder="File"
                                name="file"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    setFieldValue("image", null)

                                    setFieldValue("file", file)
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        setImage(reader.result)
                                    };
                                    reader.readAsDataURL(file);
                                }}
                            />
                            {errors.file && (
                                <div className="error-message">{errors.file}</div>
                            )}
                        </div>
                        {
                            values.file &&
                            <img src={values?.file && values?.image ? values.file : image} className="selected-image" alt="file" width={100} height={100} />
                        }
                        <div className="input-control ">
                            <button className="submit" type="button" onClick={handleSubmit}>
                                {addCategory.isLoading || updateCategory.isLoading ? "Please wait..." : "Submit"}
                            </button>
                        </div>
                    </div>
                }
            />
            <div className="category-header">
                <h2>{singleCategory?.result?.[0]?.name}</h2>
                <button className="add-category-btn" onClick={() => setIsOpen(true)} >Add Category</button>
            </div>
            <div className="categories">
                {
                    Array.isArray(singleCategory?.result?.[0]?.child) && singleCategory?.result?.[0]?.child?.length > 0 && singleCategory?.result?.[0]?.child?.map(d => (
                        <Card description={d?.description} id={d?._id} key={d?._id} name={d?.name} image={d?.image} onUpdate={() => {
                            setId(d?._id)
                            setInitialValues({ file: d?.image, image: d?.image, name: d?.name })
                            setIsOpen(true)
                        }}
                            onDelete={() => {
                                setId(d?._id)
                                deleteCategory.mutate({
                                    _id: d?._id,
                                })
                            }}
                            isDeleting={deleteCategory.isLoading}
                            isUpdating={updateCategory.isLoading}
                        />
                    ))
                }
            </div>
        </Layout>
    )
}

export default SingleCategory