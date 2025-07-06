import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, Download, ArrowLeft, Package, Calendar, MapPin, User } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const QRCodeDisplay = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pickup, setPickup] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPickupAndQR();
  }, [id]);

  const fetchPickupAndQR = async () => {
    try {
      // Fetch pickup details
      const pickupResponse = await api.get(`/pickup/${id}`);
      setPickup(pickupResponse.data);

      // Fetch QR code
      const qrResponse = await api.get(`/pickup/${id}/qr`);
      setQrCode(qrResponse.data.qrCode);
    } catch (error) {
      console.error('Error fetching pickup and QR code:', error);
      toast.error('Failed to load pickup details');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `pickup-qr-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded successfully');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!pickup) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pickup Not Found</h1>
          <p className="text-gray-600 mb-6">The pickup request you're looking for doesn't exist.</p>
          <Link
            to="/pickup/my-pickups"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Pickups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/pickup/my-pickups"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Pickups
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pickup QR Code</h1>
        <p className="text-gray-600">Scan this QR code to track your pickup request</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">QR Code</h2>
            
            {qrCode ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={qrCode} 
                    alt="Pickup QR Code" 
                    className="border-4 border-gray-200 rounded-lg"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>QR Code ID: {pickup.qrCode}</p>
                </div>
                
                <button
                  onClick={downloadQRCode}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">QR code not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Pickup Details Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pickup Details</h2>
          
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pickup.status)}`}>
                {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
              </span>
            </div>

            {/* Device Type */}
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">{pickup.deviceType}</p>
                <p className="text-sm text-gray-500">{pickup.deviceDescription}</p>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <span className="text-sm text-gray-900">{pickup.quantity}</span>
            </div>

            {/* Pickup Date */}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(pickup.preferredPickupDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {pickup.preferredTimeSlot} slot
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Pickup Address</p>
                <p className="text-sm text-gray-500">
                  {pickup.address.street}<br />
                  {pickup.address.city}, {pickup.address.state} {pickup.address.zipCode}
                  {pickup.address.additionalInfo && (
                    <><br />{pickup.address.additionalInfo}</>
                  )}
                </p>
              </div>
            </div>

            {/* Assigned To */}
            {pickup.assignedTo && (
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Assigned To</p>
                  <p className="text-sm text-gray-500">
                    {pickup.assignedTo.name} ({pickup.assignedTo.email})
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {pickup.notes && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {pickup.notes}
                </p>
              </div>
            )}

            {/* Dates */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(pickup.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {pickup.collectionDate && (
                  <div>
                    <p className="text-gray-500">Collected</p>
                    <p className="font-medium text-gray-900">
                      {new Date(pickup.collectionDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {pickup.recyclingDate && (
                  <div>
                    <p className="text-gray-500">Recycled</p>
                    <p className="font-medium text-gray-900">
                      {new Date(pickup.recyclingDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to use this QR code:</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Save this QR code to your phone or print it out</li>
          <li>• Present it to the pickup team when they arrive</li>
          <li>• The QR code will be scanned to confirm your pickup</li>
          <li>• You can also use the QR scanner in the app to scan this code</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeDisplay; 