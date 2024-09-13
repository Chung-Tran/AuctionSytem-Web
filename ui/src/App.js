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
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/upcoming-auctions" element={<Upcomming />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/products/register-auction" element={<SellProduct />} />
          <Route path="/auctioning" element={<AuctioningPage />} />
        </Route>
        {/* Routes no-layout. Cho page room đấu giá SP */}
        <Route path="/auctioning-live" element={<AuctionLive />} />
        <Route path="/auctioning-rooms/:roomId" element={<AuctionRooms />} />
      </Routes>
    </Router>
  );
}

export default App;
