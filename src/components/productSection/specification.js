
import Toggle from 'react-toggle'
import "react-toggle/style.css"
import ImageIcon from '../../assets/images/image-icon.png'
import DxfParser from 'dxf-parser';

import './styles.css'

import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import DeleteIcon from '../../assets/images/delete.png'
import DownloadIcon from '../../assets/images/download.png'
import MyEditor from '../quill'
import Category from '../category'
import { useRef } from 'react'
import { useQuery } from 'react-query'
import { useState } from 'react'
import apiService from '../../services/apiService'
import DXFViewer from '../dxfViewer'
import { useEffect } from 'react'
import DxfLayerViewer from '../dxfViewer/layers'

const Specifications = ({ formik, isEdit }) => {
    const [data, setData] = useState([])

    const [checkedCat, setCheckedCat] = useState(formik?.values?.selectedCategories || [])

    const dxfRef = useRef(null)



    const { refetch, isLoading: fetchingCategories } = useQuery("getCategories", () =>
        apiService.getCategories(isEdit),
        {
            onSuccess: (data) => {
                setData(data)
            }
        }
    );


    useEffect(() => {
        formik.setFieldValue("selectedCategories", checkedCat)
    }, [checkedCat])

    const { errors, values, handleChange, setFieldValue } = formik || {}

    const openMediaRef = useRef()

    const handleMedia = (e) => {
        e.preventDefault();
        const files = e.target.files;

        let promises = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
            promises.push(promise);
        }

        Promise.all(promises)
            .then((results) => {
                const updatedMedia = [...values.media, ...results];
                setFieldValue("media", updatedMedia);
            })
            .catch((error) => {
                console.error("Error reading file:", error);
            });
    };

    let categoryName = null;

    const getCategoryName = (arr) => {
        if (arr?.length === 0) {
            return categoryName;
        }
    
        for (let i = 0; i < arr?.length; i++) {
            const category = arr.find(a => a?._id === checkedCat[checkedCat?.length - 1])?.name;
    
            if (category) {
                categoryName = category;
                return categoryName; 
            } else {
                const childCategory = getCategoryName(arr[i]?.child);
                if (childCategory) {
                    return childCategory; 
                }
            }
        }
        
        return null; 
    };
    








    // const handleVariantChange = (e, id) => {
    //     const variant = allVariants.find(v => v?._id === id)

    //     let contain = false

    //     for (let i = 0; i < formik.values.variants?.length; i++) {
    //         if (variant.values.find(v => v?._id === formik.values.variants[i])) {
    //             contain = true
    //         }
    //     }

    //     if (formik.values.variants?.length > 0 && contain) {
    //         formik.setFieldValue("variants", [])
    //     } else {

    //         formik.setFieldValue("variants", [...variant?.values?.map(vr => vr?._id)])
    //     }

    // }

    // const isVariantActive = (vr) => {
    //     const variant = allVariants.find(vart => vart?._id === vr?._id)


    //     let found = false
    //     for (let i = 0; i < variant?.values?.length; i++) {
    //         if (values.variants.find((v) => v === variant?.values[i]?._id)) {
    //             found = true
    //         }

    //     }

    //     console.log(found)

    //     return found

    // }

    const handleDxf = (e) => {
        const file = e.target.files[0];

        formik.setFieldValue("dxfFileName", file.name)
        formik.setFieldValue("dxfFile", "")

        const fileReader = new FileReader()
        fileReader.onload = () => {
            formik.setFieldValue("dxfFile", fileReader.result)
        }

        fileReader.readAsText(file)
    };

    function getDXFDimensions(dxfContent) {
        const parser = new DxfParser();
        const parsedData = parser.parseSync(dxfContent ?? "");

        const entities = parsedData?.entities ?? [];
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        entities.forEach(entity => {
            if (entity.type === 'LINE' || entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
                entity.vertices.forEach(vertex => {
                    minX = Math.min(minX, vertex.x);
                    minY = Math.min(minY, vertex.y);
                    maxX = Math.max(maxX, vertex.x);
                    maxY = Math.max(maxY, vertex.y);
                });
            }
        });

        const width = Math.abs(maxX - minX);
        const height = Math.abs(maxY - minY);
        const sizeInMillimeters = `${width.toFixed(2)} mm x ${height.toFixed(2)} mm`;

        return sizeInMillimeters;


    }

    function downloadDxfFile(fileContent, fileName) {
        const blob = new Blob([fileContent], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    }



    return (
        <>
            <div className='categories-section'>
                <div className='category'>
                    <Category isEdit={isEdit} loading={fetchingCategories} checkedCat={checkedCat} setCheckedCat={setCheckedCat} data={data} refetch={refetch} />
                </div>
                <Tabs className="tabs">
                    <TabList>
                        <Tab>

                            General
                        </Tab>
                        {
                            checkedCat?.length > 0 &&
                            <>
                                <Tab>

                                    Data Input
                                </Tab>
                                <Tab>
                                    Cut Settings
                                </Tab>
                                <Tab>
                                    Configutation
                                </Tab>
                                <Tab>
                                    Credits
                                </Tab>
                            </>
                        }

                    </TabList>
                    <TabPanel>
                        <div className='category-detail'>
                            <div className='category-info'>
                                <h5>General</h5>
                                <div className='category-inputs'>
                                    <div className="input-control">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Category Name"
                                            name="length"
                                            value={getCategoryName(data)}
                                        />
                                    </div>
                                    <div className='toggler'>

                                        <Toggle
                                            icons={false}

                                            onChange={handleChange} />
                                        <label>Active</label>
                                    </div>
                                </div>
                            </div>
                            <div className='category-info'>
                                <h5>Display Image</h5>

                                <div className="gallery-control">
                                    <input type="file" ref={openMediaRef} multiple onChange={handleMedia} style={{ display: "none" }} />
                                    <div className='gallery'>
                                        <h5 style={{ marginBottom: "20px", border: "none" }}>Display Image</h5>

                                        <div className='images-area'>
                                            {
                                                values?.media?.length === 0 && <div className='image-area'>
                                                    <img src={ImageIcon} alt='icon' width={50} height={50} />
                                                </div>

                                            }
                                            {
                                                values?.media?.map(m => (
                                                    <div className='image-area'>
                                                        <img src={m} alt='icon' width={50} height={50} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <button className='open-media' onClick={() => openMediaRef.current.click()}>Open Media</button>
                                </div>
                            </div>

                        </div>

                    </TabPanel>
                    <TabPanel>
                        <div className='data-input'>
                            <h5>Description</h5>
                            <div className='data-input-description'>
                                <MyEditor setFieldValue={setFieldValue} fieldName="dataInputDescription" text={values.dataInputDescription} />
                            </div>
                        </div>
                        {/* <div style={{ marginTop: "20px" }} className='data-input'>
                            <h5>Variant</h5>
                            <div className='data-input-description'>
                                {
                                    allVariants?.map(av => (
                                        <div className={`variant-container `}>
                                            <div onClick={(e) => handleVariantChange(e, av?._id)} className={`variant-title ${isVariantActive(av) ? "active" : ""}`}>
                                                <img src={Document} alt='document' width={15} height={15} />
                                                <span>{av?.name}</span>
                                            </div>
                                            <div className={`variant-values `}>
                                                {
                                                    av?.values?.map(v => (
                                                        <div>
                                                            <input value={values.variants} checked={values.variants?.includes(v?._id)} type='checkbox' />
                                                            <label>{v?.name}</label>
                                                        </div>

                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div> */}
                        <div className='dfx-upload'>
                            <h5>DXF Upload</h5>
                            <div className='dfx-file'>
                                <div className='dfx-control'>
                                    <label>File:</label>
                                    <div className='upload-dfx'>
                                        <div className='file-detail'>
                                            <p>{values.dxfFileName ?? "Upload file..."}</p>
                                            <img src={DownloadIcon} alt='download' onClick={() => downloadDxfFile(formik.values.dxfFile, `${values.dxfFileName}`)} className='download-icon' width={30} height={30} />
                                            <img src={DeleteIcon} alt='delete' onClick={() => setFieldValue("dxfFile", "")} className='delete-icon' width={30} height={30} />
                                        </div>
                                    </div>
                                    <input type="file" accept='.dxf' ref={dxfRef} onChange={handleDxf} style={{ display: "none" }} />
                                    <button onClick={() => {
                                        dxfRef.current.click()
                                    }} >Upload</button>
                                </div>
                                <div className='dfx-size-detected'>
                                    <label>Size detected:</label>
                                    <div className='size-length'>
                                        <p> {formik.values.dxfFile ? getDXFDimensions(formik.values.dxfFile) : ""}</p>
                                    </div>
                                </div>
                                <div className='dfx-size-detected'>
                                    <label>Image:</label>
                                    {
                                        formik.values.dxfFile &&
                                        <div className='dxf-file'>

                                            <DXFViewer file={formik.values.dxfFile} />
                                        </div>
                                    }
                                </div>
                                <label>Layers:</label>

                                <div className='layers'>
                                    {
                                        formik.values.dxfFile &&
                                        <DxfLayerViewer file={formik.values.dxfFile} />
                                    }
                                    {/* <div>Layer 1</div>
                                    <div>Layer 2</div>
                                    <div>Layer 3</div> */}
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className='layer-section'>
                            <h5>Layer Setting</h5>
                            <div>
                                <div className='layer-controls'>
                                    <center><h4>Layer 1</h4></center>
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Cutting Depth</label>
                                            <input
                                                type="text"
                                                placeholder="Cutting depth"
                                                name="l1CD"
                                                value={values.l1CD}
                                                onChange={handleChange}
                                            />
                                            {errors.l1CD && (
                                                <div className="error-message">{errors.l1CD}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Cutting Speed</label>
                                            <input
                                                type="number"
                                                placeholder="Cutting speed"
                                                name="l1CS"
                                                value={values.l1CS}
                                                onChange={handleChange}
                                            />
                                            {errors.l1CS && (
                                                <div className="error-message">{errors.l1CS}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Cut Times</label>
                                            <input
                                                type="number"
                                                placeholder="Cut times"
                                                name="l1CT"
                                                value={values.l1CT}
                                                onChange={handleChange}
                                            />
                                            {errors.l1CT && (
                                                <div className="error-message">{errors.l1CT}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='layer-controls'>
                                    <center><h4>Layer 2</h4></center>
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Cutting Depth</label>
                                            <input
                                                type="text"
                                                placeholder="Cutting depth"
                                                name="l2CD"
                                                value={values.l2CD}
                                                onChange={handleChange}
                                            />
                                            {errors.l2CD && (
                                                <div className="error-message">{errors.l2CD}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Cutting Speed</label>
                                            <input
                                                type="number"
                                                placeholder="Cutting speed"
                                                name="l2CS"
                                                value={values.l2CS}
                                                onChange={handleChange}
                                            />
                                            {errors.l2CS && (
                                                <div className="error-message">{errors.l2CS}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Cut Times</label>
                                            <input
                                                type="number"
                                                placeholder="Cut times"
                                                name="l2CT"
                                                value={values.l2CT}
                                                onChange={handleChange}
                                            />
                                            {errors.l2CT && (
                                                <div className="error-message">{errors.l2CT}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='layer-controls'>
                                    <center><h4>Layer 3</h4></center>
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Cutting Depth</label>
                                            <input
                                                type="text"
                                                placeholder="Cutting depth"
                                                name="l3CD"
                                                value={values.l3CD}
                                                onChange={handleChange}
                                            />
                                            {errors.l3CD && (
                                                <div className="error-message">{errors.l3CD}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Cutting Speed</label>
                                            <input
                                                type="number"
                                                placeholder="Cutting speed"
                                                name="l3CS"
                                                value={values.l3CS}
                                                onChange={handleChange}
                                            />
                                            {errors.l3CS && (
                                                <div className="error-message">{errors.l3CS}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Cut Times</label>
                                            <input
                                                type="number"
                                                placeholder="Cut times"
                                                name="l3CT"
                                                value={values.l3CT}
                                                onChange={handleChange}
                                            />
                                            {errors.l3CT && (
                                                <div className="error-message">{errors.l3CT}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='layer-section' style={{ marginTop: "30px" }}>
                            <h5>Cut Sequence</h5>
                            <div>
                                <div className='layer-controls' style={{ borderBottom: "none" }}>
                                    <div className='layer-inputs' >
                                        <div className="input-control">
                                            <label>First Cut Layer</label>
                                            <input
                                                type="number"
                                                name="csFirstCutLayer"
                                                value={values.csFirstCutLayer}
                                                onChange={handleChange}
                                            />
                                            {errors.csFirstCutLayer && (
                                                <div className="error-message">{errors.csFirstCutLayer}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Second Cut Layer</label>
                                            <input
                                                type="number"
                                                name="csSecondCutLayer"
                                                value={values.csSecondCutLayer}
                                                onChange={handleChange}
                                            />
                                            {errors.csSecondCutLayer && (
                                                <div className="error-message">{errors.csSecondCutLayer}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Third Cut Layer</label>
                                            <input
                                                type="number"
                                                name="csThirdCutLayer"
                                                value={values.csThirdCutLayer}
                                                onChange={handleChange}
                                            />
                                            {errors.csThirdCutLayer && (
                                                <div className="error-message">{errors.csThirdCutLayer}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='layer-section' style={{ marginTop: "30px" }}>
                            <h5>After Cut</h5>
                            <div>
                                <div className='layer-controls' style={{ borderBottom: "none" }}>
                                    <div className='straight-line d-flex j-btw' style={{ alignItems: "center" }}>
                                        <h4>Slice straight line after cutting</h4>
                                        <div className='d-flex j-btw' style={{ alignItems: "center", gap: "20px" }}>
                                            ON/OFF
                                            <Toggle defaultChecked={values.straightLineAfterCutting} defaultValue={values.straightLineAfterCutting} value={values.straightLineAfterCutting} name='straightLineAfterCutting' onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className='layer-inputs' >
                                        <div className="input-control">
                                            <label>First Cut Layer</label>
                                            <input
                                                type="text"
                                                placeholder="Cutting depth"
                                                name="slFirstCutLayer"
                                                value={values.slFirstCutLayer}
                                                onChange={handleChange}
                                            />
                                            {errors.slFirstCutLayer && (
                                                <div className="error-message">{errors.slFirstCutLayer}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Second Cut Layer</label>
                                            <input
                                                type="number"
                                                placeholder="Cutting speed"
                                                name="slSecondCutLayer"
                                                value={values.slSecondCutLayer}
                                                onChange={handleChange}
                                            />
                                            {errors.slSecondCutLayer && (
                                                <div className="error-message">{errors.slSecondCutLayer}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Third Cut Layer</label>
                                            <input
                                                type="number"
                                                placeholder="Cut times"
                                                name="slThirdCutLayer"
                                                value={values.slThirdCutLayer}
                                                onChange={handleChange}
                                            />
                                            {errors.slThirdCutLayer && (
                                                <div className="error-message">{errors.slThirdCutLayer}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='layer-section' style={{ marginTop: "30px" }}>
                            <h5>UV Sterlization</h5>
                            <div>
                                <div className='layer-controls' style={{ borderBottom: "none" }}>
                                    <div className='straight-line d-flex j-btw' style={{ alignItems: "center" }}>
                                        <h4>UV Sterlization during cutting</h4>
                                        <div className='d-flex j-btw' style={{ alignItems: "center", gap: "20px" }}>
                                            ON/OFF
                                            <Toggle defaultChecked={values.uvSterlization} defaultValue={values.uvSterlization} value={values.uvSterlization} name='uvSterlization' onChange={handleChange} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className='layer-section'>
                            <h5>Amount Of cuts allowed</h5>
                            <div style={{ padding: "20px", width: "fit-content" }}>
                                <div className='layer-controls' style={{ borderBottom: "none" }} >
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Minimum cuts</label>
                                            <input
                                                type="number"
                                                placeholder="Minimum cuts"
                                                name="minimumCuts"
                                                value={values.minimumCuts}
                                                onChange={handleChange}
                                            />
                                            {errors.minimumCuts && (
                                                <div className="error-message">{errors.minimumCuts}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Maximum cuts</label>
                                            <input
                                                type="number"
                                                placeholder="Maximum cuts"
                                                name="maximumCuts"
                                                value={values.maximumCuts}
                                                onChange={handleChange}
                                            />
                                            {errors.maximumCuts && (
                                                <div className="error-message">{errors.maximumCuts}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='layer-section' >
                            <h5>Allow for multiple objects in one row</h5>
                            <div style={{ padding: "20px", width: "fit-content" }}>
                                <div className='layer-controls' style={{ borderBottom: "none", padding: "60px 100px" }}>
                                    <div className='straight-line d-flex j-btw' style={{ alignItems: "center" }}>
                                        <div className='d-flex j-btw' style={{ alignItems: "center", gap: "20px" }}>
                                            ON/OFF
                                            <Toggle defaultChecked={values.multipleObjects} defaultValue={values.multipleObjects} value={values.multipleObjects} name='multipleObjects' onChange={handleChange} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='layer-section'>
                            <h5>Spacing between object</h5>
                            <div style={{ padding: "20px", width: "fit-content" }}>
                                <div className='layer-controls' style={{ borderBottom: "none" }} >
                                    <h4>Margins</h4>
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Top</label>
                                            <input
                                                type="number"
                                                placeholder="Top margin"
                                                name="topMargin"
                                                value={values.topMargin}
                                                onChange={handleChange}
                                            />
                                            {errors.topMargin && (
                                                <div className="error-message">{errors.topMargin}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Left</label>
                                            <input
                                                type="number"
                                                placeholder="Left margin"
                                                name="leftMargin"
                                                value={values.leftMargin}
                                                onChange={handleChange}
                                            />
                                            {errors.leftMargin && (
                                                <div className="error-message">{errors.leftMargin}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Bottom</label>
                                            <input
                                                type="number"
                                                placeholder="Bottom margin"
                                                name="bottomMargin"
                                                value={values.bottomMargin}
                                                onChange={handleChange}
                                            />
                                            {errors.bottomMargin && (
                                                <div className="error-message">{errors.bottomMargin}</div>
                                            )}
                                        </div>
                                        <div className="input-control">
                                            <label>Right</label>
                                            <input
                                                type="number"
                                                placeholder="Right margin"
                                                name="rightMargin"
                                                value={values.rightMargin}
                                                onChange={handleChange}
                                            />
                                            {errors.rightMargin && (
                                                <div className="error-message">{errors.rightMargin}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className='layer-section' >
                            <h5>Credit Free</h5>
                            <div style={{ padding: "20px", width: "fit-content" }}>
                                <div className='layer-controls' style={{ borderBottom: "none", padding: "60px 100px" }}>
                                    <div className='straight-line d-flex j-btw' style={{ alignItems: "center" }}>
                                        <div className='d-flex j-btw' style={{ alignItems: "center", gap: "20px" }}>
                                            ON/OFF
                                            <Toggle defaultChecked={values.creditFree} defaultValue={values.creditFree} value={values.creditFree} name='creditFree' onChange={handleChange} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className='layer-section'>
                            <h5>Credit per cut</h5>
                            <div style={{ padding: "20px", width: "fit-content" }}>
                                <div className='layer-controls' style={{ borderBottom: "none" }} >
                                    <div className='layer-inputs'>

                                        <div className="input-control">
                                            <label>Credit amount</label>
                                            <input
                                                type="number"
                                                placeholder="Credit amount"
                                                name="creditAmount"
                                                value={values.creditAmount}
                                                onChange={handleChange}
                                            />
                                            {errors.creditAmount && (
                                                <div className="error-message">{errors.creditAmount}</div>
                                            )}
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>


                    </TabPanel>
                </Tabs>
            </div>


        </>
    )
}

export default Specifications