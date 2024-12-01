import React, { useEffect, useState } from 'react';
import { CButton, CCol, CForm, CFormInput, CFormTextarea, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import auctionAPI from '../../service/AuctionService';
import customerAPI from '../../service/CustomerService';
import moment from 'moment';
import TabPane from 'antd/es/tabs/TabPane';
import { List, Tabs } from 'antd';
import { MODAL_TYPES, AuctionStatus, ProductCategory, ProductCondition, ProductStatus } from '../../commons/Constant'
import noImage from '../../assets/images/no-image.jpg'

// Validation schema
const approvalValidationSchema = Yup.object({
  startTime: Yup.date()
    .required('Vui lòng nhập thời gian bắt đầu')
    .min(new Date(), 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại'),
  endTime: Yup.date()
    .required('Vui lòng nhập thời gian kết thúc')
    .min(Yup.ref('startTime'), 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu'),
  registrationFee: Yup.number().required('Vui lòng nhập phí đăng ký'),
  registrationOpenDate: Yup.date()
    .required('Vui lòng nhập ngày mở đăng ký')
    .max(Yup.ref('registrationCloseDate'), 'Ngày mở đăng ký phải nhỏ hơn ngày đóng đăng ký'),
  registrationCloseDate: Yup.date()
    .required('Vui lòng nhập ngày đóng đăng ký')
    .max(Yup.ref('startTime'), 'Ngày đóng đăng ký phải nhỏ hơn thời gian bắt đầu'),
});

const AuctionModal = ({ type, visible, onClose, data, status, onSuccess }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [dataCustomerDetails, setDataCustomerDetails] = useState(data?.customerDetails || []);

  useEffect(() => {
    setDataCustomerDetails(data?.customerDetails || []);
}, [data?.customerDetails]);
  
  const isEditable = type === MODAL_TYPES.APPROVE || type === MODAL_TYPES.UPDATE || type === MODAL_TYPES.RECOVER;

  const formatDateTime = (value) => {
    if (!value || value === 'Đợi duyệt') return '';
    // return moment(value).format('HH:mm || DD-MM-YYYY ');
    return moment(value).format('YYYY-MM-DD HH:mm');
  };


  //Chỗ này làm thêm dựa vào data._id gọi API getdetail để láy thông tin chi tiết đấu giá chứ không dùng data được truyền từ chỗ khác
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // _id: data?._id || '',
      _id: data?._id?.toString() || '',
      title: data?.title || '',
      description: data?.description || '',
      sellerName: data?.sellerName || '',
      contactEmail: data?.contactEmail || '',
      startTime: formatDateTime(data?.startTime || ''),
      endTime: formatDateTime(data?.endTime || ''),
      startingPrice: data?.startingPrice || '',
      currentPrice: data?.currentPrice || '',
      currentViews: data?.currentViews || '',
      viewCount: data?.viewCount || '',
      bidIncrement: data?.bidIncrement || '',
      registrationOpenDate: formatDateTime(data?.registrationOpenDate || ''),
      registrationCloseDate: formatDateTime(data?.registrationCloseDate || ''),
      status: AuctionStatus[data?.status || ''],
      cancellationReason: data?.cancellationReason || '',
      deposit: data?.deposit || '',
      registrationFee: data?.registrationFee || '',
      winner: data?.winner || '',
      approvalTime: formatDateTime(data?.approvalTime || ''),
      approvalBy: data?.approvalBy || '',
      updatedAt: formatDateTime(data?.updatedAt || ''),
      updatedBy: data?.updatedBy || '', 
      productName: data?.productName || '',
      productImages: data?.productImages || '',
      productDescription: data?.productDescription || '',
      productAddress: data?.productAddress || '',
      productCategory: ProductCategory[data?.productCategory || ''],
      productCondition: ProductCondition[data?.productCondition || ''],
      productStatus: ProductStatus[data?.productStatus || ''],
      productCreate: formatDateTime(data?.productCreate || ''),
      registeredUsers: data?.registeredUsers || '',
      username: data?.username || '',
      userCode: data?.userCode || '',
      email: data?.email || '',
      fullName: data?.fullName || '',
      phoneNumber: data?.phoneNumber || '',
      avatar: data?.avatar || '',
      IndentifyCode: data?.IndentifyCode || '',
      createdCustomerAt: formatDateTime(data?.createdCustomerAt || ''),

    },
    validationSchema: (type === MODAL_TYPES.APPROVE || type === MODAL_TYPES.UPDATE || type === MODAL_TYPES.RECOVER) ? approvalValidationSchema : null,
    onSubmit: values => {
      handleSubmit(values)
      console.log("Auction detail:", values.status);

    },
    // onSubmit: handleSubmit,
  });

  async function handleSubmit(values) {
    try {
      // Format datetime fields before submitting
      const formattedValues = {
        ...values,
        startTime: values.startTime && moment(values.startTime, moment.ISO_8601, true).isValid()
          ? moment(values.startTime).toISOString()
          : null,
        endTime: values.endTime && moment(values.endTime, moment.ISO_8601, true).isValid()
          ? moment(values.endTime).toISOString()
          : null,
        registrationOpenDate: values.registrationOpenDate && moment(values.registrationOpenDate, moment.ISO_8601, true).isValid()
          ? moment(values.registrationOpenDate).toISOString()
          : null,
        registrationCloseDate: values.registrationCloseDate && moment(values.registrationCloseDate, moment.ISO_8601, true).isValid()
          ? moment(values.registrationCloseDate).toISOString()
          : null,
        startingPrice: values.startingPrice ? parseFloat(values.startingPrice) : null,
        bidIncrement: values.bidIncrement ? parseFloat(values.bidIncrement) : null,
        deposit: values.deposit ? parseFloat(values.deposit) : null,
        registrationFee: values.registrationFee ? parseFloat(values.registrationFee) : null,
        contactEmail: values.contactEmail?.trim() || '',
        productImages: Array.isArray(values.productImages) ? values.productImages : [],
      };
      
      // Đảm bảo _id là chuỗi (string)
      const id = values._id?.toString();
      if (!id) {
          return toast.error("Auction ID is invalid or missing.");
      }

      console.log("Auction ID:", values._id);
      let response;
      
      switch (type) {
        case MODAL_TYPES.APPROVE:
          console.log("Auction ID:", values._id);
          response = await auctionAPI.approve(id, formattedValues);
          break;
        case MODAL_TYPES.REJECT:
          if (!rejectReason) {
            toast.error('Vui lòng nhập lý do từ chối');
            return;
          }
          response = await auctionAPI.reject(values._id, rejectReason);
          break;
        case MODAL_TYPES.UPDATE:
          response = await auctionAPI.updateAuction(values._id, formattedValues);
          break;
        case MODAL_TYPES.CANCEL:
          if (!rejectReason) {
            toast.error('Vui lòng nhập lý do hủy phiên đấu giá');
            return;
          }
          response = await auctionAPI.reject(values._id, rejectReason);
          break;
        case MODAL_TYPES.RECOVER:
          response = await auctionAPI.approve(values._id, formattedValues);
          break;
        case MODAL_TYPES.END:
          if (!rejectReason) {
            toast.error('Vui lòng nhập lý do đóng phiên đấu giá');
            return;
          }
          response = await auctionAPI.endAuction(values._id, rejectReason);
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
      console.log("Auction ID:", values._id);

      console.error("Lỗii:", error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy raa!');
    }
  }

  const handleKickCustomer = async (auctionId, customerId) => {
    const kickCustomer = await auctionAPI.kickCustomerOutOfAuction(auctionId, customerId);
    if(kickCustomer.success){
      setDataCustomerDetails(kickCustomer.data.listCustomers)
      toast.success("Xóa khách hàng khỏi phiên đấu giá thành công");
    }else{
      toast.error(kickCustomer.data.message || 'Xóa khách hàng khỏi phiên đấu giá thất bại!');
    } 
  }

  const renderFormField = (label, name, inputType = 'text') => (
    <CCol md="6" className="mb-3">
      <CRow>
        <CCol md="4">
          <CFormLabel className="mt-1">{label}</CFormLabel>
        </CCol>
        <CCol md="7">
          {name === 'productDescription' || name === 'description' ? (
            <CFormTextarea
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditable}
              rows={4} 
              style={{
                resize: 'none', // Vô hiệu hóa khả năng thay đổi kích thước thủ công
              }}
              className={!isEditable ? 'textarea-readonly' : ''}
            />
          ) : (
            <CFormInput
              type={inputType}
              name={name}
              value={formik.values[name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditable}
              className={!isEditable ? 'input-readonly' : ''}
            />
          )}
          {formik.touched[name] && formik.errors[name] && (
            <div className="text-danger">{formik.errors[name]}</div>
          )}
        </CCol>
      </CRow>
    </CCol>
  );
  
  const renderActionButtons = (auctionId, customerId) => {
    const buttons = [];
    buttons.push(
      <CButton key="delete" onClick={() => handleKickCustomer(auctionId, customerId)}>
        Xóa khỏi phiên
      </CButton>
    );
    return buttons;
  };

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
        {type === MODAL_TYPES.UPDATE && 'Điều chỉnh phiên đấu giá'}
        {type === MODAL_TYPES.CANCEL && 'Hủy phiên đấu giá'}
        {type === MODAL_TYPES.RECOVER && 'Khôi phục phiên đấu giá'}
        {type === MODAL_TYPES.END && 'Đóng phiên đấu giá'}
      </CModalHeader>

      <CModalBody className="p-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin chung" key="1">
            <CForm onSubmit={formik.handleSubmit}>
              <CRow>
                {renderFormField('Title', 'title')}
                {renderFormField('Mô tả', 'description')}
                {renderFormField('Người đăng ký', 'sellerName')}
                {renderFormField('Tên đấu phẩm', 'productName')}
                {renderFormField('Email', 'contactEmail', 'email')}
                {renderFormField('Giá khởi điểm', 'startingPrice', 'number')}
                {status === 'active' && (renderFormField('Giá hiện tại', 'currentPrice'))}

                {renderFormField('Bước giá tối thiểu', 'bidIncrement', 'number')}
                {renderFormField('Thời gian mở đăng ký', 'registrationOpenDate', 'datetime-local')}
                {renderFormField('Thời gian đóng đăng ký', 'registrationCloseDate', 'datetime-local')}
                {renderFormField('Thời gian bắt đầu', 'startTime', 'datetime-local')}
                {renderFormField('Thời gian kết thúc', 'endTime', 'datetime-local')}
                {renderFormField('Phí đặt cọc', 'deposit', 'number')}
                {renderFormField('Phí đăng ký phiên đấu giá', 'registrationFee', 'number')}
                {renderFormField('Trạng thái phiên đấu giá', 'status')}

                {status === 'active' && (renderFormField('Số lượng người xem', 'viewCount'))}

                {(status === 'pending' || status === 'active' || status === 'ended') && (renderFormField('Người duyệt', 'approvalBy'))}
                {(status === 'pending' || status === 'active' || status === 'ended') && (renderFormField('Thời điểm duyệt', 'approvalTime', 'datetime-local'))}
                {/* {(status === 'pending' || status === 'active' || status === 'ended') && (renderFormField('Người điều chỉnh', 'updatedBy'))}
                {(status === 'pending' || status === 'active' || status === 'ended') && (renderFormField('Thời điểm điều chỉnh', 'updatedAt', 'datetime-local'))} */}

                {status === 'ended' && (renderFormField('Người mua', 'winner'))}
                {status === 'ended' && (renderFormField('Giá mua', 'currentPrice'))}

                {status === 'cancelled' && (renderFormField('Lí do phiên đấu giá bị hủy', 'cancellationReason'))}

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
                {type === MODAL_TYPES.CANCEL && (
                  <CCol md="12" className="mb-3">
                    <CFormLabel>Lý do hủy phiên đấu giá</CFormLabel>
                    <CFormInput
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do hủy phiên đấu giá"
                    />
                  </CCol>
                )}
                {type === MODAL_TYPES.END && (
                  <CCol md="12" className="mb-3">
                    <CFormLabel>Lý do đóng phiên đấu giá</CFormLabel>
                    <CFormInput
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Nhập lý do đóng phiên đấu giá"
                    />
                  </CCol>
                )}
              </CRow>
            </CForm>
          </TabPane>

          <TabPane tab="Thông tin sản phẩm"  key="2">
          <CForm onSubmit={formik.handleSubmit}>
              <CRow>
                {renderFormField('Tên sản phẩm', 'productName')}
                {renderFormField('Mô tả', 'productDescription')}
                {renderFormField('Giá khởi điểm', 'startingPrice')}

                {renderFormField('Địa chỉ sản phẩm', 'productAddress')}
                {renderFormField('Danh mục sản phẩm', 'productCategory')}
                {renderFormField('Tình trạng sản phẩm', 'productCondition')}
                {renderFormField('Trạng thái đấu giá', 'productStatus')}
                {renderFormField('Thời gian xuất hiện', 'productCreate', 'datetime-local')}

                {renderFormField('Người bán', 'sellerName')}
                {renderFormField('Email', 'contactEmail', 'email')}

                {status === 'ended' && (renderFormField('Người mua', 'winner'))}
                {status === 'ended' && (renderFormField('Giá mua', 'currentPrice'))}
              </CRow>
              
            </CForm>
          </TabPane>

          <TabPane tab="Danh sách đăng ký" key="3">
            {dataCustomerDetails?.length ? (
              <>
                {/* <div className="d-flex w-100 header-row">
                  <div className="flex-grow-1 text-center column">Mã khách hàng</div>
                  <div className="flex-grow-2 text-center column">Họ tên</div>
                  <div className="flex-grow-3 text-center column">Thông tin cá nhân</div>
                  <div className="flex-grow-1 text-center column">Thời gian đăng kí</div>
                </div> */}

                {/* Danh sách khách hàng */}
                <List
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                  dataSource={dataCustomerDetails}
                  renderItem={(customer) => (
                    <List.Item
                      className="d-flex justify-content-start data-row"
                      actions={[
                        <div className="d-flex gap-2">
                          <CButton key="delete" onClick={() => handleKickCustomer(data._id, customer._id)}>Xóa khỏi phiên</CButton>
                          {/* {renderActionButtons(data._id, customer._id)} */}
                        </div>,
                      ]}
                    >
                      <div className="d-flex w-100 align-items-start">

                        <div style={{ width: '60%' }}>
                          <div className="flex-grow-1 text-center column-vertical fw-semibold">Mã khách hàng</div>
                          <div className="flex-grow-1 text-center column-vertical">
                            <CFormLabel className="mb-0">{customer.userCode}</CFormLabel>
                          </div>
                        </div>
                        
                        <div style={{ width: '60%' }}>
                          <div className="flex-grow-2 column-vertical fw-semibold">Họ tên khách hàng</div>
                          <div className="flex-grow-2 d-flex align-items-center column-vertical">
                            <div>
                              <div className="mb-0">{customer.fullName}</div>
                              <div className="text-muted">{customer.username}</div>
                            </div>
                            <div className="me-2">
                              <img
                                src={customer?.avatar?.[0] ?? noImage}
                                className="rounded"
                                height={50}
                                width={50}
                                alt="Avatar"
                              />
                            </div>
                          </div>
                        </div>

                        <div style={{ width: '60%' }}>
                          <div className="flex-grow-3 column-vertical fw-semibold">Thông tin liên hệ</div>
                          <div className="flex-grow-3 text-start column-vertical">
                            <div>Email: {customer.email}</div>
                            <div>SĐT: {customer.phoneNumber || 'Bổ sung sau'}</div>
                            <div>CCCD: {customer.IndentifyCode || 'Bổ sung sau'}</div>
                            <div>Địa chỉ: {customer.address || 'Bổ sung sau'}</div>
                          </div>
                        </div>

                        <div style={{ width: '60%' }}>
                          <div className="flex-grow-1 text-center column-vertical fw-semibold">Thời gian đăng kí</div>
                          <div className="flex-grow-1 text-center column-vertical">
                            <CFormLabel className="mb-0">{formatDateTime(customer.createdAt)}</CFormLabel>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            ) : (
              <div>Không có khách hàng đăng ký</div>
            )}
          </TabPane>




        </Tabs>

      </CModalBody>

      <CModalFooter> 
        {type !== MODAL_TYPES.VIEW && (
          <CButton
            color={(type === MODAL_TYPES.APPROVE || type === MODAL_TYPES.UPDATE || type ===MODAL_TYPES.RECOVER) ? 'success' : 'danger'}
            onClick={formik.handleSubmit}
          >
            {type === MODAL_TYPES.APPROVE && 'Duyệt'}
            {type === MODAL_TYPES.REJECT && 'Từ chối'}
            {type === MODAL_TYPES.UPDATE && 'Điều chỉnh'}
            {type === MODAL_TYPES.CANCEL && 'Hủy'}
            {type === MODAL_TYPES.RECOVER && 'Khôi phục'}
            {type === MODAL_TYPES.END && 'Đóng phiên'}
          </CButton>
        )}
        <CButton color="secondary" onClick={onClose}>
          Đóng
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default AuctionModal;