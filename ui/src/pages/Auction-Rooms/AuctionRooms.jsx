import React, { useState, useEffect } from 'react'
import { Hammer, Play, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuctionLive from '../Auction-Live/AuctionLive'

const AuctionRooms = () => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 22, seconds: 47 })
  const [currentPrice, setCurrentPrice] = useState(825000000)
  const userCanBid = true;
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        } else {
          clearInterval(timer)
          return { minutes: 0, seconds: 0 }
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const bidHistory = [
    { price: 825000000, time: '12/09/2024 14:02:03.044', user: 'VPA-***A3W' },
    { price: 75000000, time: '12/09/2024 14:01:59.804', user: 'VPA-***1P5' },
    { price: 70000000, time: '12/09/2024 14:00:59.749', user: 'VPA-***1P5' },
    { price: 65000000, time: '12/09/2024 14:00:58.651', user: 'VPA-***U5W' },
    { price: 60000000, time: '12/09/2024 14:00:37.450', user: 'VPA-***GJV' },
  ]

  return !userCanBid ? (
    <div className='w-full min-h-screen bg-gradient-to-br from-[#02003F] via-purple-900 to-indigo-900 text-white flex flex-col'>
      <style jsx>{`
        @keyframes neon-pulse {
          0%, 100% { box-shadow: 0 0 5px #ff00de, 0 0 10px #ff00de, 0 0 20px #ff00de; }
          50% { box-shadow: 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 40px #ff00de; }
        }
        .neon-border {
          animation: neon-pulse 1.5s infinite alternate;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <header className='w-full p-4 flex justify-between items-center border-b border-indigo-600'>
        <Link to="/" className="text-xl font-semibold flex items-center text-white hover:text-pink-400 transition-colors duration-300">
          <Hammer className='mr-2' />
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-transparent bg-clip-text">Auction House</span>
        </Link>
        <div className='flex items-center'>
          <Play size={35} className='p-2 text-white rounded-full bg-gradient-to-r from-orange-400 to-pink-500 mr-2' />
          <h2 className='text-lg font-bold bg-gradient-to-r from-orange-400 to-pink-500 uppercase text-white py-2 px-8 rounded-full '>
            Trực tiếp đấu giá
          </h2>
        </div>
      </header>

      <main className='flex-grow py-8 px-10'>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-8 flex flex-col items-center neon-border">
              <div className="glass-effect rounded-2xl p-6 text-center mb-4 bg-[#170B5E]">
                <h2 className="text-white text-base font-semibold mb-2 text-center tracking-[0.5rem] ">THỜI GIAN CÒN LẠI</h2>
                <div className="text-4xl font-bold text-white tracking-[0.5rem] ">
                  {timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
                </div>
              </div>
              <img
                src='https://cdn.motor1.com/images/mgl/MkO9NN/s1/future-supercars.webp'
                className='w-48 h-40 hover:scale-105 transform  transition-transform duration-300  shadow-2xl'
              />
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6 neon-border">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Bell className="w-8 h-8 mr-3 text-yellow-400" />
                <span className="text-2xl font-bold text-pink-300">Lịch sử đấu giá</span>
              </div>
              <div className="text-2xl font-bold text-green-400">+750.000.000</div>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {bidHistory.map((bid, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-3 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
                  <div className="font-bold text-green-400">{formatPrice(bid.price)} Đ</div>
                  <div className="text-pink-300">{bid.time}</div>
                  <div className="text-blue-300">{bid.user}</div>
                </div>
              ))}
            </div>
            <div className="text-3xl mt-4 text-center">
              Giá hiện tại: <br />
              <span className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
                {formatPrice(currentPrice)} Đ
              </span>
            </div>
          </div>
        </div>
      </main>

      <footer className='h-16 w-full bgfooter_auctionroom overflow-hidden mb-4'>
        <div className='h-full w-full rounded-t-2xl flex items-center justify-between px-6'>
          <div className="w-full relative">
            <div className="text-lg font-bold text-white whitespace-nowrap animate-marquee">
              SẢN PHẨM ĐẤU GIÁ NGÀY 19/09:
              <span className='ml-2'>
                Lamborghini Aventador
              </span>
              <span className="ml-10 text-lg font-bold text-pink-300"> Đăng ký đấu giá ngay tại ACTIONHOUSE.COM.VN</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
    :
    (
      <AuctionLive />
    )
}

export default AuctionRooms