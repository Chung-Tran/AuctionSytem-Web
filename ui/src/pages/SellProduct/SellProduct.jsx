import React, { useState } from 'react'
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb'
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Image, Upload } from 'antd';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const SellProduct = () => {
    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .required(''),
        content: Yup.string()
            .required(''),
        rememberInfo: Yup.boolean(),
    });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-2',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-3',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
            uid: '-4',
            name: 'image.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
    ]);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {/* <PlusOutlined /> */}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );
    return (
        <div className='w-full h-auto'>
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Upcoming Auctions", href: null },
                ]}
                title="Đăng kí đấu giá"
            />
            <section className='container '>
                <h2 className='text-center text-2xl my-4'>Đăng kí tài sản đấu giá</h2>
                <div className='grid grid-cols-2 px-6'>
                    {/* Upload images */}
                    <div>
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                        {previewImage && (
                            <Image
                                wrapperStyle={{
                                    display: 'none',
                                }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </div>
                    {/* Product info */}
                    <div>
                        <Formik
                            initialValues={{
                                fullName: localStorage.getItem('usernameInfo') || '',
                                productName: '',
                                description: '',
                                category: '',
                                startingPrice: '',
                                stepPrice: '',
                                rememberInfo: !!localStorage.getItem('usernameInfo'),
                            }}
                            validationSchema={validationSchema} // Bạn cần định nghĩa validationSchema để validate form
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                try {
                                    // Xử lý logic khi submit form
                                    console.log("Form values:", values);
                                    resetForm();
                                } catch (error) {
                                    console.error("Error submitting form:", error);
                                    alert("Failed to submit form.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className='space-y-3'>
                                    <div className='grid grid-cols-2 lg:grid-cols-1 gap-4'>
                                        {/* Tên người dùng */}
                                        <div className='relative col-span-2 md:col-span-2'>
                                            <p className='mb-1 text-base text-[#1A1A1A] font-medium'>Tên người dùng</p>
                                            <Field
                                                type='text'
                                                name='fullName'
                                                placeholder="Tên người dùng"
                                                className='w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#10743B]'
                                            />
                                            <ErrorMessage
                                                name='fullName'
                                                component='div'
                                                className='text-red-500 text-sm mt-1'
                                            />
                                        </div>

                                        {/* Tên sản phẩm */}
                                        <div className='relative col-span-2 md:col-span-2'>
                                            <p className='mb-1 text-base text-[#1A1A1A] font-medium'>Tên sản phẩm</p>
                                            <Field
                                                type='text'
                                                name='productName'
                                                placeholder="Tên sản phẩm"
                                                className='w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#10743B]'
                                            />
                                            <ErrorMessage
                                                name='productName'
                                                component='div'
                                                className='text-red-500 text-sm mt-1'
                                            />
                                        </div>

                                        {/* Danh mục */}
                                        <div className='relative col-span-2'>
                                            <p className='mb-0.5 text-base text-[#1A1A1A] font-medium'>Danh mục</p>
                                            <Field
                                                type='text'
                                                name='category'
                                                placeholder="Danh mục"
                                                className='w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#10743B]'
                                            />
                                            <ErrorMessage
                                                name='category'
                                                component='div'
                                                className='text-red-500 text-sm mt-1'
                                            />
                                        </div>

                                        {/* Giá khởi điểm */}
                                        <div className='relative col-span-2'>
                                            <p className='mb-1 text-base text-[#1A1A1A] font-medium'>Giá khởi điểm</p>
                                            <Field
                                                type='number'
                                                name='startingPrice'
                                                placeholder="Giá khởi điểm"
                                                className='w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#10743B]'
                                            />
                                            <ErrorMessage
                                                name='startingPrice'
                                                component='div'
                                                className='text-red-500 text-sm mt-1'
                                            />
                                        </div>

                                        {/* Bước giá */}
                                        <div className='relative col-span-2 '>
                                            <p className='mb-1 text-base text-[#1A1A1A] font-medium'>Bước giá</p>
                                            <Field
                                                type='number'
                                                name='stepPrice'
                                                placeholder="Bước giá"
                                                className='w-full p-2 border border-gray-300 rounded-md outline-none focus:border-[#10743B]'
                                            />
                                            <ErrorMessage
                                                name='stepPrice'
                                                component='div'
                                                className='text-red-500 text-sm mt-1'
                                            />
                                        </div>

                                        {/* Mô tả sản phẩm */}
                                        <div className='relative col-span-2'>
                                            <p className='mb-0.5 text-base text-[#1A1A1A] font-medium'>Mô tả sản phẩm</p>
                                            <Field
                                                as='textarea'
                                                name='description'
                                                placeholder="Mô tả sản phẩm"
                                                className='w-full p-2 border border-gray-300 rounded-md h-32 outline-none focus:border-[#10743B]'
                                            />
                                            <ErrorMessage
                                                name='description'
                                                component='div'
                                                className='text-red-500 text-sm mt-1'
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type='submit'
                                        disabled={isSubmitting}
                                        className='w-full md:w-auto px-4 py-2 bg-[#10743B] text-white rounded-md hover:bg-[#0b572d]'
                                    >
                                        Gửi
                                    </button>
                                </Form>
                            )}
                        </Formik>

                    </div>
                </div>
            </section>
        </div>
    )
}

export default SellProduct
