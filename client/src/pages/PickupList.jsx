import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Filter, Eye, Edit, Calendar, MapPin, User } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const PickupList = () => {
  const { user, isAdmin, isNGO } = useAuth();
  const location = useLocation();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    deviceType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAdminView = location.pathname.includes('/admin');

  useEffect(() => {
    fetchPickups();
  }, [filters, currentPage, isAdminView]);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      let endpoint = isAdminView ? '/pickup' : '/pickup/my-pickups';
      const params = new URLSearchParams({
        ...filters,
        page: currentPage,
        limit: 10
      });
      
      const response = await api.get(`${endpoint}?${params}`);
      
      if (isAdminView) {
        setPickups(response.data.pickups);
        setTotalPages(response.data.totalPages);
      } else {
        setPickups(response.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching pickups:', error);
      toast.error('Failed to fetch pickups');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (pickupId, newStatus) => {
    try {
      await api.patch(`/pickup/${pickupId}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchPickups();
    } catch (error) {
      toast.error('Failed to update status');
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

  const deviceTypes = [
    'laptop', 'desktop', 'mobile', 'tablet', 'printer', 'monitor', 'keyboard', 'mouse', 'other'
  ];

  const statusOptions = [
    'pending', 'assigned', 'collected', 'recycled', 'cancelled'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isAdminView ? 'Manage Pickups' : 'My Pickups'}
        </h1>
        <p className="text-gray-600">
          {isAdminView ? 'View and manage all pickup requests' : 'Track your e-waste pickup requests'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="input-field"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.deviceType}
            onChange={(e) => setFilters(prev => ({ ...prev, deviceType: e.target.value }))}
            className="input-field"
          >
            <option value="">All Device Types</option>
            {deviceTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          {!isAdminView && (
            <Link
              to="/pickup/new"
              className="btn-primary text-center"
            >
              Schedule New Pickup
            </Link>
          )}
        </div>
      </div>

      {/* Pickups List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {pickups.length} pickup{pickups.length !== 1 ? 's' : ''} found
          </h2>
        </div>

        <div className="p-6">
          {pickups.length > 0 ? (
            <div className="space-y-4">
              {pickups.map((pickup) => (
                <div key={pickup._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {pickup.deviceType} - {pickup.deviceDescription}
                          </h3>
                          <p className="text-sm text-gray-500">Quantity: {pickup.quantity}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          {pickup.user?.name || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {pickup.address?.city}, {pickup.address?.state}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(pickup.preferredPickupDate).toLocaleDateString()}
                        </div>
                      </div>

                      {pickup.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Notes:</strong> {pickup.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pickup.status)}`}>
                            {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                          </span>
                          
                          {(isAdmin || isNGO) && (
                            <select
                              value={pickup.status}
                              onChange={(e) => handleStatusUpdate(pickup._id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/pickup/${pickup._id}`}
                            className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Link>
                          
                          {pickup.qrCode && (
                            <Link
                              to={`/pickup/${pickup._id}/qr`}
                              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              <Package className="h-4 w-4 mr-1" />
                              QR Code
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {isAdminView ? 'No pickups found matching your criteria.' : 'No pickups yet'}
              </p>
              {!isAdminView && (
                <Link
                  to="/pickup/new"
                  className="btn-primary"
                >
                  Schedule your first pickup
                </Link>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === page
                        ? 'bg-green-600 text-white border-green-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupList; 