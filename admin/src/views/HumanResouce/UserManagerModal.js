
import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import roleApi from 'src/service/RoleService';
import userApi from 'src/service/UserService';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

function UserManagerModal(props) {
    let { type, setShowModal, data  } = props;
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [role, setRole] = useState([]);

    useEffect(() => {
        type !== null ? setShow(true) : setShow(false);
    }, [type])
    useEffect(() => {
        const fetchData = async () => {
            if (data !== null ) {
                await userApi.getByID(data?.selectedRows[0]?.userID).then(result => {
                    setUserInfo(result.data) 
                })
            } else {
                setUserInfo(null)
            }
            await roleApi.getAllrole().then(result => {
                setRole(result.data)
            })

        }
        fetchData();
    }, [data]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            userID: !!userInfo ? userInfo?.userID : '',
            Email: !!userInfo ? userInfo?.email : '',
            DisplayName: !!userInfo ? userInfo?.displayname : '',
            Password: '',
            StatusActive: !!userInfo ? userInfo?.status : 1,
            Phone: !!userInfo ? userInfo?.phone : '',
            GenderID: !!userInfo ? userInfo?.genderID : 1,
            Address: !!userInfo ? userInfo?.address : '',
            RoleID: !!userInfo ? userInfo?.roleID : 1,
            PasswordConfirm: ''
        },
        onSubmit: values => {
            handleSubmit(values)

        },
    });
    const handleSubmit = (values) => {
        if (!values.Email || !values.DisplayName || !values.StatusActive  || !values.RoleID) {
            toast.error("Dữ liệu không hợp lệ");
            return;
        };
        if (values.PasswordConfirm !== values.Password) {
            toast.error("Mật khẩu không trùng khớp");
            return
        }
        if (type == "Thêm") {
            const createUSer = userApi.create(values)
            setUserInfo(null)
            setShow(false);
        } else if (type == "Sửa") {
            const updateUser = userApi.update(values)
        }
 
        setShowModal(null);
        
    }
    return (
        <CModal
            show={show}
            onClose={() => { setShow(false); setShowModal(null); setUserInfo(null); formik.resetForm(); }}
            visible={show}
            className='modal-xl'
        >
            <CModalHeader closeButton>{type} người dùng</CModalHeader>
            <CModalBody className='p-4' >
                <CForm onSubmit={formik.handleSubmit} id='UserForm'>
                    <CRow>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>ID</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className='input-readonly' value={formik.values.userID} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Tên nhân viên</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} name='DisplayName' onChange={formik.handleChange} defaultValue={formik.values.DisplayName} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Email</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} type='email' name='Email' onChange={formik.handleChange} defaultValue={formik.values.Email} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Chức vụ</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormSelect className={type === 'Xem' ? 'input-readonly' : ''} name='RoleID' onChange={formik.handleChange} value={formik.values.RoleID}>
                                        {role && role.map(item => (
                                            <option value={item?.roleID}>{item.roleName}</option>
                                        ))}
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Số điện thoại</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} name='Phone' onChange={formik.handleChange} defaultValue={formik.values.Phone} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Địa chỉ</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} name='Address' onChange={formik.handleChange} defaultValue={formik.values.Address} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Giới tính</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormSelect className={type === 'Xem' ? 'input-readonly' : ''} name='GenderID' onChange={formik.handleChange} value={formik.values.GenderID }>
                                        <option value={0}></option>
                                        <option value={1}>Nam</option>
                                        <option value={2}>Nữ</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Trạng thái</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormSelect className={type === 'Xem' ? 'input-readonly' : ''} name='StatusActive' onChange={formik.handleChange} value={formik.values.StatusActive }>
                                        <option value={0}></option>
                                        <option value={1}>Kích hoạt</option>
                                        <option value={2}>Ngưng kích hoạt</option>
                                    </CFormSelect>
                                </CCol>
                            </CRow>
                        </CCol>
                        {!data && (
                            <>
                                <CCol md="6" className='mb-3'>
                                    <CRow>
                                        <CCol md="4" >
                                            <CFormLabel className='mt-1' >Mật khẩu đăng nhập</CFormLabel>
                                        </CCol>
                                        <CCol md="7" >
                                            <CFormInput name='Password' type='password' value={formik.values.Password} onChange={formik.handleChange} />
                                        </CCol>
                                    </CRow>
                                </CCol>

                                <CCol md="6" className='mb-3'>
                                    <CRow>
                                        <CCol md="4" >
                                            <CFormLabel className='mt-1'>Nhập lại mật khẩu</CFormLabel>
                                        </CCol>
                                        <CCol md="7" >
                                            <CFormInput name='PasswordConfirm' value={formik.values.PasswordConfirm} onChange={formik.handleChange} type='password' />
                                        </CCol>
                                    </CRow>
                                </CCol>
                            </>

                        )}

                    </CRow>
                </CForm>

            </CModalBody>
            <CModalFooter>
                <CButton color="primary" type='submit' form='UserForm'>Lưu</CButton>
                <CButton
                    color="secondary"
                    onClick={() => { setShow(false); setShowModal(null) }}
                >Đóng</CButton>
            </CModalFooter>
        </CModal>

    )
}

export default UserManagerModal
