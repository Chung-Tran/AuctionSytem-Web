import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Upcomming from './pages/Upcomming/Upcomming';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import SellProduct from './pages/SellProduct/SellProduct';
import AuctioningPage from './pages/AuctioningPage/AuctioningPage';
import AuctionLive from './pages/Auction-Live/AuctionLive';
import AuctionRooms from './pages/Auction-Rooms/AuctionRooms';
import AboutPage from './pages/About/AboutPage';
import NotFound from './pages/NotFound';
import ContactPage from './pages/Contact/ContactPage';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './pages/Profile/ProfilePage';
import ChangePassword from './pages/Profile/ChangePasswordPage';
import PrivateRoute from './PrivateRoute';
function App() {
  return (
    <Router>
       <Toaster />
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} /> {/* Homepage */}
          <Route path="/auctions">
            <Route path="upcoming" element={<Upcomming />} /> {/* Danh sách sản phẩm đấu giá sắp tới */}
            <Route path="ongoing" element={<AuctioningPage />} /> {/* Danh sách phòng đang đấu giá hiện tại */}
            <Route path=":slug" element={<ProductDetail />} /> {/* Chi tiết sản phẩm */}
            <Route path="sell" element={<SellProduct />} /> {/* Đăng ký đấu giá sản phẩm */}
          </Route>
          
          <Route path="/about" element={<AboutPage />} /> {/* Về chúng tôi */}
          <Route path="/contact" element={<ContactPage />} /> {/* Về chúng tôi */}

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} /> {/* Thông tin cá nhân */}
            <Route path="/profile/change-password" element={<ChangePassword />} /> {/* Đổi mật khẩu */}
          </Route>
        </Route>

        {/* Routes without Layout. Cho page room đấu giá SP */}
        <Route path="auctions/room/:roomId" element={<AuctionRooms />} /> {/* Phòng đấu giá (cho cả người xem và người tham gia) */}

        {/* 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
