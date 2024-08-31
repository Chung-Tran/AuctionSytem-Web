import React, { useEffect, useMemo, useState } from 'react'
import { CButton, CCardBody, CCardHeader, CCol, CContainer, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react';
import { DatePicker, Radio, Space } from 'antd';
import CIcon from '@coreui/icons-react';
import { cilDelete } from '@coreui/icons'
import productApi from 'src/service/ProductService';
import noImage from '../../assets/images/no-image.jpg';
import userApi from 'src/service/UserService';
import { useFormik } from 'formik';
import moment from 'moment';
import inventoryApi from 'src/service/InventoryService';
import partnerApi from 'src/service/PartnerService';
import { VND, convertToNumber } from 'src/utils/validateField';
function ImportProduct({ resetData }) {
    const [allProduct, setAllProduct] = useState([]);
    const [allPartner, setAllPartner] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [productFilter, setProductFilter] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        await productApi.getAllProduct().then(result => {
            if (result.success) {
                setAllProduct(result.data)
                setProductFilter(result.data)
            }
        });
        await partnerApi.getAll().then(result => {
            if (result.success) {
                setAllPartner(result.data);
            }
        });

    }
    const handleFilter = (e) => {
        const { name, value } = e.target;
        const filteredList = allProduct.filter((product) =>
            product[name].toString().toLowerCase().includes(value.toLowerCase())
        );

        setProductFilter(filteredList);
    }
    const handleProductClick = (selectedProduct) => {
        console.log(selectedProduct);
        const productIndex = selectedProducts.findIndex(
            (product) => product.productID === selectedProduct.productID
        );

        if (productIndex !== -1) {
            const updatedProducts = [...selectedProducts];
            updatedProducts[productIndex].quantity++;
            setSelectedProducts(updatedProducts);
        } else {
            setSelectedProducts((prevProducts) => [
                ...prevProducts,
                {
                    productName: selectedProduct.productName,
                    productID: selectedProduct.productID,
                    quantity: 1,
                    price: selectedProduct.price
                },
            ]);
        }
    };
    const handleChangeQuantity = (id, value) => {
        setSelectedProducts((prevProducts) => {
            return prevProducts.map((product) => {
                if (product.productID === id) {
                    return { ...product, quantity: value };
                }
                return product;
            });
        });
    }
    const handleDeleteProduct = (productId) => {
        setSelectedProducts((prevProducts) => {
            return prevProducts.filter((product) => product.productID !== productId);
        });
    };
    useEffect(() => {
        const newTotalQuantity = selectedProducts.reduce((total, product) => Number(total) + Number(product.quantity), 0);
        const newTotalPrice = selectedProducts.reduce((total, product) => Number(total) + Number(product.price) * Number(product.quantity), 0);

        setTotalQuantity(newTotalQuantity);
        setTotalPrice(newTotalPrice);
    }, [selectedProducts])
    const handleSubmit = async (values) => {
        const modelImport = {
            ...values,
            InventoryDetail: selectedProducts
        }
        await inventoryApi.create(modelImport).then(() => {
            setSelectedProducts([]);
            setDiscount(0);
            resetData();
        })
    }
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            Description: '',
            Partner: 1,
            Quantity: totalQuantity,
            Discount: discount,
            Price: totalPrice,
            Total: totalPrice - discount,
        },
        onSubmit: values => {
            handleSubmit(values).then(formik.resetForm)
        },
    });


    return (
        <CContainer className='max-vh-100 position-relative mb-3 overflow-y-scroll'>
            <CFormLabel className='w-100 text-center fs-4 fw-semibold'>Nhập kho</CFormLabel>
            <CRow md={12} className='h-100 w-100'>
                <CCol md={7} className='border-end border-end-secondary border-3 '>
                    <CRow md={12} className='w-100 h-50 border-bottom border-bottom-secondary border-3 overflow-auto'>
                        {/* //title */}
                        <CRow md={12} className='mb-2 ' style="height:50px;">
                            <CCol md={2} className='fs-7 fw-medium text-center h-auto'>ID sản phẩm</CCol>
                            <CCol md={4} className='fs-7 fw-medium text-center h-auto'>Tên sản phẩm</CCol>
                            <CCol md={3} className='fs-7 fw-medium text-center h-auto'>Số lượng</CCol>
                            <CCol md={2} className='fs-7 fw-medium text-center h-auto'>Đơn giá</CCol>
                        </CRow>
                        {selectedProducts && selectedProducts.map(item => (
                            <CRow className='mt-2 h-auto'>
                                <CCol md={2} className='text-center'>{item.productID}</CCol>
                                <CCol md={4} className='text-center'>{item.productName}</CCol>
                                <CCol md={3} className='text-center'>
                                    <CFormInput type='number' className='w-50 mx-auto' min="1" value={item.quantity} onChange={(e) => handleChangeQuantity(item.productID, e.target.value)}></CFormInput>
                                </CCol>
                                <CCol md={2} className='text-center'>{VND.format(item.price)}</CCol>
                                <CCol md={1} className='text-center'><CIcon icon={cilDelete} role='button' onClick={() => handleDeleteProduct(item.productID)} /></CCol>
                            </CRow>
                        ))}

                    </CRow>
                    <CRow md={12} className='w-100 '>
                        <CRow md={12} className='mt-2' >
                            <CCol md={2} className='mt-2 fw-semibold'>Filter:</CCol>
                            <CCol md={5}><CFormInput type='text' placeholder='ID sản phẩm' name='productID' onChange={(e) => handleFilter(e)}></CFormInput> </CCol>
                            <CCol md={5}> <CFormInput type='text' placeholder='Tên sản phẩm' name='productName' onChange={(e) => handleFilter(e)}></CFormInput></CCol>
                        </CRow>
                        <CFormLabel className='mt-2 text-center'>Danh sách sản phẩm</CFormLabel>
                        <CRow md={12} className='mt-2 p-1 w-100 '>
                            {productFilter && productFilter.map(item => (
                                <CCol md={3} className='border border-white mx-3 my-2 ' role='button' style={{ height: 150, padding: '5px' }} onClick={() => handleProductClick(item)} >
                                    <CRow className='h-75 w-100 m-auto'>
                                        <img src={item.images ? item.images : noImage} alt='Not found image' className='img-thumbnail h-100' />
                                    </CRow>
                                    <CRow className='h-25'>
                                        <CFormLabel className='mt-1 h-100 text-truncate fw-medium' style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px' }}>{item.productName}</CFormLabel>
                                    </CRow>
                                </CCol>
                            ))}


                        </CRow>
                    </CRow>
                </CCol>
                <CCol md={5}>
                    <CForm onSubmit={formik.handleSubmit} >
                        <CRow md={12}>
                            <CCol md={5}>
                                <CFormLabel className='mt-1'>Ngày nhập kho</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <Space direction="vertical" size={17} className='w-100' >
                                    <DatePicker size='large' className='w-100 input-readonly' value={moment(new Date().toLocaleDateString('en-GB'), "dd/MM/yyyy")} />
                                </Space>
                            </CCol>
                        </CRow>

                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1'>Đối tác</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormSelect name='Partner' onChange={formik.handleChange} value={formik.values.Partner}>
                                    {
                                        allPartner && allPartner.map(item => (
                                            <option value={item.partnerID}>{item.displayName}</option>
                                        ))
                                    }
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1'>Tổng số lượng</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormInput className='input-readonly' value={formik.values.Quantity} />
                            </CCol>
                        </CRow>
                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1'>Thành tiền</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormInput className='input-readonly' value={VND.format(formik.values.Price)} />
                            </CCol>
                        </CRow>
                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1' >Chiết khấu</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormInput defaultValue={0} name='Discount' type='number' min="0" max={ formik.values.Price} onChange={(e) => setDiscount(e.target.value)} value={formik.values.Discount} />
                            </CCol>
                        </CRow>
                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1' >Mô tả</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormInput name='Description' value={formik.values.Description} onChange={formik.handleChange} />
                            </CCol>
                        </CRow>
                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1'>Thanh toán</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormInput className='input-readonly' value={VND.format(formik.values.Total)} />
                            </CCol>
                        </CRow>
                        <CRow md={12} className='mt-3'>
                            <CCol md={5}>
                                <CFormLabel className='mt-1'>Người tạo</CFormLabel>
                            </CCol>
                            <CCol md={7}>
                                <CFormInput className='input-readonly' value={JSON.parse(localStorage.getItem("userinfo")).displayname || ''}/>
                            </CCol>
                        </CRow>
                        <CRow className='mt-5 w-75 m-auto'> <CButton color="primary" className='w-100' type='submit'>Nhập hàng</CButton></CRow>
                    </CForm>
                </CCol>
            </CRow>
        </CContainer>
    )
}

export default ImportProduct
