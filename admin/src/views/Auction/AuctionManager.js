import React from 'react';
import PendingAuctions from '../../views/Auction/PendingAuctions';
import ActiveAuctionRooms from '../../views/Auction/ActiveAuctionRooms';
import CompletedAuctions from '../../views/Auction/CompletedAuctions';
import '../../scss/AuctionManager.scss'; 

import { useEffect, useState } from 'react'

import auctionAPI from '../../service/AuctionService';

const AuctionManager = () => {

    const [allOnGoing, setAllOnGoing] = useState();

    const pendingAuctions = [
        { id: 1, title: 'Bức tranh sơn dầu', createdDate: '2024-11-11' },
        { id: 2, title: 'Chiếc bình cổ', createdDate: '2024-11-10' },
      ];
    
      const fetchData = async () => {
        await auctionAPI.getOngoing().then(result => {
            setAllOnGoing(result.data.docs);
            console.log("auction: ", result.data)
        });
      }
      useEffect(() => {
        fetchData();
      }, []);
    
      const completedAuctions = [
        {
          id: 1,
          title: 'Bộ sưu tập tem quý hiếm',
          endDate: '2024-11-01',
          winner: 'Le Van C',
          finalPrice: '20,000,000',
        },
        {
          id: 2,
          title: 'Tượng phật cổ',
          endDate: '2024-10-25',
          winner: 'Pham Thi D',
          finalPrice: '35,000,000',
        },
      ];
    
      return (
        <div className="app">
          <h1>Quản lý phiên đấu giá</h1>
          <div className="dashboard">
            <PendingAuctions auctions={pendingAuctions} />
            <ActiveAuctionRooms rooms={allOnGoing} />
          </div>
          <div className="completed-section">
            <CompletedAuctions auctions={completedAuctions} />
          </div>
        </div>
      );
};

export default AuctionManager;
