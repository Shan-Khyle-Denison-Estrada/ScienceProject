import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import Learn from './pages/Learn';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar is outside Routes so it shows on every page */}
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/about" element={<About />} />
        {/* Placeholder for the Action/Camera page */}
        <Route path="/action" element={<div className="p-10 text-center">Camera/Action Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;