
import { useQuery } from 'react-query'
import MyEditor from '../quill'
import ReactSelect from '../select'
import './styles.css'
import apiService from '../../services/apiService'
const ProductDetail = ({ formik }) => {
    const { errors, values, handleChange, } = formik || {}

    const { data: manufacturers, isLoading, } = useQuery("getManufacturersForProducts", () => apiService.getManufacturers())


    return (
        <>
            <div className='product-detail' style={{ paddingBottom: "30px" }}>
                <h5>General information</h5>
                <div className='general' >

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
                    <div className='manufacturer'>
                        <div className="input-control">
                            <label >Manufacturer</label>
                            <ReactSelect
                                disabled={isLoading}
                                setFieldValue={formik.setFieldValue}
                                name="manufacturer"
                                onChange={handleChange}
                                value={values.manufacturer}
                                options={manufacturers?.map(p => ({
                                    value: p?._id,
                                    label: p?.name
                                }))}

                            />
                            {errors.manufacturer && (
                                <div className="error-message">{errors.manufacturer}</div>
                            )}
                        </div>
                        <div className="input-control">
                            <label >Product number</label>
                            <input
                                type="text"
                                placeholder="Enter Product Number"
                                name="productNumber"
                                value={values.productNumber}
                                onChange={handleChange}
                            />
                            {errors.productNumber && (
                                <div className="error-message">{errors.productNumber}</div>
                            )}
                        </div>
                    </div>
                    <div className='input-control'>
                        <label>Description</label>

                        <MyEditor setFieldValue={formik.setFieldValue} text={values.description} fieldName="description" />
                    </div>
                </div>
            </div>
            <div className='product-detail'>
                <h5>Material Information</h5>
                <div className='d-grid' style={{ width: "70%" }}>
                    <div className="input-control">
                        <label>Enter Material length</label>
                        <input
                            type="number"
                            placeholder="Material Length"
                            name="length"
                            value={values.length}
                            onChange={handleChange}
                        />
                        <div className='mm'>mm</div>
                        {errors.length && (
                            <div className="error-message">{errors.length}</div>
                        )}
                    </div>
                    <div className="input-control">
                        <label>Enter Material Width</label>
                        <input
                            type="number"
                            placeholder="Material Width"
                            name="width"
                            value={values.width}
                            onChange={handleChange}
                        />
                        <div className='mm'>mm</div>
                        {errors.width && (
                            <div className="error-message">{errors.width}</div>
                        )}
                    </div>
                    <div className="input-control">
                        <label>Enter Styrile Type</label>

                        <input
                            type="text"
                            placeholder="Sterile type"
                            name="styrileType"
                            value={values.styrileType}
                            onChange={handleChange}
                        />

                        {errors.styrileType && (
                            <div className="error-message">{errors.styrileType}</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductDetail