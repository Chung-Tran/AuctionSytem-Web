import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import auctionAPI from '../../service/AuctionService';
import moment from 'moment';
import TabPane from 'antd/es/tabs/TabPane';
import { Tabs } from 'antd';

const MODAL_TYPES = {
  VIEW: 'VIEW',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  END: 'END'
};

// Validation schema
const approvalValidationSchema = Yup.object({
  startTime: Yup.date()
    .required('Vui lòng nhập thời gian bắt đầu')
    .min(new Date(), 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại'),
  endTime: Yup.date()
    .required('Vui lòng nhập thời gian kết thúc')
    .min(Yup.ref('startTime'), 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'),
  registrationFee: Yup.number().required('Vui lòng nhập phí đăng ký'),
  reservePrice: Yup.number().required('Vui lòng nhập giá tối thiểu'),
  registrationOpenDate: Yup.date()
    .required('Vui lòng nhập ngày mở đăng ký')
    .max(Yup.ref('registrationCloseDate'), 'Ngày mở đăng ký phải nhỏ hơn ngày đóng đăng ký'),
  registrationCloseDate: Yup.date()
    .required('Vui lòng nhập ngày đóng đăng ký')
    .max(Yup.ref('startTime'), 'Ngày đóng đăng ký phải nhỏ hơn thời gian bắt đầu'),
});

const AuctionModal = ({ type, visible, onClose, data, onSuccess }) => {
  const [rejectReason, setRejectReason] = useState('');
  
  // Determine if fields should be editable based on modal type
  const isEditable = type === MODAL_TYPES.APPROVE;

  // Format datetime for display
  const formatDateTime = (value) => {
    if (!value || value === 'Đợi duyệt') return '';
    return moment(value).format('YYYY-MM-DDTHH:mm');
  };
  //Chỗ này làm thêm dựa vào data._id gọi API getdetail để láy thông tin chi tiết đấu giá chứ không dùng data được truyền từ chỗ khác
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: data?._id || '',
      title: data?.title || '',
      description: data?.description || '',
      sellerName: data?.sellerName || '',
      contactEmail: data?.contactEmail || '',
      startTime: formatDateTime(data?.startTime),
      endTime: formatDateTime(data?.endTime),
      startingPrice: data?.startingPrice || '',
      reservePrice: data?.reservePrice || '',
      bidIncrement: data?.bidIncrement || '',
      registrationOpenDate: formatDateTime(data?.registrationOpenDate),
      registrationCloseDate: formatDateTime(data?.registrationCloseDate),
      deposit: data?.deposit || '',
      registrationFee: data?.registrationFee || '',
      productName: data?.productName || '',
      productImages: data?.productImages || '',
      productDescription: data?.productDescription || '',
      productAddress: data?.productAddress || '',
    },
    validationSchema: type === MODAL_TYPES.APPROVE ? approvalValidationSchema : null,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    try {
      // Format datetime fields before submitting
      const formattedValues = {
        ...values,
        startTime: values.startTime ? moment(values.startTime).toISOString() : null,
        endTime: values.endTime ? moment(values.endTime).toISOString() : null,
        registrationOpenDate: values.registrationOpenDate ? moment(values.registrationOpenDate).toISOString() : null,
        registrationCloseDate: values.registrationCloseDate ? moment(values.registrationCloseDate).toISOString() : null,
      };

      let response;
      
      switch (type) {
        case MODAL_TYPES.APPROVE:
          response = await auctionAPI.approve(formattedValues);
          break;
        case MODAL_TYPES.REJECT:
          if (!rejectReason) {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
          }
          response = await auctionAPI.reject(values._id, rejectReason);
          break;
        case MODAL_TYPES.CANCEL:
          response = await auctionAPI.cancel(values._id);
          break;
        case MODAL_TYPES.END:
          response = await auctionAPI.end(values._id);
          break;
        default:
          return;
      }

      if (response.success) {
        toast.success('Thao tác thành công!');
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  }

  const renderFormField = (label, name, inputType = 'text') => (
    <CCol md="6" className="mb-3">
      <CRow>
        <CCol md="4">
          <CFormLabel className="mt-1">{label}</CFormLabel>
        </CCol>
        <CCol md="7">
          <CFormInput
            type={inputType}
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!isEditable}
            className={!isEditable ? 'input-readonly' : ''}
          />
          {formik.touched[name] && formik.errors[name] && (
            <div className="text-danger">{formik.errors[name]}</div>
          )}
        </CCol>
      </CRow>
    </CCol>
  );

  return (
    <CModal
      visible={visible}
      onClose={onClose}
      className="modal-xl"
    >
      <CModalHeader closeButton>
        {type === MODAL_TYPES.VIEW && 'Xem chi tiết phiên đấu giá'}
        {type === MODAL_TYPES.APPROVE && 'Duyệt phiên đấu giá'}
        {type === MODAL_TYPES.REJECT && 'Từ chối phiên đấu giá'}
        {type === MODAL_TYPES.CANCEL && 'Hủy phiên đấu giá'}
        {type === MODAL_TYPES.END && 'Kết thúc phiên đấu giá'}
      </CModalHeader>

      <CModalBody className="p-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin chung" key="1">
            <CForm onSubmit={formik.handleSubmit}>
              <CRow>
                {renderFormField('Title', 'title')}
                {renderFormField('Người đăng ký', 'sellerName')}
                {renderFormField('Email', 'contactEmail', 'email')}
                {renderFormField('Tên đấu phẩm', 'productName')}
                {renderFormField('Giá khởi điểm', 'startingPrice', 'number')}
                {renderFormField('Giá tối thiểu', 'reservePrice', 'number')}
                {renderFormField('Bước giá tối thiểu', 'bidIncrement', 'number')}
                {renderFormField('Thời gian mở đăng ký', 'registrationOpenDate', 'datetime-local')}
                {renderFormField('Thời gian đóng đăng ký', 'registrationCloseDate', 'datetime-local')}
                {renderFormField('Thời gian bắt đầu', 'startTime', 'datetime-local')}
                {renderFormField('Thời gian kết thúc', 'endTime', 'datetime-local')}
                {renderFormField('Phí đặt cọc', 'deposit', 'number')}
                {renderFormField('Phí đăng ký phiên đấu giá', 'registrationFee', 'number')}

                {type === MODAL_TYPES.REJECT && (
                  <CCol md="12" className="mb-3">
                    <CFormLabel>Lý do từ chối</CFormLabel>
                    <CFormInput
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do từ chối"
                    />
                  </CCol>
                )}
              </CRow>
            </CForm>
          </TabPane>
          <TabPane tab="Thông tin sản phẩm"  key="2">

          </TabPane>
          <TabPane tab="Danh sách đăng ký" key="3">

          </TabPane>
        </Tabs>

      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
        {type !== MODAL_TYPES.VIEW && (
          <CButton
            color={type === MODAL_TYPES.APPROVE ? 'success' : 'danger'}
            onClick={formik.handleSubmit}
          >
            {type === MODAL_TYPES.APPROVE && 'Duyệt'}
            {type === MODAL_TYPES.REJECT && 'Từ chối'}
            {type === MODAL_TYPES.CANCEL && 'Hủy'}
            {type === MODAL_TYPES.END && 'Kết thúc'}
          </CButton>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default AuctionModal;