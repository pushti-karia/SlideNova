import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import PresentationDetail from './pages/PresentationDetail';
import './styles/global.css';
import './styles/components.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/presentation/:id" element={<PresentationDetail />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
            fontSize: '0.88rem',
          },
        }}
      />
    </BrowserRouter>
  );
}
