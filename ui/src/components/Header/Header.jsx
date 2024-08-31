// components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User,Hammer } from 'lucide-react';
const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-semibold flex"> <Hammer className='mr-2'/> Auction House</Link>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/live-auctions" className=" hover:text-gray-900 font-medium hover:underline text-sm">Live Auctions</Link></li>
              <li><Link to="/upcoming-auctions" className=" hover:text-gray-900 font-medium hover:underline text-sm">Upcoming Auctions</Link></li>
              <li><Link to="/sell" className=" hover:text-gray-900 font-medium hover:underline text-sm" >Sell</Link></li>
              <li><Link to="/about" className=" hover:text-gray-900 font-medium hover:underline text-sm">About</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search auctions..." className="pl-8 pr-2 py-2 border rounded-md outline-none text-sm" />
          </div>
          <User className="text-gray-600 cursor-pointer" size={24} />
        </div>
      </div>
    </header>
  );
};

export default Header;