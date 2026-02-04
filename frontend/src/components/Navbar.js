import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoHome, IoPeople } from 'react-icons/io5';

const Icon = ({ name, active }) => {
  const colorClass = active ? "text-primary" : "text-gray-400";
  
  const IconComponent = {
    home: IoHome,
    people: IoPeople
  }[name];

  return <IconComponent className={`text-2xl mb-1 ${colorClass} transition-colors duration-200`} />;
};

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white h-[80px] shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] flex justify-between items-center px-8 md:px-20 z-50 rounded-t-2xl">
      
      {/* 1. Home */}
      <Link to="/" className="flex flex-col items-center w-20 group">
        <Icon name="home" active={isActive('/')} />
        <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>Home</span>
      </Link>

      {/* 3. CENTER ACTION BUTTON (Floating) */}
      <div className="relative -top-8">
        <Link to="/action">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg p-1.5">
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center shadow-inner hover:bg-primary/90 transition-colors transform hover:scale-105 active:scale-95 duration-200">
                  <img 
                    src="/Vector-White.svg" 
                    alt="Scan" 
                    className="w-8 h-8 object-contain" 
                  />
                </div>
            </div>
        </Link>
      </div>

      {/* 5. About Us */}
      <Link to="/about" className="flex flex-col items-center w-20 group">
        <Icon name="people" active={isActive('/about')} />
        <span className={`text-[10px] font-bold uppercase tracking-wide transition-colors ${isActive('/about') ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`}>About</span>
      </Link>
    </div>
  );
}

export default Navbar;