import { useState, useRef } from 'react';
import WebcamQRScanner from '../components/WebcamQRScanner';
import { QrCode, Package, User, MapPin, Calendar, CheckCircle, XCircle, Upload, Camera } from 'lucide-react';
import jsQR from 'jsqr';
import api from '../services/api';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState('camera'); // 'camera' or 'upload'
  const fileInputRef = useRef(null);

  const handleScan = async (result) => {
    if (result && !scannedData) {
      setScanning(false);
      setLoading(true);
      await processQRCode(result?.text);
    }
  };

  const handleError = (error) => {
    console.error('QR Scanner error:', error);
    toast.error('Error accessing camera');
  };

  const resetScanner = () => {
    setScanning(true);
    setScannedData(null);
    setScanMode('camera');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setLoading(true);
    
    try {
      // Create canvas to process image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        try {
          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Decode QR code using jsQR
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            // QR code found, process it
            toast.success('QR code detected in image!');
            await processQRCode(code.data);
          } else {
            toast.error('No QR code found in the image');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error decoding QR code:', error);
          toast.error('Error processing QR code from image');
          setLoading(false);
        }
      };
      
      img.onerror = () => {
        toast.error('Error loading image file');
        setLoading(false);
      };
      
      // Load image from file
      img.src = URL.createObjectURL(file);
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Error processing image file');
      setLoading(false);
    }
  };

  const processQRCode = async (qrData) => {
    try {
      const response = await api.post('/api/pickup/scan', { qrCode: qrData });
      setScannedData(response.data.pickup);
      toast.success('QR Code processed successfully! Pickup marked as collected.');
    } catch (error) {
      toast.error('Invalid QR code or pickup not found');
      setScanning(true); // Reset scanning state on error
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'collected':
      case 'recycled':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center mb-6">
          <QrCode className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
        </div>

        {scanning && !scannedData && (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setScanMode('camera')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  scanMode === 'camera'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Camera className="h-5 w-5 mr-2" />
                Camera Scan
              </button>
              <button
                onClick={() => setScanMode('upload')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  scanMode === 'upload'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Image
              </button>
            </div>

            {scanMode === 'camera' ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Point your camera at a QR code to scan pickup information
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <WebcamQRScanner onScan={handleScan} scanning={scanning} loading={loading} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Upload a QR code image to scan pickup information
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <div
                      onClick={handleUploadClick}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload QR code image</p>
                      <p className="text-sm text-gray-500">Supports JPG, PNG, GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        )}

        {scannedData && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Pickup Information</h2>
              <button
                onClick={resetScanner}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Scan Another
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pickup Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Pickup Details
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">QR Code:</span>
                    <p className="text-sm text-gray-900 font-mono">{scannedData.qrCode}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Device Type:</span>
                    <p className="text-sm text-gray-900 capitalize">{scannedData.deviceType}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Description:</span>
                    <p className="text-sm text-gray-900">{scannedData.deviceDescription}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Quantity:</span>
                    <p className="text-sm text-gray-900">{scannedData.quantity}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scannedData.status)}`}>
                      {getStatusIcon(scannedData.status)}
                      <span className="ml-1 capitalize">{scannedData.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  User Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <p className="text-sm text-gray-900">{scannedData.user?.name}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-sm text-gray-900">{scannedData.user?.email}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-sm text-gray-900">{scannedData.user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Pickup Address
                </h3>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-900">
                    {scannedData.address?.street}
                  </p>
                  <p className="text-sm text-gray-900">
                    {scannedData.address?.city}, {scannedData.address?.state} {scannedData.address?.zipCode}
                  </p>
                  {scannedData.address?.additionalInfo && (
                    <p className="text-sm text-gray-600">
                      {scannedData.address.additionalInfo}
                    </p>
                  )}
                </div>
              </div>

              {/* Schedule Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Preferred Date:</span>
                    <p className="text-sm text-gray-900">
                      {new Date(scannedData.preferredPickupDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Time Slot:</span>
                    <p className="text-sm text-gray-900 capitalize">{scannedData.preferredTimeSlot}</p>
                  </div>
                  
                  {scannedData.collectionDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Collected On:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(scannedData.collectionDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {scannedData.recyclingDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Recycled On:</span>
                      <p className="text-sm text-gray-900">
                        {new Date(scannedData.recyclingDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {scannedData.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-900">{scannedData.notes}</p>
              </div>
            )}

            {scannedData.assignedTo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Assigned To</h3>
                <p className="text-sm text-gray-900">
                  {scannedData.assignedTo.name} ({scannedData.assignedTo.email})
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner; 