import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Image, Upload, Modal, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/BreadCrumb/BreadCrumb';
import AuctionService from '../../services/AuctionService';
import { formatCurrency, openNotify } from '../../commons/MethodsCommons';
import { AppContext } from '../../AppContext';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const SellProduct = () => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const { user, toggleLoginModal } = useContext(AppContext);
  const validationSchema = Yup.object().shape({
    sellerName: Yup.string().required('Tên người dùng là bắt buộc'),
    productName: Yup.string().required('Tên sản phẩm là bắt buộc'),
    address: Yup.string().required('Địa chỉ là bắt buộc'),
    category: Yup.string().required('Danh mục là bắt buộc'),
    startingPrice: Yup.number().positive('Giá khởi điểm phải là số dương').required('Giá khởi điểm là bắt buộc'),
    bidIncrement: Yup.number().positive('Bước giá phải là số dương').required('Bước giá là bắt buộc'),
    images: Yup.array().min(1, 'Cần ít nhất 1 hình ảnh sản phẩm')
  });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleCancel = () => setPreviewOpen(false);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (fileList.length === 0) {
        openNotify('error', 'Vui lòng tải lên ít nhất 1 hình ảnh');
        return;
      }

      const formData = new FormData();

      fileList.forEach((file) => {
        formData.append('images', file.originFileObj);
      });

      Object.keys(values).forEach(key => {
        if (key !== 'images') {
          formData.append(key, values[key]);
        }
      });
      debugger
      if (!user)
          return toggleLoginModal(true)
      const response = await AuctionService.register(formData);
      if (!!response) {
        openNotify('success', 'Đăng ký sản phẩm đấu giá thành công');
        resetForm();
        // Reset form và fileList
        setFileList([]);
      }
    } catch (error) {
      openNotify('error', 'Đăng ký thất bại: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

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
              auctionType: 'online',
              deposit: '',
              condition: 'new',
              images: []
            }}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-8">
                {/* Upload images */}
                <div>
                  <h3 className='text-xl font-semibold mb-4'>Hình ảnh sản phẩm</h3>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={({ fileList: newFileList }) => {
                      setFileList(newFileList);
                      setFieldValue('images', newFileList.map(file => file.originFileObj));
                    }}
                    beforeUpload={() => false}
                    multiple
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                  <ErrorMessage name="images" component="div" className="text-red-500 text-sm" />
                </div>

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
                      { value: 'new', label: 'Mới' },
                      { value: 'used', label: 'Đã sử dụng' },
                      { value: 'refurbished', label: 'Tân trang' }
                    ]}
                  />

                  <FormInputNumber
                    name="startingPrice"
                    label="Giá khởi điểm"
                    formatter={(value) => `${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                    onChange={(value, form) => {
                      form.setFieldValue('deposit', value ? (Math.floor(value * 0.1)) : '');
                    }}
                  />
                  <FormInputNumber
                    name="bidIncrement"
                    label="Bước giá"
                    formatter={(value) => `${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                    onChange={(value, form) => {
                      form.setFieldValue('deposit', value ? (value * 0.1) : '');
                    }}
                  />

                  {/* <FormField name="bidIncrement" label="Bước giá" type="number" format={formatCurrency} /> */}

                  <SelectField
                    name="auctionType"
                    label="Hình thức đấu giá"
                    options={[
                      { value: 'online', label: 'Đấu giá online' }
                    ]}
                  />
                  <FormInputNumber
                    name="deposit"
                    label="Tiền đặt cọc (10% giá khởi điểm)"
                    formatter={(value) => `${value} ₫`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\₫\s?|(,*)/g, '')}
                    disabled
                  />
                  {/* <FormField name="deposit" label="Tiền đặt cọc" type="number" disabled={true} format={formatCurrency} /> */}
                </div>

                <FormField name="description" label="Mô tả sản phẩm" as="textarea" rows={4} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

const FormField = ({ name, label, format, ...props }) => (
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

const FormInputNumber = ({ name, label, onChange, formatter, parser, ...props }) => {
  const handleKeyPress = (e) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <Field name={name}>
        {({ field, form }) => (
          <InputNumber
            id={name}
            className='w-full p-1.5 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm'
            value={field.value}
            onChange={(value) => {
              const integerValue = Math.floor(value); 
              form.setFieldValue(name, integerValue); 
              if (onChange) {
                onChange(integerValue, form);
              }
            }}
            onBlur={() => form.setFieldTouched(name, true)}
            formatter={formatter || ((value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
            )}
            parser={parser || ((value) => value.replace(/\$\s?|(,*)/g, ''))}
            onKeyPress={handleKeyPress} 
            {...props}
          />
        )}
      </Field>
      <ErrorMessage name={name} component='div' className='text-red-500 text-sm mt-1' />
    </div>
  );
};


const SelectField = ({ name, label, options }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <Field
      name={name}
      as="select"
      className={`mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 outline-0 ${options.length === 1 ? 'bg-gray-100' : ''
        }`}
      disabled={options.length === 1}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value} className='p-2'>
          {label}
        </option>
      ))}
    </Field>
    <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-600" />
  </div>
);

export default SellProduct;