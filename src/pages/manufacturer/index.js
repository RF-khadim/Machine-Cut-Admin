import { useNavigate } from "react-router"
import Header from "../../components/header"
import Layout from "../../layout"
import './styles.css'
import { Table } from "antd"
import { useMutation, useQuery } from "react-query"
import Delete from "../../assets/images/delete.png";
import Edit from "../../assets/images/edit.png";
import apiService from "../../services/apiService"
import { useState } from "react"
import ConfirmationModal from "../../components/modal/confirmationModal"
import Toastify from "../../components/toast"

const Manufacturer = () => {
    const navigate = useNavigate()

    const [id, setId] = useState("")
    const [isDelete, setIsDelete] = useState(false)

    const { data: manufacturers, isLoading, refetch } = useQuery("getManufacturers", () => apiService.getManufacturers())

    const deleteManufacturer = useMutation((data) => apiService.deleteManufacturer(data), {
        onSuccess: (data) => {
            setId("")
            setIsDelete(false)
            refetch()
            Toastify("success", data?.message)
        },
        onError: (err) => {
            Toastify("error", err?.message)

        }
    })


    const columns = [
        {
            title: "Name",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "Status",
            key: "status",
            render: (data, row) => {
                return <p className={`${data ? "active-status" : "disabled"}`} > {data ? "Active" : "Disabled"}</p>
            }
        },
        {
            title: "Address",
            key: "address",
            dataIndex: "address"
        },
        {
            title: "Phone",
            key: "phone",
            dataIndex: "phone"
        },

        {
            title: "City",
            key: "city",
            dataIndex: "city"
        },
        {
            title: "State",
            key: "state",
            dataIndex: "state"
        },
        {
            title: "Zip",
            key: "zip",
            dataIndex: "zip"
        },

        {
            title: "Edit",
            render: (data, row) => {
                return (
                    <>
                        <img
                            src={Edit}
                            onClick={() => {
                                navigate(`/manufacturer/${row?._id}`)
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

    ]

 

    const handleYes = () => {
        deleteManufacturer.mutate({
            _id: id
        })
    }

    return (
        <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Manufacturer" />}>
            <ConfirmationModal yesTitle={deleteManufacturer.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this member?" yesClick={handleYes} noClick={() => setIsDelete(false)} />


            <div className="member-controls">
                <div>
                    <p>Manufacturer</p>
                </div>
                <div style={{ gap: "20px", display: "flex" }}>

                    <button onClick={() => navigate(`/manufacturer/add`)}>Add Manufacturer</button>
                </div>

            </div>
            <div style={{
                marginTop: "60px"
            }}>

                <Table

                    dataSource={manufacturers}
                    loading={isLoading}
                    columns={columns}
                    scroll={{
                        x: "100%"
                    }}
                    onRow={(record, rowIndex) => {
                        return {
                            style: {
                                cursor: "pointer"
                            }
                        };
                    }}
                    pagination={{
                        position: ["topRight"],
                        showTotal: (total, range) => (
                            <span style={{ left: 0, position: "absolute" }}>
                                Total Results {range[0]}-{range[1]} of {total}
                            </span>
                        ),
                        defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']
                    }}

                />
            </div>
        </Layout>

    )
}

export default Manufacturer