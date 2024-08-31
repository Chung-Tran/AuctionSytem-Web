import { CButton, CCardBody, CCardHeader, CCol, CContainer, CFormLabel, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImportTableResult from './ImportTableResult';
import ImportModal from './ImportModal';
import ImportProduct from './ImportProduct';
import productApi from 'src/service/ProductService';
import inventoryApi from 'src/service/InventoryService';
import { VND } from 'src/utils/validateField';

function ImportManager() {
    const tableHeader = [

        {
            name: 'Mã phiếu',
            selector: row => row.inventoryID,
            sortable: true,
            maxWidth: "130px"
        },
        {
            name: 'Ngày nhập kho',
            selector: row => row.createdAt,
            sortable: true
        },
        {
            name: 'Đối tác',
            selector: row => row.partner,
        },
        {
            name: 'Tổng số lượng',
            selector: row => row.quantity,
        },
        {
            name: 'Tổng thanh toán',
            selector: row => row.price,
            cell: (row)=>(VND.format(row.price))
        },
        {
            name: 'Nhân viên',
            selector: row => row.userName,
        },

    ]
    const [showModal, setShowModal] = useState(null);
    const [modalValue, setModalValue] = useState({});
    const [data, setData] = useState(null);
    const permissionValue = JSON.parse(localStorage.getItem('permission')) || [];

    const handleShowModal = (type) => {
        if (type === 'Xem' || type === 'Xóa' || type === 'Sửa') {
            if (modalValue.selectedCount != 1) {
                return toast.info('Vui lòng chỉ chọn 1 dòng dữ liệu ')
            }
            setData(modalValue)
            setShowModal(type);
        } else if (type === 'Thêm') {
            setData(null)
            setShowModal(type)
        } else {

        }
    }
    const [allInvoiceImport, setAllInvoiceImport] = useState([]);
    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        inventoryApi.getAll().then(result => setAllInvoiceImport(result));
    }
    const resetData = async () => {
        setTimeout(() => {
            fetchData();
        }, 1000);
    }
    const tableValues = {
        tableHeader,
        tableBody: allInvoiceImport,
    }
    const showError = () => {
        toast.error("Không thể thao tác với phiếu đã hoàn thành ")
    }
    const hasPermission = (permission) => permissionValue.includes(permission);

    return (
        <>
            {hasPermission(15) && (
                <ImportProduct resetData={resetData} />
            )}

            <ImportTableResult value={tableValues} selectValue={setModalValue} />
            <div className="d-flex flex-row docs-highlight mb-3 mt-3"  >
                {hasPermission(14) && (
                    <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Xem')} >Xem</CButton>

                )}
                {hasPermission(16) && (
                    <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => showError()}>Sửa</CButton>

                )}
                {hasPermission(17) && (
                    <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => showError()}>Xóa</CButton>

                )}
            </div>
            <ImportModal type={showModal} setShowModal={setShowModal} data={data} />

        </>
    )
}

export default ImportManager
