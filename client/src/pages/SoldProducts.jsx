import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSoldProducts } from '../services/api';
import { Package, User, Calendar, DollarSign, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const SoldProducts = () => {
  const [soldProducts, setSoldProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchSoldProducts();
  }, [currentPage]);

  const fetchSoldProducts = async () => {
    try {
      setLoading(true);
      const response = await getSoldProducts(currentPage);
      setSoldProducts(response.data.soldProducts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to load sold products');
      console.error('Error fetching sold products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Package className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Sold Products</h1>
        </div>

        {soldProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Sold Products</h2>
            <p className="text-gray-600">
              {user?.role === 'admin' 
                ? 'No products have been sold yet.' 
                : 'You haven\'t sold any products yet.'}
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-green-600">Total Sold</p>
                    <p className="text-2xl font-bold text-green-900">{soldProducts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-blue-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatPrice(soldProducts.reduce((sum, product) => sum + product.price, 0))}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm text-purple-600">Unique Buyers</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {new Set(soldProducts.map(p => p.buyer?._id)).size}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm text-orange-600">This Month</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {soldProducts.filter(p => {
                        const soldDate = new Date(p.soldAt);
                        const now = new Date();
                        return soldDate.getMonth() === now.getMonth() && 
                               soldDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sold Products List */}
            <div className="space-y-4">
              {soldProducts.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                      {product.image || (product.images && product.images.length > 0) ? (
                        <img
                          src={product.image || product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">{formatPrice(product.price)}</p>
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Sold
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{product.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Condition:</span>
                          <p className="font-medium capitalize">{product.condition}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Views:</span>
                          <p className="font-medium flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {product.views}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Sold Date:</span>
                          <p className="font-medium">{formatDate(product.soldAt)}</p>
                        </div>
                      </div>

                      {/* Buyer Information */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-500 text-sm">Buyer:</span>
                            <p className="font-medium">{product.buyer?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">{product.buyer?.email}</p>
                          </div>
                          
                          {user?.role === 'admin' && (
                            <div>
                              <span className="text-gray-500 text-sm">Seller:</span>
                              <p className="font-medium">{product.seller?.name || 'Unknown'}</p>
                              <p className="text-sm text-gray-600">{product.seller?.email}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SoldProducts; 