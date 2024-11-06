// hooks/useAuctionSocket.js

import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

export const useAuctionSocket = (auctionId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [auctionData, setAuctionData] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
      const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    newSocket.on('error', (error) => {
      setError(error.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !auctionId) return;

    socket.emit('joinAuctionRoom', auctionId);

    socket.on('roomInfo', (data) => {
      setAuctionData(data);
      setCurrentBid(parseFloat(data.currentBid));
    });

    socket.on('bidUpdated', (data) => {
      setCurrentBid(parseFloat(data.currentBid));
    });

    socket.on('auctionEnded', (data) => {
      setAuctionData((prevData) => ({ ...prevData, ended: true, winner: data.winner, winningBid: data.winningBid }));
    });

    return () => {
      socket.off('roomInfo');
      socket.off('bidUpdated');
      socket.off('auctionEnded');
    };
  }, [socket, auctionId]);

  const placeBid = useCallback((amount) => {
    if (socket) {
      socket.emit('placeBid', { roomId: auctionId, bidAmount: amount });
    }
  }, [socket, auctionId]);

  return {
    isConnected,
    auctionData,
    currentBid,
    error,
    placeBid
  };
};