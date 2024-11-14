import React from 'react';
import CompletedAuctions from '../../views/Auction/CompletedAuctions';
import '../../scss/AuctionManager.scss'; 

import { useEffect, useState } from 'react'

import auctionAPI from '../../service/AuctionService';

const AuctionManager = () => {

    const [allOnGoing, setAllOnGoing] = useState();

    
    
      const completedAuctions = [
        {
          id: 1,
          title: 'Điện thoại của thầy Nhã',
          endDate: '2024-11-01',
          winner: 'Nguyễn Thị Dung',
          finalPrice: '20,000,000',
        },
        {
          id: 2,
          title: 'Trái banh của Hữu Lợi',
          endDate: '2024-10-25',
          winner: 'Lê Văn Việt',
          finalPrice: '35,000,000',
        },
      ];
    
      return (
        <div className="app">
          <h1>Quản lý phiên đấu giá</h1>
          <div className="completed-section">
            <CompletedAuctions auctions={completedAuctions} />
          </div>
        </div>
      );
};

export default AuctionManager;
