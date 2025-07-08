import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, Settings, Package, ShoppingBag, QrCode, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isNGO } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Package className="h-10 w-10 mr-3" />
              <span className="text-2xl font-bold">EcoCycle</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/marketplace" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
              Marketplace
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link to="/admin/dashboard" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link to="/dashboard" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                    Dashboard
                  </Link>
                )}
                <Link to="/api/pickup/new" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                  Schedule Pickup
                </Link>
                {(isAdmin || isNGO) && (
                  <Link to="/qr-scanner" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                    QR Scanner
                  </Link>
                )}
                
                {isAdmin && (
                  <Link to="/admin/users" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                    Manage Users
                  </Link>
                )}
                {(isAdmin || isNGO) && (
                  <Link to="/admin/pickups" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                    Manage Pickups
                  </Link>
                )}
                
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {user?.name}
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <Settings className="h-4 w-4 inline mr-2" />
                        Profile
                      </Link>
                      <Link 
                        to="/api/pickup/my-pickups" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <Package className="h-4 w-4 inline mr-2" />
                        My Pickups
                      </Link>
                      <Link 
                        to="/products/add" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <ShoppingBag className="h-4 w-4 inline mr-2" />
                        Add Product
                      </Link>
                      <Link 
                        to="/products/my-products" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <Package className="h-4 w-4 inline mr-2" />
                        My Products
                      </Link>
                      <Link 
                        to="/products/sold" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeDropdown}
                      >
                        <Package className="h-4 w-4 inline mr-2" />
                        Sold Products
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="hover:bg-green-700 px-4 py-3 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-green-700 hover:bg-green-800 px-4 py-3 rounded-md text-base font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-green-700 p-3 rounded-md"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-600">
            <Link
              to="/"
              className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/api/pickup/new"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Schedule Pickup
                </Link>
                {(isAdmin || isNGO) && (
                  <Link
                    to="/qr-scanner"
                    className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    QR Scanner
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/api/pickup/my-pickups"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Pickups
                </Link>
                <Link
                  to="/products/add"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Add Product
                </Link>
                <Link
                  to="/products/my-products"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Products
                </Link>
                <Link
                  to="/products/sold"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sold Products
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin/users"
                    className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Users
                  </Link>
                )}
                {(isAdmin || isNGO) && (
                  <Link
                    to="/admin/pickups"
                    className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Manage Pickups
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block hover:bg-green-700 px-4 py-3 rounded-md text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 