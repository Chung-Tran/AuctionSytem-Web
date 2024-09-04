import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Upcomming from './pages/Upcomming/Upcomming';
import ProductDetail from './pages/ProductDetail/ProductDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/upcoming-auctions" element={<Upcomming />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
        </Route>
        {/* Routes no-layout. Cho page room đấu giá SP */}
        {/* <Route path="/no-layout" element={<NoLayoutPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
