import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Image, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb';
import AuctionService from '../../services/AuctionService';
import { formatCurrency, openNotify } from '../../commons/MethodsCommons';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SellProduct = () => {
  const [fileList, setFileList] = useState([]);

  const validationSchema = Yup.object().shape({
    sellerName: Yup.string().required('Tên người dùng là bắt buộc'),
    productName: Yup.string().required('Tên sản phẩm là bắt buộc'),
    address: Yup.string().required('Tên sản phẩm là bắt buộc'),
    category: Yup.string().required('Danh mục là bắt buộc'),
    startingPrice: Yup.number().positive('Giá khởi điểm phải là số dương').required('Giá khởi điểm là bắt buộc'),
    bidIncrement: Yup.number().positive('Bước giá phải là số dương').required('Bước giá là bắt buộc'),
  });

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
        title="Gửi tài sản đấu giá"
      />
      <section className='container max-w-[1320px] mx-auto px-4 py-8'>
        <h2 className='text-center text-3xl font-bold mb-8'>Đăng ký tài sản đấu giá</h2>
        <div className='space-y-8'>
          {/* Upload images */}
          <div>
            <h3 className='text-xl font-semibold mb-4'>Hình ảnh sản phẩm</h3>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </div>

          {/* Product info */}
          <Formik
            initialValues={{
              sellerName: localStorage.getItem('usernameInfo') || '',
              contactEmail: '',
              productName: '',
              address: '',
              category: '',
              startingPrice: '',
              bidIncrement: '',
              description: '',
              auctionType: '',
              deposit: '',
            }}
            validationSchema={validationSchema}
            validateOnChange={false}  // Chỉ validate khi submit
            validateOnBlur={false}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const result = AuctionService.register(values);
                if (!!result) {
                  openNotify('success', 'Register auction successfully.')
                }
                resetForm();
              } catch (error) {
                console.error("Error submitting form:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
            <Form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField name="sellerName" label="Tên người dùng" />
              <FormField name="contactEmail" label="Email liên hệ" />
              <FormField name="productName" label="Tên sản phẩm" />
              <FormField name="address" label="Địa chỉ sản phẩm" />

              <SelectField
                name="category"
                label="Danh mục"
                options={[
                  { value: '', label: 'Chọn danh mục' },
                  { value: 'physical', label: 'Tài sản hiện vật' }
                ]}
              />

              <SelectField
                name="condition"
                label="Tình trạng sản phẩm"
                options={[
                  { value: '', label: 'Chọn tình trạng' },
                  { value: 'new', label: 'Mới' },
                  { value: 'used', label: 'Đã sử dụng' },
                  { value: 'refurbished', label: 'Tân trang' }
                ]}
              />

              <FormField name="startingPrice" label="Giá khởi điểm" type="number" format={formatCurrency} />
              <FormField name="bidIncrement" label="Bước giá" type="number" format={formatCurrency} />

              <SelectField
                name="auctionType"
                label="Hình thức đấu giá"
                options={[
                  { value: 'online', label: 'Đấu giá online' }
                ]}
              />

              <FormField name="deposit" label="Tiền đặt cọc" type="number" format={formatCurrency} />
            </div>

            <FormField name="description" label="Mô tả sản phẩm" as="textarea" rows={4} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi'}
            </button>
          </Form>
            )}
          </Formik>
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
const SelectField = ({ name, label, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      name={name}
      as="select"
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 outline-0 ${
        options.length === 1 ? 'bg-gray-100' : ''
      }`}
      disabled={options.length === 1}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-600" />
  </div>
);

export default SellProduct;
