import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, QrCode, Users, TrendingUp, Calendar, MapPin } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user, isAdmin, isNGO } = useAuth();
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingPickups: 0,
    completedPickups: 0,
    totalProducts: 0
  });
  const [recentPickups, setRecentPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's pickups
      const pickupsResponse = await api.get('/api/pickup/my-pickups');
      const pickups = pickupsResponse.data;
      
      // Fetch user's products
      const productsResponse = await api.get('/api/products/my-products');
      const products = productsResponse.data;

      // Calculate stats
      const totalPickups = pickups.length;
      const pendingPickups = pickups.filter(p => p.status === 'pending').length;
      const completedPickups = pickups.filter(p => p.status === 'recycled').length;

      setStats({
        totalPickups,
        pendingPickups,
        completedPickups,
        totalProducts: products.length
      });

      setRecentPickups(pickups.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      assigned: 'text-blue-600 bg-blue-100',
      collected: 'text-green-600 bg-green-100',
      recycled: 'text-purple-600 bg-purple-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getRoleSpecificContent = () => {
    if (isAdmin) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
            <div className="space-y-3">
              <Link
                to="/api/admin/pickups"
                className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Package className="h-5 w-5 mr-3" />
                Manage All Pickups
              </Link>
              <Link
                to="/api/admin/users"
                className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Users className="h-5 w-5 mr-3" />
                Manage Users
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (isNGO) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">NGO Actions</h3>
            <div className="space-y-3">
              <Link
                to="/api/admin/pickups"
                className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Package className="h-5 w-5 mr-3" />
                View Assigned Pickups
              </Link>
              <Link
                to="/qr-scanner"
                className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <QrCode className="h-5 w-5 mr-3" />
                Scan QR Codes
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/api/pickup/new"
              className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Package className="h-5 w-5 mr-3" />
              Schedule Pickup
            </Link>
            <Link
              to="/api/products/add"
              className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 mr-3" />
              List Product
            </Link>
            <Link
              to="/qr-scanner"
              className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <QrCode className="h-5 w-5 mr-3" />
              Scan QR Code
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {isAdmin ? 'Admin Dashboard' : isNGO ? 'NGO Dashboard' : 'User Dashboard'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPickups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPickups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedPickups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Role-specific content */}
        <div className="lg:col-span-1">
          {getRoleSpecificContent()}
        </div>

        {/* Recent Pickups */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Pickups</h2>
            </div>
            <div className="p-6">
              {recentPickups.length > 0 ? (
                <div className="space-y-4">
                  {recentPickups.map((pickup) => (
                    <div key={pickup._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {pickup.deviceType} - {pickup.deviceDescription}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {pickup.address.city}, {pickup.address.state}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(pickup.preferredPickupDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                          {pickup.status}
                        </span>
                        <Link
                          to={`/api/pickup/${pickup._id}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No pickups yet</p>
                  <Link
                    to="/api/pickup/new"
                    className="mt-2 inline-block text-green-600 hover:text-green-700 font-medium"
                  >
                    Schedule your first pickup
                  </Link>
                </div>
              )}
              
              {recentPickups.length > 0 && (
                <div className="mt-6 text-center">
                  <Link
                    to="/api/pickup/my-pickups"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View all pickups →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 