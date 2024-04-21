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

const Members = () => {
    const navigate = useNavigate()

    const [id, setId] = useState("")
    const [isDelete, setIsDelete] = useState(false)

    const { data: profile, isLoading, refetch } = useQuery("getMembers", () => apiService.getProfiles())

    const deleteMember = useMutation((data) => apiService.deleteProfile(data), {
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
            title: "ID",
            key: "id",
            dataIndex: "id"
        },
        {
            title: "Parent Name",
            key: "parent",
            dataIndex: ["parent", "name"]
        },

        {
            title: "Distributor Type",
            key: "role",
            dataIndex: "role"
        },
        {
            title: "Credits",
            key: "credits",
            render: (data, row) => {
                return <span>{row?.credit_overdraft ? "Credit Overdraft" : row?.monthly_billed ? "Monthly Billed" : row?.credit_based ? "Credit Based" : "N/A"}</span>
            }
        },
        {
            title: "Edit",
            render: (data, row) => {
                return (
                    <>
                        <img
                            src={Edit}
                            onClick={() => handleRowClick(row, data)}
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

    const handleRowClick = (record, index) => {
        if (record?.role === "service_point") {
            navigate(`/members/editServicePoint/${record?._id}`)
        }
        if (record?.role === "distributor") {
            navigate(`/members/editDistributor/${record?._id}`)
        }
    }

    const handleYes = () => {
        deleteMember.mutate({
            _id: id
        })
    }

    return (
        <Layout Header={(setVisible, visible) => <Header setVisible={setVisible} visible={visible} title="Members" />}>
            <ConfirmationModal yesTitle={deleteMember.isLoading ? "Please wait..." : "Yes"} isOpen={isDelete} setIsOpen={setIsDelete} message="Are you sure you want to delete this member?" yesClick={handleYes} noClick={() => setIsDelete(false)} />


            <div className="member-controls">
                <div>
                    <p>Members</p>
                </div>
                <div className="members-control-btn">

                    <button onClick={() => navigate("/members/distributor")}>Add Parent</button>
                    <button onClick={() => navigate("/members/servicePoint")}>Add Service Point</button>
                    <button onClick={() => navigate(`/members/distributor`)}>Add Distributor</button>
                </div>

            </div>
            <div style={{
                marginTop: "60px"
            }}>

                <Table

                    dataSource={profile}
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
        </Layout>

    )
}

export default Members