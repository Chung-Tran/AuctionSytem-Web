import React, { useEffect, useState } from 'react';
import { CForm, CRow, CCol, CFormLabel, CFormInput, CButton } from '@coreui/react';
import { List, Tabs } from 'antd';
import auctionAPI from '../../service/AuctionService';
import AuctionModal from './AuctionModal';
import { AUCTION_STATUS, MODAL_TYPES, AuctionStatus} from '../../commons/Constant';
import '../../scss/AuctionApprove.scss';
import noImage from '../../assets/images/no-image.jpg'
import moment from 'moment';

const AuctionManager = () => {
  const [auctions, setAuctions] = useState({
    new: [],
    pending: [],
    active: [],
    ended: [],
    cancelled: [],
  });
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: null,
    data: null,
    status: null
  });
  const [filterParams, setFilterParams] = useState({
    fullName: '',
    email: '',
    rolePermission: '',
    phoneNumber: ''
  });

  const formatDateTime = (value) => {
    if (!value || value === 'Đợi duyệt') return '';
    return moment(value).format('HH:mm || DD-MM-YYYY ');
  };


  const handleAction = (type, auction) => {
    setModalConfig({
      visible: true,
      type: type,
      data: auction,
      status: auction.status,
    });
  };

  const handleCloseModal = () => {
    setModalConfig({
      visible: false,
      type: null,
      data: null,
      status: null
    });
  };

  const fetchAuctions = async () => {
    try {
      const [newAuctions, pendingAuctions, activeAuctions, endedAuctions, cancelledAuctions] = await Promise.all([
        auctionAPI.getNewAuction(),
        auctionAPI.getPendingAuction(),
        auctionAPI.getActiveAuction(),
        auctionAPI.getEndedAuction(),
        auctionAPI.getCancelledAuction(),
      ]);

      setAuctions({
        new: newAuctions.data.docs,
        pending: pendingAuctions.data.docs,
        active: activeAuctions.data.docs,
        ended: endedAuctions.data.docs,
        cancelled: cancelledAuctions.data.docs,
      });
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  useEffect(() => {
    fetchAuctions();
    console.log("Auctionnn: ", auctions.ended)
  }, []);

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderActionButtons = (status, item) => {
    const buttons = [];
    
    buttons.push(
      <CButton key="view" onClick={() => handleAction(MODAL_TYPES.VIEW, item)}>
        Xem
      </CButton>
    );
  
    if (status === AUCTION_STATUS.NEW) {
      buttons.push(
        <CButton key="approve" className="mx-2 btn-success" onClick={() => handleAction(MODAL_TYPES.APPROVE, item)}>
          Duyệt
        </CButton>,
        <CButton key="reject" className="btn-danger" onClick={() => handleAction(MODAL_TYPES.REJECT, item)}>
          Từ chối
        </CButton>
      );
    } else if (status === AUCTION_STATUS.PENDING) {
      buttons.push(
        <CButton key="update" className="mx-2 btn-success" onClick={() => handleAction(MODAL_TYPES.UPDATE, item)}>
          Điều chỉnh
        </CButton>, 
        <CButton key="cancel" className="btn-danger" onClick={() => handleAction(MODAL_TYPES.CANCEL, item)}>
          Hủy
        </CButton>,
        
      );
    } else if (status === AUCTION_STATUS.ACTIVE) {
      buttons.push(
        <CButton key="update" className="mx-2 btn-success" onClick={() => handleAction(MODAL_TYPES.UPDATE, item)}>
          Điều chỉnh
        </CButton>,
        <CButton key="end" className="btn-danger" onClick={() => handleAction(MODAL_TYPES.END, item)}>
          Đóng phiên 
        </CButton> // viet API
      );
    }
    else if (status === AUCTION_STATUS.ENDED) {
      buttons.push(
        <CButton key="recover" className="mx-2 btn-success" onClick={() => handleAction(MODAL_TYPES.UPDATE, item)}>
          Điều chỉnh
        </CButton>, 
      );
    }
    else if (status === AUCTION_STATUS.CANCELLED) {
      buttons.push(
        <CButton key="recover" className="mx-2 btn-success" onClick={() => handleAction(MODAL_TYPES.RECOVER, item)}>
          Khôi phục
        </CButton>, 
      );
    }
  
    return buttons;
  };

  const renderAuctionList = (auctionItems) => (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={auctionItems}
      renderItem={(item) => (
        <List.Item 
          className="d-flex justify-content-start" 
          actions={[
            <div className="d-flex gap-2" >
              {renderActionButtons(item.status, item)}
            </div>
          ]}
        >
          <div style={{ width: '60%' }}>
            <List.Item.Meta
              avatar={
                <img
                  src={item?.productImages[0] ?? noImage}
                  className="rounded"
                  height={60}
                  width={60}
                  alt={item.productName}
                />
              }
              title={<a href="#">{item.productName}</a>}
              description={
                <div className="text-truncate" style={{ maxWidth: '90%' }}>
                  {item.productDescription}
                </div>
              }
            />
          </div>
          <div style={{ width: '30%', maxWidth:'320px' }}>
            <CRow className="d-flex align-items-center">
              <CFormLabel className="mb-0">Thời gian đăng kí</CFormLabel>
              <CFormLabel className="fw-semibold mb-0">
                {formatDateTime(item.createdAt)}
              </CFormLabel>
            </CRow>
          </div>
          <div style={{ width: '30%', maxWidth:'320px' }}>
            <CRow className="d-flex align-items-center">
              <CFormLabel className="mb-0">Trạng thái phiên</CFormLabel>
              <CFormLabel className="fw-semibold mb-0">
                {AuctionStatus[item.status]}
              </CFormLabel>
            </CRow>
          </div>
        </List.Item>
      )}
    />
  );

  const tabItems = [
    {
      key: '1',
      label: 'Tất cả',
      children: renderAuctionList([...auctions.new, ...auctions.pending, ...auctions.active, ...auctions.ended, ...auctions.cancelled])
    },
    {
      key: '2',
      label: 'Chờ duyệt',
      children: renderAuctionList(auctions.new)
    },
    {
      key: '3',
      label: 'Sắp đấu giá',
      children: renderAuctionList(auctions.pending)
    },
    {
      key: '4',
      label: 'Đang đấu giá',
      children: renderAuctionList(auctions.active)
    },
    {
      key: '5',
      label: 'Đã đấu giá',
      children: renderAuctionList(auctions.ended)
    },
    {
      key: '6',
      label: 'Đã hủy',
      children: renderAuctionList(auctions.cancelled)
    }
  ];

  return (
    <div className="app">
      <CRow>
        <CForm className="mb-4">
          <CRow md="8" className="mb-4 fw-bolder fs-6 ms-2">
            Thông tin tìm kiếm
          </CRow>
          <CRow md="12">
            <CRow className="col-md-6 mb-2">
              <CCol md="3" className="d-flex align-items-center">
                <CFormLabel className="mt-2">Tên nhân viên</CFormLabel>
              </CCol>
              <CCol md="7">
                <CFormInput name="fullName" onChange={handleFilter} />
              </CCol>
            </CRow>
            <CRow className="col-md-6 mb-2">
              <CCol md="3" className="d-flex align-items-center">
                <CFormLabel className="mt-2">Email</CFormLabel>
              </CCol>
              <CCol md="7">
                <CFormInput name="email" onChange={handleFilter} />
              </CCol>
            </CRow>
            <CRow className="col-md-6 mb-2">
              <CCol md="3" className="d-flex align-items-center">
                <CFormLabel className="mt-2">Chức vụ</CFormLabel>
              </CCol>
              <CCol md="7">
                <CFormInput name="rolePermission" onChange={handleFilter} />
              </CCol>
            </CRow>
            <CRow className="col-md-6 mb-2">
              <CCol md="3" className="d-flex align-items-center">
                <CFormLabel className="mt-2">Số điện thoại</CFormLabel>
              </CCol>
              <CCol md="7">
                <CFormInput name="phoneNumber" onChange={handleFilter} />
              </CCol>
            </CRow>
          </CRow>
        </CForm>
      </CRow>
      <CRow>
        <CRow md="8" className="mb-4 fw-bolder fs-6 ms-2">
          Kết quả tìm kiếm
        </CRow>
        <CRow>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </CRow>
      </CRow>
      <AuctionModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        data={modalConfig.data}
        status={modalConfig.status}
        onClose={handleCloseModal}
        onSuccess={fetchAuctions}
      />
    </div>
  );
};

export default AuctionManager;