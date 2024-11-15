import React from 'react';
import NewAuctions from './AuctionApproveComponent';

import '../../scss/AuctionApprove.scss'; 

import { useEffect, useState } from 'react'

import auctionAPI from '../../service/AuctionService';

const AuctionManager = () => {

    const [allNewAuction, setAllNewAuction] = useState([]);
    const [allPendingAuction, setAllPendingAuction] = useState();
    const [allActiveAuction, setAllActiveAuction] = useState();

    const fetchDataAllNewAuction = async () => {
      await auctionAPI.getNewAuction().then(result => {
          setAllNewAuction(result.data.docs);
          console.log("NewAuction: ", result.data)
      });
    }
    useEffect(() => {
      fetchDataAllNewAuction();
    }, []);
    
    const fetchDataAllPendingAuction = async () => {
        await auctionAPI.getPendingAuction().then(result => {
          setAllPendingAuction(result.data.docs);
            console.log("PendingAuction: ", result.data)
        });
      }
    useEffect(() => {
      fetchDataAllPendingAuction();
    }, []);

    const fetchDataAllActiveAuction = async () => {
      await auctionAPI.getActiveAuction().then(result => {
        setAllActiveAuction(result.data.docs);
          console.log("ActiveAuction: ", result.data)
      });
    }
    useEffect(() => {
      fetchDataAllActiveAuction();
    }, []);
    
    const handleRefresh = () => {
      fetchDataAllNewAuction();
      fetchDataAllPendingAuction();
      fetchDataAllActiveAuction();
    };

    return (
      <div className="app">
        <div className="dashboard">
          <NewAuctions auctions={allNewAuction} type={"New"} onStatusChange={handleRefresh} />
          <NewAuctions auctions={allPendingAuction} type={"Pending"} onStatusChange={handleRefresh}/>
          <NewAuctions auctions={allActiveAuction} type={"Active"} onStatusChange={handleRefresh}/>
        </div>
      </div>
    );
};

export default AuctionManager;
