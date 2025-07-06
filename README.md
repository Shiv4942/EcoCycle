# EcoCycle - E-Waste Management Platform

A comprehensive MERN stack application for managing e-waste pickup, recycling, and marketplace functionality with QR code tracking and role-based access control.

## 🌟 Features

### 🚀 Core Features
- **E-Waste Pickup Scheduling**: Schedule convenient pickups for electronic waste
- **Buy/Sell Marketplace**: List and purchase refurbished electronics
- **QR Code Tracking**: Track e-waste journey from pickup to recycling
- **NGO/Recycler Portal**: Role-based dashboard for different user types
- **User Authentication**: Secure JWT-based authentication system

### 👥 User Roles
- **Individual Users**: Schedule pickups, buy/sell products
- **NGOs/Recyclers**: Manage assigned pickups, update status
- **Admins**: Full system management and oversight

### 📱 Key Functionalities
- Responsive design for mobile and desktop
- Real-time status updates
- QR code generation and scanning
- Advanced filtering and search
- Role-based access control
- Modern UI with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **qrcode** for QR code generation
- **multer** for file uploads

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Axios** for API calls

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoCycle
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecocycle
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
EcoCycle/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS and styling
│   └── public/             # Static assets
├── server/                 # Backend Node.js application
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── index.js            # Server entry point
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Pickup Management
- `POST /api/pickup` - Create pickup request
- `GET /api/pickup/my-pickups` - Get user's pickups
- `GET /api/pickup` - Get all pickups (admin/ngo)
- `PATCH /api/pickup/:id/status` - Update pickup status
- `GET /api/pickup/:id/qr` - Get QR code for pickup
- `POST /api/pickup/scan` - Scan QR code

### Marketplace
- `POST /api/products` - Create product listing
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🎯 Usage Guide

### For Individual Users
1. **Register/Login** to your account
2. **Schedule Pickup** by filling the pickup form
3. **Browse Marketplace** to buy/sell electronics
4. **Track Pickups** using QR codes
5. **Manage Profile** and view pickup history

### For NGOs/Recyclers
1. **Login** with NGO credentials
2. **View Assigned Pickups** in the dashboard
3. **Update Pickup Status** as you process items
4. **Scan QR Codes** to verify pickups
5. **Manage Organization** details

### For Admins
1. **Access Admin Dashboard** with full system overview
2. **Manage All Pickups** across the platform
3. **Assign Pickups** to NGOs/recyclers
4. **Monitor System** statistics and performance
5. **User Management** capabilities

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern, clean interface
- Intuitive navigation
- Real-time notifications
- Loading states and error handling
- Accessible design patterns

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Update API base URL
2. Build the application: `npm run build`
3. Deploy to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- Mobile app development
- Advanced analytics dashboard
- Integration with recycling centers
- Blockchain for transparency
- AI-powered device assessment
- Multi-language support

---

**EcoCycle** - Making e-waste management simple, transparent, and sustainable! 🌱 