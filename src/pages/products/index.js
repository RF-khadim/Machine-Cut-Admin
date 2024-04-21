/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import * as Yup from "yup";
import "./styles.css";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";
import apiService from "../../services/apiService";
import Toastify from "../../components/toast";
import { Table } from "antd";
import Edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";
import ConfirmationModal from "../../components/modal/confirmationModal";
import moment from "moment/moment";
import ProductSection from "../../components/productSection";
import Header from "../../components/header";

const schema = {
  rollCode: "",
  name: "",
  length: "",
  width: "",
  dataInputDescription: "",
  l1CD: "",
  l2CD: "",
  l3CD: "",
  l1CS: "",
  l2CS: "",
  l3CS: "",
  l1CT: "",
  l2CT: "",
  l3CT: "",
  csFirstCutLayer: "",
  csSecondCutLayer: "",
  csThirdCutLayer: "",
  straightLineAfterCutting: false,
  slFirstCutLayer: "",
  slSecondCutLayer: "",
  slThirdCutLayer: "",
  uvSterlization: false,
  minimumCuts: 0,
  maximumCuts: 0,
  multipleObjects: false,
  topMargin: 0,
  leftMargin: 0,
  rightMargin: 0,
  bottomMargin: 0,
  creditFree: false,
  creditAmount: 0,
  productNumber: "",
  manufacturer: "",
  description: "",
  styrileType: "",
  bladeType: "",
  usageTimes: 0,
  batchCode: "",
  usedLength: "",
  lengthBalance: "",
  category: "",
  stock: 0,
  availableStock: 0,
  media: [],
  selectedCategories: [],
  variants: [],
  dxfFile: "",
};

const validationSchema = Yup.object().shape({
  rollCode: Yup.string(),
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  productNumber: Yup.string(),
  length: Yup.string().required("Length is required"),
  width: Yup.string().required("Width is required"),
  styrileType: Yup.string().required("Styrile type is required"),
  bladeType: Yup.string(),
  usageTimes: Yup.number(),
  batchCode: Yup.string(),
  usedLength: Yup.string(),
  lengthBalance: Yup.string(),
  category: Yup.string(),
  stock: Yup.number(),
  media: Yup.array(),
  manufacturer: Yup.string(),
  availableStock: Yup.number(),
  dataInputDescription: Yup.string(),
  l1CD: Yup.string(),
  l2CD: Yup.string(),
  l3CD: Yup.string(),
  l1CS: Yup.string(),
  l2CS: Yup.string(),
  l3CS: Yup.string(),
  l1CT: Yup.string(),
  l2CT: Yup.string(),
  l3CT: Yup.string(),
  csFirstCutLayer: Yup.string(),
  csSecondCutLayer: Yup.string(),
  csThirdCutLayer: Yup.string(),
  straightLineAfterCutting: Yup.boolean(),
  slFirstCutLayer: Yup.string(),
  slSecondCutLayer: Yup.string(),
  slThirdCutLayer: Yup.string(),
  uvSterlization: Yup.boolean(),
  minimumCuts: Yup.number(),
  maximumCuts: Yup.number(),
  multipleObjects: Yup.boolean(),
  topMargin: Yup.number().min(0, 'Top Margin must be a non-negative number'),
  leftMargin: Yup.number().min(0, 'Left Margin must be a non-negative number'),
  rightMargin: Yup.number().min(0, 'Right Margin must be a non-negative number'),
  bottomMargin: Yup.number().min(0, 'Bottom Margin must be a non-negative number'),
  creditFree: Yup.boolean(),
  creditAmount: Yup.number(),
  selectedCategories: Yup.array(),
  variants: Yup.array(),
  dxfFile: Yup.string(),
  dxfFileName: "", dxfFileSize: null
});

