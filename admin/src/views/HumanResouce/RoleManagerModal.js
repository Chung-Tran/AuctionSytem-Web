
import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import roleApi from 'src/service/RoleService';
import { DatePicker, Space } from 'antd';
import moment from 'moment';


function RoleManagerModal(props) {
    let { type, setShowModal, data } = props;
    const [show, setShow] = useState(false);
    let value = data?.selectedRows?.[0] || null;
    const [roleInfo, setRoleInfo] = useState();

    useEffect(() => {
        type !== null ? setShow(true) : setShow(false);
    }, [type]);
    useEffect(() => {
        const fetchData = async () => {
            if (data !== null) {
                await roleApi.getByID(data?.selectedRows[0]?.roleID).then(result => {
                    setRoleInfo(result.data)
                })
            } else {
                setRoleInfo(null)
            }

        }
        fetchData();
    }, [data]);
    const handleSubmit = (values) => {
        if (!values.RoleName ) {
            toast.error("Dữ liệu không hợp lệ");
            return;
        };
        if (type == "Thêm") {
            const createRole = roleApi.create(values).then(() => {
                setRoleInfo(null)
                setShow(false);              
            })

        } else if (type == "Sửa") {
            const updateRole = roleApi.update(values)
        }
        
        setShowModal(null);
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            RoleID: !!roleInfo ? roleInfo?.roleID : '',
            RoleName: !!roleInfo ? roleInfo?.roleName : '',
            RoleDescription: !!roleInfo ? roleInfo?.roleDescription : '',
            CreatedBy: !!roleInfo ? roleInfo?.createdBy : JSON.parse(localStorage.getItem("userinfo")).displayname || '',
            CreatedAt: !!roleInfo ? roleInfo?.createdAt : new Date().toLocaleDateString('en-GB'),
        },
        onSubmit: values => {
            handleSubmit(values)
        },
    });
    return (
        <CModal
            show={show}
            onClose={() => { setShow(false); setShowModal(null) }}
            visible={show}
            className='modal-xl'
        >
            <CModalHeader closeButton>{type} người dùng</CModalHeader>
            <CModalBody className='p-4' >
                <CForm onSubmit={formik.handleSubmit} id='RoleForm'>
                    <CRow>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Mã vai trò</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className='input-readonly' value={formik.values.RoleID} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Tên vai trò</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} name='RoleName' value={formik.values.RoleName} onChange={formik.handleChange}/>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Mô tả</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} name='RoleDescription' value={formik.values.RoleDescription} onChange={formik.handleChange}/>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Ngày tạo</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <Space direction="vertical" size={17} className='w-100 '>
                                        <DatePicker size='large' className='w-100 input-readonly' value={moment(formik.values.CreatedAt, 'DD/MM/YYYY')}/>
                                    </Space>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Người tạo</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                <CFormInput className="input-readonly" value={formik.values.CreatedBy} />
                                </CCol>
                            </CRow>
                        </CCol>

                    </CRow>
                </CForm>

            </CModalBody>
            <CModalFooter>
                <CButton color="primary" type='submit' form='RoleForm'>Lưu</CButton>{' '}
                <CButton
                    color="secondary"
                    onClick={() => { setShow(false); setShowModal(null) }}
                >Đóng</CButton>
            </CModalFooter>
        </CModal>

    )
}

export default RoleManagerModal
