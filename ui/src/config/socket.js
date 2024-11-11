import { useEffect, useState, useCallback, useRef } from 'react';
import io, { connect } from 'socket.io-client';
import { openNotify } from '../commons/MethodsCommons';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

export const useAuctionSocket = (auctionId,
  { onBidUpdate,
    onRoomJoined,
    onGetMessage,
    onNewMessage,
    onRoomEnd,
  } = {}) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [auctionData, setAuctionData] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const connectToSocket = () => {
      setIsConnecting(true);
      const newSocket = io(SOCKET_SERVER_URL, {
        auth: {
          token: localStorage.getItem("token")
        }
      });
      socketRef.current = newSocket;

      const handleConnect = () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('Connected to socket server');
      };

      const handleDisconnect = () => {
        setIsConnected(false);
        setIsConnecting(false);
        console.log('Disconnected from socket server');
        // Reconnect after 5 seconds
        setTimeout(connectToSocket, 5000);
      };

      const handleError = (errorMessage) => {
        setError(errorMessage.message);
        setIsConnecting(false);
      };

      const handleNewToken = ({ token }) => {
        localStorage.setItem('token', token);
      };

      newSocket.on('connect', handleConnect);
      newSocket.on('disconnect', handleDisconnect);
      newSocket.on('error', handleError);
      newSocket.on('newToken', handleNewToken);

      return () => {
        newSocket.off('connect', handleConnect);
        newSocket.off('disconnect', handleDisconnect);
        newSocket.off('error', handleError);
        newSocket.off('newToken', handleNewToken);
        newSocket.disconnect();
      };
    };

    connectToSocket();
  }, []);

  // Xử lý auction room events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !auctionId) return;

    const handleRoomJoined = (data) => {
      if (onRoomJoined) {
        onRoomJoined(data);
      }
    };

    const handleBidUpdate = (data) => {
      setCurrentBid(parseFloat(data.currentBid));
      if (onBidUpdate) {
        onBidUpdate(data);
      }
    };

    const handleGetMessage = (data) => {
      if (onGetMessage) {
        onGetMessage(data);
      }
    };

    const handleReceiveMessage = (data) => {
      if (onNewMessage) {
        onNewMessage(data);
      }
    };


    const handleAuctionEnd = (data) => {
      if (onRoomEnd)
      {
        console.log('end')
        onRoomEnd(data);
      }
    };

    if (socket.connected) {
      socket.emit('joinAuctionRoom', auctionId);
    } else {
      socket.once('connect', () => {
        socket.emit('joinAuctionRoom', auctionId);
      });
    }

    socket.on('roomJoined', handleRoomJoined);
    socket.on('bidUpdated', handleBidUpdate);
    socket.on('auctionEnd', handleAuctionEnd);

    socket.on('chat-history', handleGetMessage);
    socket.on('new-message', handleReceiveMessage);


    return () => {
      socket.off('roomJoined', handleRoomJoined);
      socket.off('bidUpdated', handleBidUpdate);
      socket.off('auctionEnded', handleAuctionEnd);

      socket.off('chat-history', handleGetMessage);
      socket.off('new-message', handleReceiveMessage);
    };
  }, [auctionId]);

  // Xử lý error và hiển thị notify
  useEffect(() => {
    if (error) {
      openNotify('error', error);
      setError(null);
    }
  }, [error]);

  //Đặt giá
  const placeBid = useCallback((amount) => {
    if (socketRef.current) {
      const accessToken = localStorage.getItem('token');
      socketRef.current.emit('placeBid', {
        roomId: auctionId,
        bidAmount: amount,
        token: accessToken
      });
    }
  }, [auctionId]);

  //Get history chat đấu giá
  const getHistoryChat = useCallback(() => {
    if (socketRef.current) {
      const accessToken = localStorage.getItem('token');
      socketRef.current.emit('get-chat-history', {
        roomId: auctionId,
        token: accessToken
      });
    }
  }, [auctionId]);
  //Send chat đấu giá
  const sendChat = useCallback((message) => {
    if (socketRef.current) {
      const accessToken = localStorage.getItem('token');
      socketRef.current.emit('send-message', {
        roomId: auctionId,
        message: message,
        token: accessToken
      });
    }
  }, [auctionId]);

  return {
    isConnected,
    isConnecting,
    auctionData,
    currentBid,
    error,
    placeBid,
    sendChat,
    getHistoryChat,
  };
};