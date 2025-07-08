import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PickupForm from './pages/PickupForm';
import PickupList from './pages/PickupList';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import AddProduct from './pages/AddProduct';
import QRScanner from './pages/QRScanner';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminDashboard from './pages/AdminDashboard';
import QRCodeDisplay from './pages/QRCodeDisplay';
import SoldProducts from './pages/SoldProducts';
import MyProducts from './pages/MyProducts';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin Dashboard */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/api/pickup/new" element={
                <ProtectedRoute>
                  <PickupForm />
                </ProtectedRoute>
              } />
              <Route path="/api/pickup/my-pickups" element={
                <ProtectedRoute>
                  <PickupList />
                </ProtectedRoute>
              } />
              <Route path="/api/pickup/:id/qr" element={
                <ProtectedRoute>
                  <QRCodeDisplay />
                </ProtectedRoute>
              } />
              <Route path="/products/add" element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              } />
              <Route path="/qr-scanner" element={
                <ProtectedRoute allowedRoles={['admin', 'ngo']}>
                  <QRScanner />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin/NGO Routes */}
              <Route path="/admin/pickups" element={
                <ProtectedRoute allowedRoles={['admin', 'ngo']}>
                  <PickupList />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/products/sold" element={
                <ProtectedRoute>
                  <SoldProducts />
                </ProtectedRoute>
              } />
              <Route path="/products/my-products" element={
                <ProtectedRoute>
                  <MyProducts />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