const Products = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false)
  const [initialValues, setInitialValues] = useState(schema);
  const [id, setId] = useState("")

  const { data: cat } = useQuery("getCat", () => apiService.getCategoriesWithoutParents()) || {}

  const categories = cat?.categories
  const { data, isLoading: loadingProducts, refetch } = useQuery("getMaterials", () =>
    apiService.getMaterials()
  );

  const addProduct = useMutation((data) => apiService.addMaterial(data), {
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
  const updateProduct = useMutation((data) => apiService.updateMaterial(data, id), {
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
  const deleteProduct = useMutation((data) => apiService.deleteMaterial(data, id), {
    onSuccess: (data) => {
      Toastify("success", data?.message);
      setIsOpen(false);
      setId("")
      setIsDelete(false)
      setInitialValues(schema);
      refetch()
    },
    onError: (err) => {
      Toastify("error", err?.message);
    },
  });



  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    enableReinitialize: true,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit: (values, { resetForm }) => {


      const formData = new FormData()



      const obj = {
        roll_code: values.rollCode,
        name: values.name,
        length: values.length,
        width: values.width,
        styrile_type: values.styrileType,
        blade_type: values.bladeType,
        usage_times: values.usageTimes,
        product_number: values.productNumber,
        manufacturer: values.manufacturer,
        category: values.category,
        batch_code: values.batchCode,
        used_length: values.usedLength,
        description: values.description,
        length_balance: values.lengthBalance,
        stock: values.stock,
        available_stock: values.availableStock,
        media: values.media,
        data_input_description: values.dataInputDescription,
        l1_cd: values.l1CD,
        l2_cd: values.l2CD,
        l3_cd: values.l3CD,
        l1_cs: values.l1CS,
        l2_cs: values.l2CS,
        l3_cs: values.l3CS,
        l1_ct: values.l1CT,
        l2_ct: values.l2CT,
        l3_ct: values.l3CT,
        cs_first_cut_layer: values.csFirstCutLayer,
        cs_second_cut_layer: values.csSecondCutLayer,
        cs_third_cut_layer: values.csThirdCutLayer,
        straight_line_after_cutting: values.straightLineAfterCutting,
        sl_first_cut_layer: values.slFirstCutLayer,
        sl_second_cut_layer: values.slSecondCutLayer,
        sl_third_cut_layer: values.slThirdCutLayer,
        uv_sterlization: values.uvSterlization,
        minimum_cuts: values.minimumCuts,
        maximum_cuts: values.maximumCuts,
        multiple_objects: values.multipleObjects,
        top_margin: values.topMargin,
        left_margin: values.leftMargin,
        right_margin: values.rightMargin,
        bottom_margin: values.bottomMargin,
        credit_free: values.creditFree,
        credit_amount: values.creditAmount,
        selected_categories: values.selectedCategories || [],
        variants: values.variants || [],
        dxf_file: values.dxfFile,
        dxf_file_name: values.dxfFileName, dxf_file_size: values.dxfFileSize
      }

      Object.keys(obj)?.map(k => {
        formData.append(k, obj[k])
      })


      const media = values.media

      media?.forEach(m => {
        formData.append("media", m)
      })



      if (id) {

        updateProduct.mutate(obj);
      } else {

        addProduct.mutate(obj, {
          onSuccess: () => {
            resetForm()
          }
        });
      }

    },
  });



  useEffect(() => {
    if (!isOpen) {
      setInitialValues(schema)
      setId("")
    }
  }, [isOpen])

  const buttonStyles = {
    display: 'inline-block',
    padding: '10px 20px',
    color: 'blue',
    textDecoration: 'none',
    borderRadius: '4px',
    backgroundColor: "transparent",
    border: 'none',
    cursor: 'pointer',
  };



  const columns = [
    {
      title: "Product Name", dataIndex: "name", key: "name", render: (data, row) => (
        <button
          style={buttonStyles}
          onClick={() => {
            setId(row?._id)
            setInitialValues({
              rollCode: row?.roll_code,
              name: row?.name,
              manufacturer: row?.manufacturer,
              length: row?.length,
              width: row?.width,
              styrileType: row?.styrile_type,
              bladeType: row?.blade_type,
              usageTimes: row?.usage_times,
              batchCode: row?.batch_code,
              usedLength: row?.used_length,
              category: row?.category?._id,
              lengthBalance: row?.length_balance,
              productNumber: row?.product_number,
              description: row?.description,
              media: row?.media,
              dataInputDescription: row?.data_input_description,
              l1CD: row?.l1_cd,
              l2CD: row?.l2_cd,
              l3CD: row?.l3_cd,
              l1CS: row?.l1_cs,
              l2CS: row?.l2_cs,
              l3CS: row?.l3_cs,
              l1CT: row?.l1_ct,
              l2CT: row?.l2_ct,
              l3CT: row?.l3_ct,
              csFirstCutLayer: row?.cs_first_cut_layer,
              csSecondCutLayer: row?.cs_second_cut_layer,
              csThirdCutLayer: row?.cs_third_cut_layer,
              straightLineAfterCutting: row?.straight_line_after_cutting,
              slFirstCutLayer: row?.sl_first_cut_layer,
              slSecondCutLayer: row?.sl_second_cut_layer,
              slThirdCutLayer: row?.sl_third_cut_layer,
              uvSterlization: row?.uv_sterlization,
              minimumCuts: row?.minimum_cuts,
              maximumCuts: row?.maximum_cuts,
              multipleObjects: row?.multiple_objects,
              topMargin: row?.top_margin,
              leftMargin: row?.left_margin,
              rightMargin: row?.right_margin,
              bottomMargin: row?.bottom_margin,
              creditFree: row?.credit_free,
              creditAmount: row?.credit_amount,
              selectedCategories: row?.selected_categories || [],
              variants: row?.variants || [],
              dxfFile: row?.dxf_file,
              dxfFileName: row.dxf_file_name, dxfFileSize: row?.dxf_file_size
            });
            setIsOpen(true);
          }}>
          {data}
        </button>
      )
    },
    { title: "Length", dataIndex: "length", key: "length" },
    { title: "Width", dataIndex: "width", key: "width" },
    { title: "Sterile Type", dataIndex: "styrile_type", key: "styrile_type" },
    { title: "Blade Type", dataIndex: "blade_type", key: "blade_type" },
    { title: "Usage Times", dataIndex: "usage_times", key: "usage_times" },
    { title: "Batch Code", dataIndex: "batch_code", key: "batch_code" },
    { title: "Used Length", dataIndex: "used_length", key: "used_length" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Available Stock", dataIndex: "available_stock", key: "available_stock" },
    {
      title: "Length Balance",
      dataIndex: "length_balance",
      key: "length_balance",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "name",

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


                setInitialValues({
                  rollCode: row?.roll_code,
                  name: row?.name,
                  length: row?.length,
                  width: row?.width,
                  styrileType: row?.styrile_type,
                  manufacturer: row?.manufacturer,
                  bladeType: row?.blade_type,
                  usageTimes: row?.usage_times,
                  batchCode: row?.batch_code,
                  usedLength: row?.used_length,
                  category: row?.category?._id,
                  description: row?.description,
                  productNumber: row?.product_number,
                  lengthBalance: row?.length_balance,
                  media: row?.media,
                  dataInputDescription: row?.data_input_description,
                  l1CD: row?.l1_cd,
                  l2CD: row?.l2_cd,
                  l3CD: row?.l3_cd,
                  l1CS: row?.l1_cs,
                  l2CS: row?.l2_cs,
                  l3CS: row?.l3_cs,
                  l1CT: row?.l1_ct,
                  l2CT: row?.l2_ct,
                  l3CT: row?.l3_ct,
                  csFirstCutLayer: row?.cs_first_cut_layer,
                  csSecondCutLayer: row?.cs_second_cut_layer,
                  csThirdCutLayer: row?.cs_third_cut_layer,
                  straightLineAfterCutting: row?.straight_line_after_cutting,
                  slFirstCutLayer: row?.sl_first_cut_layer,
                  slSecondCutLayer: row?.sl_second_cut_layer,
                  slThirdCutLayer: row?.sl_third_cut_layer,
                  uvSterlization: row?.uv_sterlization,
                  minimumCuts: row?.minimum_cuts,
                  maximumCuts: row?.maximum_cuts,
                  multipleObjects: row?.multiple_objects,
                  topMargin: row?.top_margin,
                  leftMargin: row?.left_margin,
                  rightMargin: row?.right_margin,
                  bottomMargin: row?.bottom_margin,
                  creditFree: row?.credit_free,
                  creditAmount: row?.credit_amount,
                  selectedCategories: row?.selected_categories || [],
                  variants: row?.variants || [],
                  dxfFile: row?.dxf_file,
                  dxfFileName: row.dxf_file_name, dxfFileSize: row?.dxf_file_size

                });
                setIsOpen(true);
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
              setId(row?._id)
              setIsDelete(true)
            }} height={20} alt="delete" />
          </>
        );
      },
    },
  ];


  const handleYes = () => {
    deleteProduct.mutate({
      _id: id
    })
  }

  return (
    <Layout Header={(setVisible, visible) => <Header title="Products" setVisible={setVisible} visible={visible} />}>
      <ConfirmationModal yesTitle={deleteProduct.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this material?" yesClick={handleYes} noClick={() => setIsDelete(false)} />

      {
        !isOpen ?
          <>
            <div className="material-header">
              <h2>Products ({data?.length})</h2>
              <button onClick={() => setIsOpen(true)} className="add-material-btn">
                Add Product
              </button>
            </div>

            <Table dataSource={Array.isArray(data) && data?.length > 0 ? data : []}
              scroll={{ x: "100%" }}
              style={{ zIndex: "-1" }}
              pagination={{
                defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '50', '100', '200']
              }}
              columns={columns} loading={loadingProducts}
            />
          </>
          :
          <ProductSection setIsOpen={setIsOpen} isEdit={id} categories={categories} formik={formik} title={id ? "Update Product" : "Add Product"} />
      }
    </Layout>
  );
};

export default Products;
