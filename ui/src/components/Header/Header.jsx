import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Hammer, Bell, LogOut, Settings, UserCircle } from 'lucide-react';
import LoginModal from './LoginModal ';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate login state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const lastScrollY = useRef(0);
  const userDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  const headerRef = useRef(null);

  // Dummy notifications data
  const notifications = [
    { id: 1, message: "New bid on your item", time: "5 minutes ago" },
    { id: 2, message: "Auction ending soon", time: "1 hour ago" },
    { id: 3, message: "You won an auction!", time: "2 days ago" },
  ];

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserDropdown(false);
  };

  const handleScroll = useCallback(() => {
    const header = headerRef.current;
    if (!header) return;

    const currentScrollY = window.scrollY;
    const scrollThreshold = 100;

    if (currentScrollY > scrollThreshold) {
      header.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
      if (currentScrollY < lastScrollY.current) {
        header.style.transform = 'translateY(0)';
      } else {
        header.style.transform = 'translateY(-100%)';
      }
    } else {
      header.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
      header.style.transform = 'translateY(0)';
    }

    lastScrollY.current = currentScrollY;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current && !userDropdownRef.current.contains(event.target) &&
        notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
        setShowNotifications(false);
      }
    };

    const throttledScrollHandler = () => {
      window.requestAnimationFrame(handleScroll);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', throttledScrollHandler);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
    setShowNotifications(false);
  };
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserDropdown(false);
  };

  return (
    <header
      ref={headerRef}
      className="bg-white shadow-sm transition-transform duration-300 z-20"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-semibold flex items-center">
            <Hammer className="mr-2" />
            Auction House
          </Link>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/auctions/ongoing" className="hover:text-gray-900 font-medium hover:underline text-sm">
                  Live Auctions
                </Link>
              </li>
              <li>
                <Link to="/auctions/upcoming" className="hover:text-gray-900 font-medium hover:underline text-sm">
                  Upcoming Auctions
                </Link>
              </li>
              <li>
                <Link to="/products/sell" className="hover:text-gray-900 font-medium hover:underline text-sm">
                  Sell
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gray-900 font-medium hover:underline text-sm">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search auctions..."
              className="pl-8 pr-2 py-2 border rounded-md outline-none text-sm"
            />
          </div>
          {isLoggedIn ? (
            <>
              <div className="relative" ref={notificationsDropdownRef}>
                <Bell
                  className="text-gray-600 cursor-pointer"
                  size={24}
                  onClick={toggleNotifications}
                />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 z-50">
                    <div className="px-4 py-2 bg-gray-100 font-semibold text-gray-800">Notifications</div>
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                    <div className="px-4 py-2 text-center">
                      <Link to="/notifications" className="text-sm text-blue-600 hover:underline">View all notifications</Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={userDropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleUserDropdown}
                >
                  <img
                    src="/api/placeholder/32/32"
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">John Doe</span>
                </div>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">John Doe</p>
                      <p className="text-xs text-gray-500">john.doe@example.com</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <UserCircle className="inline-block mr-2" size={16} />
                      User Information
                    </Link>
                    <Link to="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="inline-block mr-2" size={16} />
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                    >
                      <LogOut className="inline-block mr-2" size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <User
              className="text-gray-600 cursor-pointer"
              size={24}
              onClick={() => setIsModalOpen(true)}
            />
          )}
        </div>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setIsModalOpen(false);
        }}
      />
    </header>
  );
};

export default Header;