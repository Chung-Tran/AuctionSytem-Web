import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CircleDollarSign } from 'lucide-react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import AuctionChat from './AuctionChat';
import { useAuctionSocket } from '../../config/socket';
import { formatCurrency, formatDate, formatDateTime, openNotify } from '../../commons/MethodsCommons';
import toast from 'react-hot-toast';
import AuctionEndToast from '../../components/Auctions/AuctionEndToast';
import { useNavigate } from 'react-router-dom';
import productTemplate from '../../assets/productTemplate.jpg'
import { Helmet } from 'react-helmet';
// Constants
const INITIAL_BID_AMOUNT = 5000000;
const NOTIFICATION_DURATION = 2000;

const formatTime = (totalSeconds) => {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeUnits = [
    { value: days, label: 'Ngày' },
    { value: hours, label: 'Giờ' },
    { value: minutes, label: 'Phút' },
    { value: seconds, label: 'Giây' }
  ];

  // Lọc ra các đơn vị thời gian > 0, bắt đầu từ đơn vị lớn nhất
  const significantUnits = timeUnits.reduce((acc, unit, index) => {
    if (unit.value > 0 || index === timeUnits.length - 1 || acc.length > 0) {
      acc.push({
        value: unit.value.toString().padStart(2, '0'),
        label: unit.label
      });
    }
    return acc;
  }, []);

  return significantUnits;
};


const BidHistory = ({ bids }) => (
  <div className="space-y-3">
    {bids.map((bid, index) => (
      <div key={index} className="flex justify-between space-y-2">
        <div className='flex flex-col'>
          <span className="text-green-400">{formatCurrency(bid.bidAmount)}</span>
          <span className="text-gray-400">{formatDateTime(bid.timestamp)}</span>
        </div>
        <span className="text-yellow-400">{bid.userCode}</span>
      </div>
    ))}
  </div>
);

const QuantityControl = ({ quantity, onDecrease, onIncrease, onChange, onBlur }) => (
  <div className='flex w-fit border rounded-3xl p-1 space-x-2 border-color'>
    <button
      className="bg-gray-700 p-2 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-2xl"
      onClick={onDecrease}
    >
      -
    </button>
    <input
      type="text"
      value={quantity}
      onChange={onChange}
      onBlur={onBlur}
      className='border-0 outline-0 text-white bg-transparent w-10 text-center'
    />
    <button
      className="bg-gray-700 p-2 rounded-full h-8 flex items-center justify-center font-bold text-white text-2xl"
      onClick={onIncrease}
    >
      +
    </button>
  </div>
);

const Notification = ({ notifications }) => (
  <>
    {notifications.map((notification, index) => (
      <div
        key={notification.id}
        className={`absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#000116] text-white px-4 py-3 rounded transition-all duration-500 border border-white 
          ${index === 0 ? 'opacity-100 translate-y-full' : 'opacity-0 -translate-y-3/4'}`}
        style={{ zIndex: notifications.length - index }}
      >
        <p className="text-gray-400 text-sm mb-2">{formatDateTime() }</p>
        <p className="text-white text-lg"><b>{notification.userCode}</b> vừa trả giá <b>{ formatCurrency(notification.bidAmount)}</b></p>
      </div>
    ))}
  </>
);
 
