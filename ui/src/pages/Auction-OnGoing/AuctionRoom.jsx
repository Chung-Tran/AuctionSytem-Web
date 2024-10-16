import React, { useState, useEffect, useCallback } from 'react';
import { Clock, CircleDollarSign } from 'lucide-react';
import AuctionChat from './AuctionChat';
import { useAuctionSocket } from '../../config/socket';
import CheckAuctionAccess from './CheckAuctionAccess';
//Allow action (registered)
const AuctionRoom = () => {
    const { isConnected, auctionData, error, placeBid } = useAuctionSocket('123');

    const [currentBid, setCurrentBid] = useState(14120000000);
    const [bidAmount, setBidAmount] = useState(5000000);
    const [timeLeft, setTimeLeft] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [notifications, setNotifications] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (!isNaN(quantity)) {
            setQuantity(quantity + 1);
        } else {
            setQuantity(0);
        }
    };
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) || !!value) {
            setQuantity(parseInt(value, 10));
        } else {
            setQuantity(0);
        }
    };

    const handleBlur = () => {
        if (quantity <= 0 || isNaN(quantity)) {
            setQuantity(1);
        }
    };
    const addNotification = useCallback((message) => {
        setNotifications(prevNotifications => [...prevNotifications, { message, id: Date.now() }]);
    }, []);
    const removeNotification = useCallback((id) => {
        setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
    }, []);
    useEffect(() => {
        if (notifications.length > 0) {
            const timer = setTimeout(() => {
                removeNotification(notifications[0].id);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notifications, removeNotification]);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    return (
        <div className="flex h-screen bg-[#000116] text-white w-full" >
            <div className="flex-1 flex flex-col items-center justify-start pt-8 relative bg-auctionroom w-1/2 h-full">
                <div className="absolute top-0 left-0 bg-red-600 text-white px-4 py-1 text-sm ">TRỰC TIẾP</div>
                {/* Time remain */}
                <div className='mt-[15%]'>
                    {notifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            className={`absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-[#000116] text-white px-4 py-3 rounded transition-all duration-500 border border-white 
                                ${index === 0 ? 'opacity-100 translate-y-full' : 'opacity-0 -translate-y-3/4'}
                                `}
                            style={{ zIndex: notifications.length - index }}
                        >
                            <p className="text-gray-400 text-sm mb-2">10:46:18</p>
                            <p className="text-white text-lg "><b>Nguyễn Văn B</b> vừa trả giá <b>5.000.000đ</b></p>
                        </div>
                    ))}

                    <div className='bg-[#000116] border-2 border-white p-4 mb-6'>
                        <h2 className="text-red-500 text-base font-semibold mb-2 text-center tracking-[0.5rem] ">THỜI GIAN CÒN LẠI</h2>
                        <div className=" p-2 text-red-500 text-5xl font-bold flex justify-center items-center space-x-4">
                            <div>{formatTime(timeLeft).split(':')[0]} <span className="text-sm">Phút</span></div>
                            <div>:</div>
                            <div>{formatTime(timeLeft).split(':')[1]} <span className="text-sm">Giây</span></div>
                        </div>
                    </div>
                    <div className='border border-white h-48 w-48 justify-center  m-auto'></div>
                </div>
                <AuctionChat
                />

            </div>
            <div className="w-[45%] flex flex-col p-2 items-end ml-auto items-center justify-center">
                <h2 className='text-center my-4 flex mx-auto text-xl'>Đấu giá viên: &nbsp;<b>Nguyễn Văn A</b></h2>
                <div className="bg-[#00082C] py-6 px-6 mb-4 rounded-md w-full">
                    <h2 className="text-xl mb-4 flex items-center">
                        <Clock className="mr-2" />
                        Diễn biến cuộc đấu giá
                    </h2>
                    <div className="space-y-3">
                        {[
                            { bid: 14120000000, time: '15/09/2024 • 10:46:18.922', user: 'VPA-1OZI' },
                            { bid: 14115000000, time: '15/09/2024 • 10:21:38.761', user: 'VPA-625U' },
                            { bid: 14105000000, time: '15/09/2024 • 10:21:04.192', user: 'VPA-GFUC' },
                            { bid: 14105000000, time: '15/09/2024 • 10:21:04.192', user: 'VPA-GFUC' },
                            { bid: 14105000000, time: '15/09/2024 • 10:21:04.192', user: 'VPA-GFUC' },
                        ].map((bid, index) => (
                            <div key={index} className="flex justify-between space-y-2">
                                <div className='flex flex-col'>
                                    <span className="text-green-400">{formatCurrency(bid.bid)}</span>
                                    <span className="text-gray-400">{bid.time}</span>
                                </div>
                                <span className="text-yellow-400">{bid.user}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#00082C] py-2 px-6 rounded-md w-full ">
                    <div className="flex justify-between items-center mb-4 border-b border-color p-4 ">
                        <h2 className="text-xl flex">     <CircleDollarSign className='mr-2' /> Giá hiện tại</h2>
                        <div className="text-2xl font-bold text-green-400">{formatCurrency(currentBid)}</div>
                    </div>

                    <div className="flex items-center space-x-2 mb-6 justify-between items-center">
                        <div>
                            <span className='text-base'>Bước giá:</span> &nbsp;
                            <span className="bg-transparent p-2 px-4 rounded w-32 text-right border border-color rounded-3xl outline-0 ">
                                {formatCurrency(bidAmount)}
                            </span>
                        </div>
                        <span className='font-bold text-3xl'>x</span>
                        <div className='flex w-fit border rounded-3xl p-1 space-x-2 border-color'>
                            <button
                                className="bg-gray-700 p-2 rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-2xl"
                                onClick={handleDecrease}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={quantity}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className='border-0 outline-0 text-white bg-transparent w-10 text-center'
                            />
                            <button
                                className="bg-gray-700 p-2 rounded-full h-8 flex items-center justify-center font-bold text-white text-2xl"
                                onClick={handleIncrease}
                            >
                                +
                            </button>
                        </div>
                        <span className='font-bold text-3xl'>=</span>
                        <span className='border p-2 px-4 border-color rounded-3xl'>
                            {formatCurrency(bidAmount * quantity)}
                        </span>
                    </div>

                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-full font-bold text-lg"
                        onClick={() => addNotification('This is a test notification')}
                    >
                        Trả giá {formatCurrency(currentBid + bidAmount)}
                    </button>
                    <div className="text-center text-sm mt-2 text-gray-400">
                        Mười bốn tỷ một trăm hai mươi lăm triệu đồng
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionRoom
