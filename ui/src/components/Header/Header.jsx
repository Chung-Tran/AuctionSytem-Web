import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Hammer, Bell, LogOut, Settings, UserCircle, ChevronDown, Trash2, CheckCircle, AlertCircle,History } from 'lucide-react';
import LoginModal from './LoginModal';
import { AppContext } from '../../AppContext';
import avatarMale from '../../assets/avatarMale.webp'

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulate login state
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(3);
  const lastScrollY = useRef(0);
  const userDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  const headerRef = useRef(null);
  const { user } = useContext(AppContext)
  useEffect(() => {
    setIsLoggedIn(user ? true : false)
  },[user])
  // Dummy notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New bid on your item", timestamp: "5 minutes ago", type: 'info' },
    { id: 2, message: "Auction for item XYZ ends in 1 hour", timestamp: "1 hour ago", type: 'warning' },
    { id: 3, message: "You won the auction for item ABC", timestamp: "2 days ago", type: 'success' },
  ]);

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
    } else {
      header.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
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

  const loadMoreNotifications = () => {
    setVisibleNotifications(prevVisible => prevVisible + 3);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
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
                <Link to="/auctions/sell" className="hover:text-gray-900 font-medium hover:underline text-sm">
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
                  {notifications.length}
                </span>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-200">
                    <div className="px-4 py-2 bg-gray-100 font-semibold text-gray-800 rounded-t-lg">Notifications</div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, visibleNotifications).map(notification => (
                        <div
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 transition duration-300 ease-in-out"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                                aria-label="Delete notification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {visibleNotifications < notifications.length && (
                      <div className="px-4 py-2 text-center border-t border-gray-100">
                        <button
                          onClick={loadMoreNotifications}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center w-full"
                        >
                          View more notifications
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="relative" ref={userDropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleUserDropdown}
                >
                  <img
                    src={avatarMale}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.fullName}</span>
                </div>
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <UserCircle className="inline-block mr-2" size={16} />
                      User Information
                    </Link>
                    <Link to="/profile/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="inline-block mr-2" size={16} />
                      Change Password
                    </Link>
                    <Link to="/auction-submissions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <History className="inline-block mr-2" size={16} />
                      Auction Submissions
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