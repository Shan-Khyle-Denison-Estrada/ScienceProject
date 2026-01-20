import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Results from './pages/Results';
import Learn from './pages/Learn';
import About from './pages/About';
import Action from './pages/Action'; // 1. Import the new page

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/about" element={<About />} />
        
        {/* 2. Use the component here */}
        <Route path="/action" element={<Action />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;