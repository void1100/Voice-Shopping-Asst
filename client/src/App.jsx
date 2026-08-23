import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import List from './pages/List';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-gray-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/list" element={
                <ProtectedRoute><List /></ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
          <ToastContainer
            position="bottom-right"
            theme="colored"
            autoClose={3000}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
