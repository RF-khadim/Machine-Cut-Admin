import React from "react";
import Layout from "../../layout";
import Header from "../../components/header";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import { Table } from "antd";
import { useQuery, useMutation } from "react-query";
import apiService from "../../services/apiService";
import DatePicker from 'react-datepicker';
import Delete from "../../assets/images/delete.png";
import Edit from "../../assets/images/edit.png";
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup'
import { useFormik } from "formik";
import { useState } from "react";
import moment from "moment";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import "./styles.css";
import ReactSelect from "../../components/select";
import ConfirmationModal from "../../components/modal/confirmationModal";
import Toastify from "../../components/toast";


const schema = {
  product: "",
  batch_code: "",
  mnf_date: "",
  exp_date: "",
  product_codes: null
}

const searchSchema = {
  search_batch_code: "",
  search_code: ""

}

const Inventory = () => {

  const [isDelete, setIsDelete] = useState(false)
  const [id, setId] = useState("")
  const [initialValues, setInitialValues] = useState(schema)
  const [searchInitialValues,] = useState(searchSchema)
  const [key, setKey] = useState(0)



  const { data: products } = useQuery("products", () => apiService.getMaterials())

  const { data: inventories, refetch, isLoading } = useQuery("inventory", () => apiService.getInventories())



  const addVariantMutation = useMutation((data) => apiService.addInventory(data), {
    onSuccess: (data) => {
      setKey(0)
      refetch()
    }
  })



  const validationSchema = Yup.object({
    product: Yup.string().required("*product is required"),
    batch_code: Yup.string().required("*batch code is required"),
    mnf_date: Yup.date().required("*manufacture date is required"),
    exp_date: Yup.date().required("*expiry date is required"),
    product_codes: Yup.number().required("*product codes is required")
  })


  const searchValidationSchema = Yup.object({
    search_batch_code: Yup.string().required("*batch code is required"),
    search_code: Yup.string().required("*batch code is required")
  })

  const searchFormik = useFormik({
    initialValues: searchInitialValues,
    validationSchema: searchValidationSchema,
    onSubmit: (data) => {
      mutate(
        {
          search_batch_code: searchValues.search_batch_code,
          search_code: searchValues.search_code
        }
      )
    }
  })


  const { values: searchValues, errors: searchErrors, handleChange: searchHandleChange, handleSubmit: searchHandleSubmit } = searchFormik

  const { mutate, data: searchedInventory, isLoading: searching, } = useMutation("search", (data) => apiService.searchByBatchCode(data), {
  })






  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (data, { resetForm }) => {
      console.log("date", data)
      addVariantMutation.mutate(data, {
        onSuccess: () => {
          resetForm()

        }
      })
    }
  })


  const { values, errors, handleChange, handleSubmit, setFieldValue } = formik





  const columns = [
    {
      title: "Part no",
      dataIndex: "batch_code",
      key: "batch_code"
    },
    {
      title: "Product",
      dataIndex: ["product", "name"],
      key: "name"
    },
    {
      title: "Quantity",
      dataIndex: "product_codes",
      key: "product_codes"
    },
    {
      title: "Download",
      render: (data, row) => {
        return (
          <button style={{ height: "auto !important" }}
            onClick={(e) => {
              console.log("row", row)

              // Recursive function to flatten the nested object and include its keys
              const flattenObject = (obj, prefix = '') => {
                return Object.keys(obj).reduce((acc, key) => {
                  if (key !== "media" && key !== 'dxf_file') {
                    const propName = prefix ? `${prefix}.${key}` : key;

                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                      Object.assign(acc, flattenObject(obj[key], propName));
                    } else {
                      acc[propName] = obj[key];
                    }
                    return acc;
                  } else {
                    return acc
                  }
                }, {});
              };

              const n = row?.roll_codes?.length;
              const rollCodes = row?.roll_codes;
              delete row?.roll_codes;


              // Get all unique keys from the JSON data, including nested keys
              const keys = [{ ...row, roll_code: "" }].reduce((acc, obj) => {
                const flattenedObj = flattenObject(obj);
                Object.keys(flattenedObj).forEach(key => {
                  if (!acc.includes(key)) {
                    acc.push(key);
                  }
                });
                return acc;
              }, []);


              // Create an array of objects with flattened key-value pairs
              let data = []

              console.log("row", row)

              for (let i = 0; i < n; i++) {

                data.push({
                  ...row,
                  roll_code: rollCodes[i]
                })
              }
              const csvData = data?.map(obj => flattenObject(obj));

              // Convert the array of objects to CSV using Papa Parse
              const csv = Papa.unparse({ fields: keys, data: csvData });

              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
              saveAs(blob, 'output.csv');

            }}
          >Download</button>
        )
      }
    },
    {
      title: "Edit",
      render: (data, row) => {
        return (
          <>
            <button
              onClick={() => {
                setInitialValues({ ...row, product: row?.product?._id, mnf_date: new Date(row?.mnf_date), exp_date: new Date(row?.exp_date) })
                setKey(1)
              }}
            >
              View
            </button>
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
              setId(row?._id)
              setIsDelete(true)
            }} height={20} alt="delete" />
          </>
        );
      },
    },
  ]

  const [mnfDate, setMnfDate] = useState(null)

  const filterInventories = inventories?.filter(i => {
    return moment(i?.mnf_date).format("MM-DD-YYYY") === moment(mnfDate).format("MM-DD-YYYY")
  })


  const deleteInventory = useMutation((data) => apiService.deleteInventory(data), {
    onSuccess: (data) => {
      refetch()
      Toastify("success", data?.message)
      setIsDelete(false)
    },
    onError: (err) => {
      Toastify("error", err?.message)

    }
  })

  const handleYes = () => {
    deleteInventory.mutate({
      _id: id
    })
  }


  return (
    <Layout Header={(setVisible, visible) => <Header title="Inventory" visible={visible} setVisible={setVisible} />}>
      <ConfirmationModal yesTitle={deleteInventory.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this inventory?" yesClick={handleYes} noClick={() => setIsDelete(false)} />

      <Tabs className="tabs-container" key={key} selectedIndex={key} onSelect={(index) => {
        setKey(index)
        setInitialValues(schema)
      }}>
        <TabList>
          <Tab>
            Inventory
          </Tab>
          <Tab>
            Product code generator
          </Tab>
          <Tab>
            Code search
          </Tab>
        </TabList>
        <TabPanel>
          <div className="inventory-container">
            <h3>Inventory</h3>
            <div className="input-control" style={{ gap: "10px", display: "flex", alignItems: "center" }}>
              <label>Choose date</label>
              <DatePicker isClearable selected={mnfDate} onChange={(e) => {
                setMnfDate(e)
              }} />
            </div>
            <div className="d-flex" style={{ gap: "10px" }}>
              <button onClick={() => {



                // Recursive function to flatten the nested object and include its keys
                const flattenObject = (obj, prefix = '') => {
                  return Object.keys(obj).reduce((acc, key) => {
                    if (key !== "media" && key !== "dxf_file") {
                      const propName = prefix ? `${prefix}.${key}` : key;

                      if (typeof obj[key] === 'object' && obj[key] !== null) {
                        Object.assign(acc, flattenObject(obj[key], propName));
                      } else {
                        acc[propName] = obj[key];
                      }
                      return acc;
                    } else {
                      return acc
                    }
                  }, {});
                };

                // Get all unique keys from the JSON data, including nested keys
                const keys = inventories.reduce((acc, obj) => {
                  const flattenedObj = flattenObject(obj);
                  Object.keys({ ...flattenedObj, roll_code: "" }).forEach(key => {
                    if (!acc.includes(key)) {
                      acc.push(key);
                    }
                  });
                  return acc;
                }, []);

                let data = []

                inventories.forEach(inv => {
                  const n = inv?.product_codes
                  const rollCodes = inv?.roll_codes

                  delete inv.roll_codes

                  for (let j = 0; j < n; j++) {
                    data.push({
                      ...inv,
                      roll_code: rollCodes[j]
                    })
                  }
                })

                // Create an array of objects with flattened key-value pairs
                const csvData = data.map(obj => flattenObject(obj));

                // Convert the array of objects to CSV using Papa Parse
                const csv = Papa.unparse({ fields: keys, data: csvData });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                saveAs(blob, 'output.csv');

              }}>CSV</button>
              <button>Import from CSV</button>
            </div>
          </div>
          <Table
            style={{ marginTop: "20px" }}
            columns={columns}
            loading={isLoading}
            dataSource={mnfDate ? filterInventories : inventories}
            scroll={{ x: "100%" }}
          />
        </TabPanel>
        <TabPanel>

          <div className="product-code-generator-container">
            <h5>
              Product code generator
            </h5>
            <div >
              <Tabs>
                <TabList>
                  <Tab>
                    Product code generator
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="product-code">
                    <div className="product-controls">
                      <div className="input-control">
                        <label>
                          Select Product
                        </label>
                        {/* <select
                          name="product"
                          onChange={handleChange}

                          value={values.product}>
                          <option value="" selected>
                            Select Product
                          </option>
                          {
                            Array.isArray(products) && products.map(c => (
                              <option value={c?._id} key={c?._id} >{c?.name}</option>
                            ))
                          }
                        </select> */}
                        <ReactSelect
                          setFieldValue={setFieldValue}
                          name="product"

                          onChange={handleChange}
                          value={values.product}
                          options={products?.map(p => ({
                            value: p?._id,
                            label: p?.name
                          }))}

                        />
                        {
                          errors?.product &&
                          <div className="error-message">{errors.product}</div>

                        }
                      </div>
                      <div className="input-control">
                        <label>
                          Enter Batch Code
                        </label>
                        <input placeholder="Type in batch code" onChange={handleChange} value={values.batch_code} name="batch_code" type="text" />
                        {
                          errors?.batch_code &&
                          <div className="error-message">{errors.batch_code}</div>

                        }
                      </div>
                    </div>
                    <div className="product-dates" >

                      <div className="input-control">
                        <label>Select Manufacture date</label>
                        <DatePicker
                          name="mnf_date"
                          selected={values.mnf_date}
                          onChange={(e) => setFieldValue("mnf_date", e)}
                          inline
                        />
                        {
                          errors?.mnf_date &&
                          <div className="error-message">{errors.mnf_date}</div>

                        }
                      </div>
                      <div className="input-control">
                        <label >Select Expiry date</label>
                        <DatePicker
                          name="exp_date"
                          selected={values.exp_date}
                          onChange={(e) => setFieldValue("exp_date", e)}

                          inline
                        />
                        {
                          errors?.exp_date &&
                          <div className="error-message">{errors.exp_date}</div>

                        }
                      </div>
                    </div>

                    <div className="product-code-controls">
                      <div className="input-control">
                        <label>Amount of product codes</label>
                        <input type="number" name="product_codes" value={values.product_codes} onChange={handleChange} />
                        {
                          errors?.product_codes &&
                          <div className="error-message">{errors.product_codes}</div>

                        }
                      </div>
                      <div className="d-flex generate-btn" style={{ gap: "20px" }}>

                        <button onClick={handleSubmit} type="button" >Generate</button>
                        <button className="download">Download</button>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="product-code-generator-container">
            <h5>
              Product code generator
            </h5>
            <div >
              <Tabs>
                <TabList>
                  <Tab>
                    Product code generator
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="product-code">
                    <div className="product-controls">

                      <div className="input-control">
                        <label>
                          Search by Batch Code
                        </label>
                        <input placeholder="Type in batch code" onChange={searchHandleChange} value={searchValues.search_batch_code} name="search_batch_code" type="text" />
                        {
                          searchErrors?.search_batch_code &&
                          <div className="error-message">{searchErrors.search_batch_code}</div>

                        }
                      </div>
                      <div className="input-control">
                        <label>
                          Search by Code
                        </label>
                        <input placeholder="Type in batch code" onChange={searchHandleChange} value={searchValues.search_code} name="search_code" type="text" />
                        {
                          searchErrors?.search_code &&
                          <div className="error-message">{searchErrors.search_code}</div>

                        }
                      </div>

                    </div>
                    <button style={{ marginTop: "30px" }} type="button" onClick={searchHandleSubmit}>{searching ? "Please wait..." : "Search"}</button>

                    <div style={{ marginTop: "50px" }}>
                      <h4 className="mb-30">FOUND:</h4>

                      <div className="inventory-detail">
                        <div className="detail-grid">
                          <h5 className="h1">Code:</h5>
                          <h5>{searchedInventory?.batch_code}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Name:</h5>
                          <h5>{searchedInventory?.product?.name}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">MNF Date:</h5>
                          <h5>{searchedInventory?.mnf_date}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">EXP Date:</h5>
                          <h5>{searchedInventory?.exp_date}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Material Length:</h5>
                          <h5>{searchedInventory?.product?.length}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Material Width:</h5>
                          <h5>{searchedInventory?.product?.width}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Styrile Type:</h5>
                          <h5>{searchedInventory?.product?.styrile_type}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Blade Type:</h5>
                          <h5>{searchedInventory?.product?.blade_type}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Usage Times:</h5>
                          <h5>{searchedInventory?.product?.usage_times}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Batch Code:</h5>
                          <h5>{searchedInventory?.product?.batch_code}</h5>
                        </div>
                        <div className="detail-grid">
                          <h5 className="h1">Used Length:</h5>
                          <h5>{searchedInventory?.product?.used_length}</h5>
                        </div>

                        <div className="detail-grid">
                          <h5 className="h1">Length Balance:</h5>
                          <h5>{searchedInventory?.product?.length_balance}</h5>
                        </div>

                      </div>
                    </div>


                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </Layout>
  );
};

export default Inventory;
