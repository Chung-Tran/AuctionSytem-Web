import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Image, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SellProduct = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Tên người dùng là bắt buộc'),
    productName: Yup.string().required('Tên sản phẩm là bắt buộc'),
    category: Yup.string().required('Danh mục là bắt buộc'),
    startingPrice: Yup.number().positive('Giá khởi điểm phải là số dương').required('Giá khởi điểm là bắt buộc'),
    stepPrice: Yup.number().positive('Bước giá phải là số dương').required('Bước giá là bắt buộc'),
    description: Yup.string().required('Mô tả sản phẩm là bắt buộc'),
  });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className='w-full h-auto'>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Upcoming Auctions", href: "/auctions/upcoming" },
          { label: "Đăng ký đấu giá", href: null },
        ]}
      />
      <section className='container mx-auto px-4 py-8'>
        <h2 className='text-center text-3xl font-bold mb-8'>Đăng ký tài sản đấu giá</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Upload images */}
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Hình ảnh sản phẩm</h3>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            {previewOpen && (
              <Image
                src={previewImage}
                alt="Preview"
                style={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
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
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  // Xử lý logic khi submit form
                  console.log("Form values:", values);
                  resetForm();
                } catch (error) {
                  console.error("Error submitting form:", error);
                  alert("Không thể gửi biểu mẫu. Vui lòng thử lại.");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className='space-y-4'>
                  <div className='grid gap-4'>
                    <FormField name="fullName" label="Tên người dùng" type="text" />
                    <FormField name="productName" label="Tên sản phẩm" type="text" />
                    <FormField name="category" label="Danh mục" type="text" />
                    <FormField name="startingPrice" label="Giá khởi điểm" type="number" />
                    <FormField name="stepPrice" label="Bước giá" type="number" />
                    <FormField name="description" label="Mô tả sản phẩm" as="textarea" rows={4} />
                  </div>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300'
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </div>
  );
};

const FormField = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
    <Field
      name={name}
      id={name}
      className='w-full p-2 border border-gray-300 rounded-md outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500'
      {...props}
    />
    <ErrorMessage name={name} component='div' className='text-red-500 text-sm mt-1' />
  </div>
);

export default SellProduct;