import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, QrCode, Users, Leaf, Shield, Recycle, Trash2, CheckCircle, XCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Package,
      title: 'E-Waste Pickup',
      description: 'Schedule convenient pickups for your electronic waste. We handle everything from laptops to mobile phones.',
      color: 'text-green-600'
    },
    {
      icon: ShoppingBag,
      title: 'Buy & Sell Marketplace',
      description: 'Find great deals on refurbished electronics or sell your old devices to give them a second life.',
      color: 'text-blue-600'
    },
    {
      icon: QrCode,
      title: 'QR Code Tracking',
      description: 'Track your e-waste journey from pickup to recycling with our advanced QR code system.',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'NGO Partnership',
      description: 'Connect with certified NGOs and recyclers for responsible e-waste disposal.',
      color: 'text-orange-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Devices Recycled' },
    { number: '500+', label: 'Happy Users' },
    { number: '50+', label: 'Partner NGOs' },
    { number: '95%', label: 'Recycling Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Give Your E-Waste a
              <span className="text-green-200"> Second Life</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Join the circular economy. Recycle your electronic waste responsibly and buy/sell refurbished devices in our sustainable marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/marketplace"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/api/pickup/new"
                    className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                  >
                    Schedule Pickup
                  </Link>
                  <Link
                    to="/marketplace"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                  >
                    Browse Marketplace
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoCycle?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make e-waste recycling simple, transparent, and beneficial for everyone involved.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to contribute to a sustainable future
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Schedule Pickup
              </h3>
              <p className="text-gray-600">
                Fill out our simple form with your device details and preferred pickup time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get QR Code
              </h3>
              <p className="text-gray-600">
                Receive a unique QR code to track your device through the recycling process.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Track & Recycle
              </h3>
              <p className="text-gray-600">
                Monitor your device's journey and ensure responsible recycling by certified partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recycling Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ♻️ How to Apply the 3 R's in Daily Life
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn practical ways to reduce, reuse, and recycle in your everyday routine
            </p>
          </div>

          {/* 3 R's Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Reduce */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-3">
                  <Trash2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">✅ Reduce</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Carry a cloth bag instead of using plastic bags</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Buy products with less packaging</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Avoid single-use items like plastic straws and paper cups</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use digital receipts instead of printed ones</span>
                </li>
              </ul>
            </div>

            {/* Reuse */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-3">
                  <Recycle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">♻️ Reuse</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use old containers to store items or organize drawers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Reuse glass bottles as flower vases or water bottles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Turn old t-shirts into cleaning cloths</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Save gift bags, wrapping paper, and jars for later use</span>
                </li>
              </ul>
            </div>

            {/* Recycle */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-3">
                  <Recycle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">🔄 Recycle</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Separate dry waste (paper, plastic, glass) and give it to recyclers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Recycle electronic items at proper e-waste drop-off centers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use recycled paper for printing</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Composting Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">🥦 Composting: Use Vegetable Peels to Make Fertilizer</h3>
              <p className="text-gray-600">Don't throw vegetable peels away — turn them into natural fertilizer!</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Items to Compost:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Vegetable peels (potato, carrot, cucumber, etc.)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fruit scraps (banana, apple, mango skins)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Tea leaves and coffee grounds</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Eggshells</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">How to Make Compost:</h4>
                <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                  <li>Collect your peels and organic kitchen waste in a bin</li>
                  <li>Add dry waste like leaves or paper once in a while</li>
                  <li>Mix it once every 3-4 days</li>
                  <li>Keep the compost slightly moist — not too wet</li>
                  <li>After 3–4 weeks, the waste breaks down into rich compost for your plants</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Waste Segregation Guide */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🚮 Waste Segregation Guide</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Type</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Examples</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Disposal Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="inline-flex items-center">
                        <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                        Wet Waste
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">Food scraps, veggie peels, tea leaves</td>
                    <td className="border border-gray-300 px-4 py-3">Compost at home or in wet bin</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="inline-flex items-center">
                        <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                        Dry Waste
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">Plastic, paper, cans, cloth, packaging</td>
                    <td className="border border-gray-300 px-4 py-3">Recycle or dry bin</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="inline-flex items-center">
                        <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                        Hazardous
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">Batteries, electronics, paint, chemicals</td>
                    <td className="border border-gray-300 px-4 py-3">E-waste center or red bin</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <span className="inline-flex items-center">
                        <span className="w-4 h-4 bg-gray-500 rounded-full mr-2"></span>
                        Others
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">Sanitary waste, diapers</td>
                    <td className="border border-gray-300 px-4 py-3">Wrapped & labeled as non-recyclable</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Tips:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Do not mix wet and dry waste</li>
                <li>• Label hazardous waste clearly</li>
                <li>• Rinse containers before recycling</li>
              </ul>
            </div>
          </div>

          {/* Quick Do's and Don'ts */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                Quick Do's
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use both sides of paper before recycling</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Carry your own water bottle and bag</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Educate others around you</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <XCircle className="h-6 w-6 text-red-500 mr-2" />
                Quick Don'ts
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Burn waste (especially plastic or rubber)</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Mix recyclables with food waste</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Throw e-waste in the general bin</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of users who are already contributing to a sustainable future through responsible e-waste management.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
            >
              Join EcoCycle Today
            </Link>
          ) : (
            <Link
              to="/api/pickup/new"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-block"
            >
              Schedule Your First Pickup
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 