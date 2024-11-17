import React, { useEffect, useState } from 'react';
import { CForm, CRow, CCol, CFormLabel, CFormInput, CButton } from '@coreui/react';
import { List, Tabs } from 'antd';
import auctionAPI from '../../service/AuctionService';
import AuctionModal from './AuctionModal';
import { AUCTION_STATUS, MODAL_TYPES } from '../../commons/Constant';
import '../../scss/AuctionApprove.scss';
import noImage from '../../assets/images/no-image.jpg'

const AuctionManager = () => {
  const [auctions, setAuctions] = useState({
    new: [],
    pending: [],
    active: [],
    completed: []
  });
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: null,
    data: null
  });
  const [filterParams, setFilterParams] = useState({
    fullName: '',
    email: '',
    rolePermission: '',
    phoneNumber: ''
  });

  const handleAction = (type, auction) => {
    setModalConfig({
      visible: true,
      type,
      data: auction
    });
  };

  const handleCloseModal = () => {
    setModalConfig({
      visible: false,
      type: null,
      data: null
    });
  };

  const fetchAuctions = async () => {
    try {
      const [newAuctions, pendingAuctions, activeAuctions] = await Promise.all([
        auctionAPI.getNewAuction(),
        auctionAPI.getPendingAuction(),
        auctionAPI.getActiveAuction()
      ]);

      setAuctions({
        new: newAuctions.data.docs,
        pending: pendingAuctions.data.docs,
        active: activeAuctions.data.docs,
        completed: [] // Add API call if needed
      });
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  useEffect(() => {
    fetchAuctions();
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
        <CButton key="approve" className="mx-2" onClick={() => handleAction(MODAL_TYPES.APPROVE, item)}>
          Duyệt
        </CButton>,
        <CButton key="reject" onClick={() => handleAction(MODAL_TYPES.REJECT, item)}>
          Từ chối
        </CButton>
      );
    } else if (status === AUCTION_STATUS.PENDING) {
      buttons.push(
        <CButton key="cancel" className="mx-2" onClick={() => handleAction(MODAL_TYPES.CANCEL, item)}>
          Hủy
        </CButton>
      );
    } else if (status === AUCTION_STATUS.ACTIVE) {
      buttons.push(
        <CButton key="end" className="mx-2" onClick={() => handleAction(MODAL_TYPES.END, item)}>
          Kết thúc
        </CButton>
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
              <CFormLabel className="mb-0">Nhân viên phụ trách</CFormLabel>
              <CFormLabel className="fw-semibold mb-0">
                {item.staffName}
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
      children: renderAuctionList([...auctions.new, ...auctions.pending, ...auctions.active, ...auctions.completed])
    },
    {
      key: '2',
      label: 'Chờ duyệt',
      children: renderAuctionList(auctions.new)
    },
    {
      key: '3',
      label: 'Đang đấu giá',
      children: renderAuctionList(auctions.active)
    },
    {
      key: '4',
      label: 'Đã đấu giá',
      children: renderAuctionList(auctions.completed)
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
        onClose={handleCloseModal}
        onSuccess={fetchAuctions}
      />
    </div>
  );
};

export default AuctionManager;