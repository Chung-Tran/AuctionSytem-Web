import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Route>
        {/* Routes no-layout. Cho page room đấu giá SP */}
        {/* <Route path="/no-layout" element={<NoLayoutPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