const AuctionRoom = () => {
  const { roomId } = useParams();
  
  // State Management
  const [connected, setConnected] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [disable, setDisable] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState();
  const [timeLeft, setTimeLeft] = useState();
  const [quantity, setQuantity] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalBidAmount, setTotalBidAmount] = useState(bidAmount * quantity);
  const [bidHistory, setBidHistory] = useState([]);

  // Socket Connection
  const handleBidUpdate = useCallback((data) => {
    setCurrentBid(data.currentBid);
    setBidHistory(prev => [{
      userId: data.userId,
      userCode: data.userCode,
      bidAmount: data.currentBid,
      timestamp: data.timestamp
    }, ...prev]);
    setNotifications(prev => [{
      userCode: data.userCode,
      bidAmount: data.currentBid,
      timestamp: data.timestamp
    }, ...prev])
  }, []);

  const handleRoomJoin = useCallback((data) => {
    const roomData = JSON.parse(data.roomInfo.auction);
    const productData = roomData.product;
    setRoomInfo(roomData);
    setProductInfo(productData);
    setCurrentBid(parseFloat(data.roomInfo.currentBid) || data.startingPrice);
    setBidHistory(data.bidHistory || []);
    setBidAmount(roomData.bidIncrement);
    setConnected(true);

    // Calculate initial time left
    const endTime = new Date(roomData.endTime);
    const now = new Date();
    const timeLeftInSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
    setTimeLeft(timeLeftInSeconds);
  });

  const showAuctionEndToast = (winnerData) => {
    const handleDismissToast = () => {
      return toast.dismiss('auction-end-toast')
    }
    setDisable(true)
    toast.custom(
      (t) => (
        <AuctionEndToast
          winner={winnerData.winner || null}
          bidAmount={winnerData.winningBid || ""}
          dismissToast={handleDismissToast}
        />
      ),
      {

        position: 'top-center',
        className: 'relative z-50',
        id: 'auction-end-toast',
        duration: 5000
      }
    );
  };

  const { isConnected, auctionData, error, placeBid } = useAuctionSocket(roomId, {
    onBidUpdate: handleBidUpdate,
    onRoomJoined: handleRoomJoin,
    onRoomEnd: showAuctionEndToast,
  });

  // Event Handlers
  const handlePlaceBid = () => placeBid(totalBidAmount);

  const handleQuantityChange = {
    decrease: () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev)),
    increase: () => setQuantity((prev) => (!isNaN(prev) ? prev + 1 : 1)),
    input: (e) => setQuantity(parseInt(e.target.value, 10) || 0),
    blur: () => setQuantity((prev) => (prev <= 0 || isNaN(prev) ? 1 : prev))
  };

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);



  // Effects
  useEffect(() => {
    setTotalBidAmount(bidAmount * quantity);
  }, [quantity, bidAmount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      clearInterval(timer)
      toast.dismiss('auction-end-toast');
      toast.remove('auction-end-toast');
    };
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => removeNotification(notifications[0].id), NOTIFICATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);

  // Error Handling
  if (!roomId) {
    openNotify('error', 'Room not found');
    return <Navigate to="/" />;
  }

  return (
    <div className={`flex h-screen bg-[#000116] text-white w-full`}>
      <Helmet>
        <title>Ongoing</title>
        <meta property="og:title" content="Ongoing" />
        <meta property="og:description" content="Ongoing" />
      </Helmet>
      {disable && (
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
      </div>
    )}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 relative bg-auctionroom w-1/2 h-full">
        <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 text-base soft-pulse">TRỰC TIẾP</div>
        
        <div className='mt-[15%]'>
          <Notification notifications={notifications} />

          <div className='bg-[#000116] border-2 border-white p-4 mb-6'>
            <h2 className="text-red-500 text-base font-semibold mb-2 text-center tracking-[0.5rem]">
              THỜI GIAN CÒN LẠI
            </h2>
            <div className="p-2 text-red-500 text-5xl font-bold flex justify-center items-center space-x-4">
              {formatTime(timeLeft).map((unit, index) => (
                <React.Fragment key={unit.label}>
                  {index > 0 && <div>:</div>}
                  <div>
                    {unit.value} <span className="text-sm">{unit.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className='border border-white h-48 w-48 justify-center m-auto'>
            <img
              src={productInfo?.images[0] || productTemplate}
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        <AuctionChat roomId={roomId} />
      </div>

      <div className="w-[45%] flex flex-col p-2 items-end ml-auto items-center justify-center">
        <h2 className='text-center my-4 flex mx-auto text-xl'>
          Đấu giá viên: &nbsp;<b>{roomInfo?.auctioneer || 'N/A'}</b>
        </h2>
        
        {/* Bid History */}
        <div className="bg-[#00082C] py-6 px-6 mb-4 rounded-md w-full overflow-y-auto max-h-[350px] no-scrollbar">
          <h2 className="text-xl mb-4 flex items-center">
            <Clock className="mr-2" />
            Diễn biến cuộc đấu giá
          </h2>
          <BidHistory bids={bidHistory} />
        </div>

        {/* Bidding Controls */}
        <div className="bg-[#00082C] py-2 px-6 rounded-md w-full">
          <div className="flex justify-between items-center mb-4 border-b border-color p-4">
            <h2 className="text-xl flex">
              <CircleDollarSign className='mr-2' /> Giá hiện tại
            </h2>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(currentBid)}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6 justify-between items-center">
            <div>
              <span className='text-base'>Bước giá:</span> &nbsp;
              <span className="bg-transparent p-2 px-4 rounded w-32 text-right border border-color rounded-3xl outline-0">
                {formatCurrency(bidAmount)}
              </span>
            </div>
            <span className='font-bold text-3xl'>x</span>
            
            <QuantityControl
              quantity={quantity}
              onDecrease={handleQuantityChange.decrease}
              onIncrease={handleQuantityChange.increase}
              onChange={handleQuantityChange.input}
              onBlur={handleQuantityChange.blur}
            />
            
            <span className='font-bold text-3xl'>=</span>
            <span className='border p-2 px-4 border-color rounded-3xl'>
              {formatCurrency(totalBidAmount)}
            </span>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-lg"
            onClick={handlePlaceBid}
            disabled={timeLeft <= 0}
          >
            Trả giá {formatCurrency(totalBidAmount)}
          </button>
          
          <div className="text-center text-sm mt-2 text-gray-400">
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionRoom;