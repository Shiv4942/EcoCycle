import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProduct, deleteProduct, buyProduct } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError(null);
        const response = await getProduct(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/marketplace');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleBuy = async () => {
    if (!window.confirm('Are you sure you want to buy this product?')) {
      return;
    }

    try {
      await buyProduct(id);
      toast.success('Product purchased successfully!');
      navigate('/marketplace');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to purchase product');
      console.error('Error buying product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Product</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const canEdit = user && (user._id === product.seller?._id || user.role === 'admin');
  const canBuy = user && (product.status === 'available' || (product.isAvailable && !product.status)) && user._id !== product.seller?._id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Product Image */}
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          {product.image || (product.images && product.images.length > 0) ? (
            <img
              src={product.image || product.images[0]}
              alt={product.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-full h-64 flex items-center justify-center bg-gray-200" style={{ display: product.image || (product.images && product.images.length > 0) ? 'none' : 'flex' }}>
            <span className="text-gray-500 text-lg">No image available</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name || 'Unnamed Product'}</h1>
              <p className="text-2xl font-semibold text-green-600">₹{product.price || 0}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                product.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                product.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                product.condition === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {product.condition ? (product.condition.charAt(0).toUpperCase() + product.condition.slice(1)) : 'Unknown'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description || 'No description available'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{product.model || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{product.year || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'available' ? 'bg-green-100 text-green-800' : 
                    product.status === 'sold' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status === 'available' ? 'Available' : 
                     product.status === 'sold' ? 'Sold' : 'Reserved'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="border-t pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {product.seller?.name || 'N/A'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Location:</span> {product.locationString || (product.location?.city && product.location?.state ? `${product.location.city}, ${product.location.state}` : 'N/A')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Marketplace
            </button>
            
            {canBuy && (
              <button
                onClick={handleBuy}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Buy Product
              </button>
            )}
            
            {canEdit && (
              <>
                <button
                  onClick={() => navigate(`/api/products/edit/${id}`)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Product
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 