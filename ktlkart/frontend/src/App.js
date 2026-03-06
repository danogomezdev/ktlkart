import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/proyectos" element={<Projects />} />
                    <Route path="/proyectos/:slug" element={<ProjectDetail />} />
                    <Route path="/servicios" element={<Services />} />
                    <Route path="/contacto" element={<Contact />} />
                  </Routes>
                </main>
                <Footer />
                <WhatsAppButton />
              </>
            } />
          </Routes>
          <ToastContainer position="top-right" autoClose={4000} theme="dark" />
        </BrowserRouter>
      </LangProvider>
    </AuthProvider>
  );
}
