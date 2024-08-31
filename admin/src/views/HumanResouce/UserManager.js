
import { CButton, CCardBody, CCardHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import UserManagerModal from './UserManagerModal.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTableResult from 'src/views/HumanResouce/UserTableResult.js';
import userApi from 'src/service/UserService.js';
import ModalQuestion from '../Nofitication/ModalQuestion.js';
import { useSelector } from 'react-redux';
function UserManager() {
  const tableHeaderValue = [

    {
      name: 'ID',
      selector: row => row.userID,
      sortable: true,
      maxWidth: "100px"
    },
    {
      name: 'Tên nhân viên',
      selector: row => row.displayname,
      sortable: true
    },
    {
      name: 'Chức vụ',
      selector: row => row.roleName,
      sortable: true
    },
    {
      name: 'Email',
      selector: row => row.email,
    },
    {
      name: 'Trạng thái',
      selector: row => row.status,
      sortable: true,
      maxWidth: "170px",
    },
  ]

  const [showModal, setShowModal] = useState(null);
  const [modalValue, setModalValue] = useState({});
  const [data, setData] = useState(null);
  const [allUser, setAllUser] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const permissionValue = JSON.parse(localStorage.getItem('permission')) || [];
  const fetchData = async () => {
    await userApi.getAllUser().then(result => {
      setAllUser(result.data);
    });
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, "1000");
  }, [showModal])

  const handleDeleteClick = () => {
    if (modalValue.selectedCount != 1) {
      return toast.info('Vui lòng chỉ chọn 1 dòng dữ liệu ')
    }
    setIsModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (modalValue.selectedCount !== 1) {
      return toast.info('Vui lòng chọn 1 dòng dữ liệu để xóa');
    }
    await userApi.delete(modalValue.selectedRows[0].userID);
    setModalValue(null);
    await fetchData();

    setIsModalVisible(false);
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false);
  };
  const tableValues = {
    tableHeaderValue: tableHeaderValue,
    tableBodyValue: allUser,
  }

  const handleShowModal = (type) => {
    if (type === 'Xem' || type === 'Xóa' || type === 'Sửa') {
      if (modalValue.selectedCount != 1) {
        return toast.info('Vui lòng chọn 1 dòng dữ liệu ')
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
      <UserTableResult value={tableValues} selectValue={setModalValue} />
      <div className="d-flex flex-row docs-highlight mb-3 mt-3"  >
        {hasPermission(1) && (
          <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Xem')}>Xem</CButton>
        )}
        {hasPermission(2) && (
          <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Thêm')}>Thêm</CButton>
        )}
        {hasPermission(3) && (
          <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleShowModal('Sửa')}>Sửa</CButton>
        )}
        {hasPermission(4) && (
          <CButton className='mx-2 btn btn-warning' style={{ minWidth: 70 }} onClick={() => handleDeleteClick()}>Xóa</CButton>
        )}
      </div>
      <UserManagerModal type={showModal} setShowModal={setShowModal} data={data} />
      <ModalQuestion
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  )
}

export default UserManager
