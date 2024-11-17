import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import auctionAPI from '../../service/AuctionService';

const MODAL_TYPES = {
  VIEW: 'VIEW',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  END: 'END'
};

// Validation schema
const approvalValidationSchema = Yup.object({
  startTime: Yup.string().notOneOf(['Đợi duyệt'], 'Vui lòng nhập thời gian bắt đầu'),
  endTime: Yup.string().notOneOf(['Đợi duyệt'], 'Vui lòng nhập thời gian kết thúc'),
  registrationFee: Yup.string().notOneOf(['Đợi duyệt'], 'Vui lòng nhập phí đăng ký'),
  reservePrice: Yup.string().notOneOf(['Đợi duyệt'], 'Vui lòng nhập giá tối thiểu'),
  registrationOpenDate: Yup.string().notOneOf(['Đợi duyệt'], 'Vui lòng nhập ngày mở đăng ký'),
  registrationCloseDate: Yup.string().notOneOf(['Đợi duyệt'], 'Vui lòng nhập ngày đóng đăng ký'),
});

const AuctionModal = ({ type, visible, onClose, data, onSuccess }) => {
  const [rejectReason, setRejectReason] = useState('');
  
  // Determine if fields should be editable based on modal type
  const isEditable = type === MODAL_TYPES.APPROVE;
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: data?._id || '',
      title: data?.title || '',
      description: data?.description || '',
      sellerName: data?.sellerName || '',
      contactEmail: data?.contactEmail || '',
      startTime: data?.startTime || 'Đợi duyệt',
      endTime: data?.endTime || 'Đợi duyệt',
      startingPrice: data?.startingPrice || '',
      reservePrice: data?.reservePrice || 'Đợi duyệt',
      bidIncrement: data?.bidIncrement || '',
      registrationOpenDate: data?.registrationOpenDate || 'Đợi duyệt',
      registrationCloseDate: data?.registrationCloseDate || 'Đợi duyệt',
      deposit: data?.deposit || '',
      registrationFee: data?.registrationFee || 'Đợi duyệt',
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
      let response;
      
      switch (type) {
        case MODAL_TYPES.APPROVE:
          response = await auctionAPI.approve(values);
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

  const renderFormField = (label, name, type = 'text') => (
    <CCol md="6" className="mb-3">
      <CRow>
        <CCol md="4">
          <CFormLabel className="mt-1">{label}</CFormLabel>
        </CCol>
        <CCol md="7">
          <CFormInput
            type={type}
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
        <CForm onSubmit={formik.handleSubmit}>
          <CRow>
            {renderFormField('Title', 'title')}
            {renderFormField('Người đăng ký', 'sellerName')}
            {renderFormField('Email', 'contactEmail', 'email')}
            {renderFormField('Tên đấu phẩm', 'productName')}
            {renderFormField('Giá khởi điểm', 'startingPrice')}
            {renderFormField('Giá tối thiểu', 'reservePrice')}
            {renderFormField('Bước giá tối thiểu', 'bidIncrement')}
            {renderFormField('Thời gian mở đăng ký', 'registrationOpenDate')}
            {renderFormField('Thời gian đóng đăng ký', 'registrationCloseDate')}
            {renderFormField('Phí đặt cọc', 'deposit')}
            {renderFormField('Phí đăng ký phiên đấu giá', 'registrationFee')}
            
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