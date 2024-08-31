import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { DatePicker, Radio, Space } from 'antd';

function CheckModal(props) {
    let { type, setShowModal, data } = props;
    const [show, setShow] = useState(false);
    let value = data?.selectedRows?.[0] || null
    useEffect(() => {
        type !== null ? setShow(true) : setShow(false);
    }, [type])
    return (
        <CModal
            show={show}
            onClose={() => { setShow(false); setShowModal(null) }}
            visible={show}
            className='modal-xl'
        >
            <CModalHeader closeButton>{type} người dùng</CModalHeader>
            <CModalBody className='p-4' >
                <CForm >
                    <CRow>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Mã sản phẩm</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className='input-readonly' value={data ? value?.roleId : ''} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Tên sản phẩm</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} defaultValue={!!data ? value?.roleName : ''} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Đã nhập</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} defaultValue={!!data ? value?.roleDesc : ''} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Đã bán</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} defaultValue={!!data ? value?.roleDesc : ''} />
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol md="6" className='mb-3'>
                            <CRow>
                                <CCol md="4" >
                                    <CFormLabel className='mt-1'>Số lượng tồn</CFormLabel>
                                </CCol>
                                <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} defaultValue={!!data ? value?.roleDesc : ''} />
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
                                        <DatePicker size='large' className='w-100 input-readonly' />
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
                                    <CFormInput className='input-readonly' defaultValue={!!data ? value?.roleDesc : ''} />
                                </CCol>
                            </CRow>
                        </CCol>

                    </CRow>
                </CForm>

            </CModalBody>
            <CModalFooter>
                <CButton color="primary">Lưu</CButton>{' '}
                <CButton
                    color="secondary"
                    onClick={() => { setShow(false); setShowModal(null) }}
                >Đóng</CButton>
            </CModalFooter>
        </CModal>

    )
}

export default CheckModal
