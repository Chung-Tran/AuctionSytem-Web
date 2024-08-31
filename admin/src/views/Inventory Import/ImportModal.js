import { CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { DatePicker, Radio, Space } from 'antd';
import inventoryApi from 'src/service/InventoryService';
import { useFormik } from 'formik';
import moment from 'moment';
import noImage from '../../assets/images/no-image.jpg';
import { VND } from 'src/utils/validateField';
function ImportModal(props) {
    let { type, setShowModal, data } = props;
    const [show, setShow] = useState(false);
    let value = data?.selectedRows?.[0] || null;
    const [importInfo, setImportInfo] = useState();
    const [productList, setProductList] = useState([]);
    useEffect(() => {
        type !== null ? setShow(true) : setShow(false);
    }, [type]);
    
    useEffect(() => {
        data && inventoryApi.getByID(data.selectedRows[0].inventoryID).then(result => {
            if (result.success) {
                setImportInfo(result.data);
                setProductList(result.data.inventoryDetail)
            }
        })
    }, [data]);
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            InventoryID: !!importInfo ? importInfo?.inventoryID : '',
            UserID: !!importInfo ? importInfo?.createdBy : JSON.parse(localStorage.getItem("userinfo")).displayname || '',
            Partner: !!importInfo ? importInfo?.partner : '',
            Quantity: '',
            Price: !!importInfo ? importInfo?.price : 0,
            Discount: !!importInfo ? importInfo?.discount : '',
            Quantity: !!importInfo ? importInfo?.quantity : 0,
            Description: !!importInfo ? importInfo?.description : '',
            Total: !!importInfo ? importInfo?.total : 0,
            CreatedAt: !!importInfo ? importInfo?.total : new Date().toLocaleDateString()
        },
        onSubmit: values => {
            handleSubmit(values)

        },
    });
    const handleSubmit = (values) => {

        
    }
    return (
        <CModal
            show={show}
            onClose={() => { setShow(false); setShowModal(null) }}
            visible={show}
            className='modal-xl'
        >
            <CModalHeader closeButton>{type} phiếu nhập kho</CModalHeader>
            <CModalBody className='p-4' >
                <CForm >
                    <CRow md="12">
                        <CCol md="6">
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Mã phiếu</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                        <CFormInput className='input-readonly' value={formik.values.InventoryID} />
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Đối tác</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                        <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} value={formik.values.Partner} />
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Mô tả</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                        <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} value={formik.values.Description} />
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Tổng số lượng</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                        <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} value={formik.values.Quantity} />
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Tổng thanh toán</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                        <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} value={VND.format(formik.values.Total)} />
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Chiết khấu</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                    <CFormInput className={type === 'Xem' ? 'input-readonly' : ''} value={formik.values.Discount} />
                                    </CCol>
                                </CRow>
                            </CCol>

                            <CCol md="12" className='mb-3'>
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
                            <CCol md="12" className='mb-3'>
                                <CRow>
                                    <CCol md="4" >
                                        <CFormLabel className='mt-1'>Người tạo</CFormLabel>
                                    </CCol>
                                    <CCol md="7" >
                                        <CFormInput className='input-readonly' value={formik.values.UserID} />
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CCol>
                        <CCol md="6 " className='overflow-y-scroll ' style={{maxHeight:"500px"}}>
                            <CFormLabel className='fs-4 fixed text-center w-100' >Chi tiết nhập kho</CFormLabel>
                            <CRow md={12} className='mb-2 fw-medium'>
                                <CCol md={10} className='text-center'>Sản phẩm</CCol>
                                <CCol md={2}>SL</CCol>
                            </CRow>
                            {productList && productList.map((item) => (
                            <CRow md={12} className='mb-3'>
                            <CCol md={3}>
                                <img src={item.images[0] || noImage} alt='Not found' className='img-thumbnail'/>
                            </CCol>
                            <CCol md={7}>
                                        <CFormLabel className='fs-6 text-center overflow-hidden align-items-center mt-auto'>{ item.productName}</CFormLabel>
                            </CCol>
                                    <CCol md={2}>{ item.quantity}</CCol>
                    </CRow>
                        ))}
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

export default ImportModal
