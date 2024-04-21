import { useMutation, useQuery } from "react-query"
import Header from "../../components/header"
import Layout from "../../layout"
import Edit from "../../assets/images/edit.png";
import Delete from "../../assets/images/delete.png";

import apiService from "../../services/apiService"
import { Table } from "antd"
import './styles.css'
import { useNavigate } from "react-router"
import ConfirmationModal from "../../components/modal/confirmationModal";
import { useState } from "react";
import Toastify from "../../components/toast";

const Machines = () => {

    const navigate = useNavigate()

    const { data: machines, isLoading, refetch } = useQuery("getMachines", () => apiService.getMachines())

    const deleteMachine = useMutation((data)=>apiService.deletMachine(data),{
        onSuccess:(data)=>{
            refetch()
            setIsDelete(false)
            setId("")
            Toastify("success",data?.message)
        },
        onError:(err)=>{
            Toastify("success",err?.message)

        }
    })

    const [isDelete, setIsDelete] = useState(false)
    const [id, setId] = useState("")



    const columns = [
        {
            title: "Serial Number",
            key: "serial_number",
            dataIndex: "serial_number"
        },
        {
            title: "Machine name",
            key: "machine_name",
            dataIndex: "machine_name"
        },
        {
            title: "Machine type",
            key: "machine_type",
            dataIndex: "machine_type"
        },
        {
            title: "Prod. Version",
            key: "firmware",
            render: (data, row) => {
                return <p>{row?.firmware?.[0]?.product_version}</p>
            }
        },
        {
            title: "Firm. Version",
            key: "firmware",
            render: (data, row) => {
                return <p>{row?.firmware?.[0]?.firmware_version}</p>
            }
        },
        // {
        //     title: "No. Of Machines",
        //     key: "no_of_machines",
        //     render: (data, row) => {
        //         return <p>{row?.no_of_machines?.lenght}</p>
        //     }
        // },
        {
            title: "Service Point ID",
            key: "firmware",
            render: (data, row) => {
                return <p>{row?.firmware?.[0]?.service_point_id}</p>
            }
        },
        {
            title: "Status",
            key: "firmware",
            render: (data, row) => {
                return <p className={`${data?.status ? "connected" : "disconnected"}`}>{data?.status ? "Connected" : "Disconnected"}</p>
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
                                navigate(`/machines/edit/${row?._id}`)
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
        deleteMachine.mutate({
            _id: id
        })
    }




    return (
        <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Machines" />}>
            <ConfirmationModal yesTitle={deleteMachine.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this material?" yesClick={handleYes} noClick={() => setIsDelete(false)} />

            <div className="machine-controls">
                <button className="refresh" type="button" onClick={() => refetch()}>{isLoading ? "Refreshing..." : "Refresh"}</button>
                <button onClick={() => navigate("/machines/add")}>Add</button>
                <button onClick={() => navigate("/machines/transfer")}>Transfer Machine</button>
                <button onClick={() => navigate(`/machines/firmware`)}>Firmware</button>
            </div>
            <div style={{
                marginTop: "60px"
            }}>

                <Table

                    dataSource={machines}
                    loading={isLoading}
                    columns={columns}
                    scroll={{
                        x: "100%"
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
        </Layout >
    )
}

export default Machines