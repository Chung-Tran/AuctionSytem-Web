
import { CButton, CCardBody, CCardHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import RoleManagerModal from './RoleManagerModal.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoleTableResult from './RoleTableResult.js';
import PermissionModal from './PermissionModal.js';
import roleApi from 'src/service/RoleService.js';

function RoleManager() {
    const [allRole, setAllRole] = useState();
    const [showModal, setShowModal] = useState(null);
    const [showPermissionModal, setShowPermissionModal] = useState(null);
    const [modalValue, setModalValue] = useState({});
    const [data, setData] = useState(null);
    const [roleSelected, setRoleSelected] = useState();
    const permissionValue = JSON.parse(localStorage.getItem('permission')) || [];
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await roleApi.getAllrole().then(result => {
            setAllRole(result.data)
        });
    }
    
    //reset data
    useEffect(() => {
        setModalValue({})
        setTimeout(() => {
            fetchData();
        },"1000")
    }, [showModal])
    
    const tableHeaderValue = [

        {
            name: 'Mã vai trò',
            selector: row => row.roleID,
            sortable: true,
            maxWidth: "150px"
        },
        {
            name: 'Tên vai trò',
            selector: row => row.roleName,
            sortable: true
        },
        {
            name: 'Mô tả',
            selector: row => row.roleDescription,
            sortable: true
        },
        {
            name: 'Ngày tạo',
            selector: row => row.createdAt,
        },
        {
            name: 'Người tạo',
            selector: row => row.createdBy,
            sortable: true,
            maxWidth: "170px"
        },
    ]
    const tableValues = {
        tableHeaderValue:tableHeaderValue,
        tableBodyValue:allRole,
    }

    const handleShowPermissionModal = () => {
        if (modalValue.selectedCount != 1) {
            return toast.info('Vui lòng chỉ chọn 1 dòng dữ liệu ')
        }
        setRoleSelected(modalValue)
        setShowPermissionModal(!showPermissionModal);
    }
    const handleShowModal = (type) => {
        if (type === 'Xem' || type === 'Xóa' || type === 'Sửa') {
            if (modalValue.selectedCount != 1) {
                return toast.info('Vui lòng chỉ chọn 1 dòng dữ liệu ');
            }
            setData(modalValue)
            setShowModal(type);
        } else if (type === 'Thêm') {
            setData(null)
            setShowModal(type)
        }
    }
    const hasPermission = (permission) => permissionValue.includes(permission);

    return (
        <>
            {hasPermission(5) && (
            <RoleTableResult value={tableValues} selectValue={setModalValue} />
            )}
            <div className="d-flex flex-row docs-highlight mb-3 mt-3"  >
            {hasPermission(5) && (
                <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Xem')} >Xem</CButton>
                )}
            {hasPermission(6) && (
                <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Thêm')}>Thêm</CButton>
                )}
            {hasPermission(7) && (
                <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }}>Xóa</CButton>
                )}
            {hasPermission(8) && (
                <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Sửa')}>Sửa</CButton>
                )}
            {hasPermission(9) && (
                <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={()=>handleShowPermissionModal()}>Phân quyền</CButton>
                )}
            </div>
            <RoleManagerModal type={showModal} setShowModal={setShowModal} data={data} />
            <PermissionModal setShowModal={ setShowPermissionModal} type={showPermissionModal} data={roleSelected} />
        </>
    )
}

export default RoleManager
