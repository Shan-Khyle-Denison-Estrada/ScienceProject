import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Importing Ionicons to match the React Native _layout.tsx
import { IoHome, IoStatsChart, IoGrid, IoPeople } from 'react-icons/io5';

const Icon = ({ name, active }) => {
  const colorClass = active ? "text-primary" : "text-gray-400";
  
  // Mapping the names to the specific Ionicons components
  const IconComponent = {
    home: IoHome,        // Matches Ionicons "home"
    stats: IoStatsChart, // Matches Ionicons "stats-chart"
    grid: IoGrid,        // Matches Ionicons "grid"
    people: IoPeople     // Matches Ionicons "people"
  }[name];

  // Render the icon with the mapped classes
  return <IconComponent className={`text-2xl ${colorClass}`} />;
};

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    // Fixed container at the bottom
    <div className="fixed bottom-0 left-0 right-0 bg-white h-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-around items-end pb-4 z-50">
      
      {/* 1. Home */}
      <Link to="/" className="flex flex-col items-center w-16">
        <Icon name="home" active={isActive('/')} />
        <span className={`text-xs mt-1 ${isActive('/') ? 'text-primary font-bold' : 'text-gray-400'}`}>Home</span>
      </Link>

      {/* 2. Results */}
      {/* <Link to="/results" className="flex flex-col items-center w-16">
        <Icon name="stats" active={isActive('/results')} />
        <span className={`text-xs mt-1 ${isActive('/results') ? 'text-primary font-bold' : 'text-gray-400'}`}>Results</span>
      </Link> */}

      {/* 3. CENTER ACTION BUTTON (Floating) */}
      <div className="relative -top-2">
        <Link to="/action">
            {/* Outer White Circle */}
            <div className="w-28 aspect-square bg-white rounded-full flex items-center justify-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                {/* Inner Green Circle */}
                <div className="w-20 aspect-square bg-primary rounded-full flex items-center justify-center shadow-md text-white font-bold">
                    {/* Placeholder for Logo - You can import your SVG here as well */}
                  <img 
                    src="/Vector-White.svg" 
                    alt="Logo" 
                    className="w-12 aspect-square object-contain" 
                  />
                </div>
            </div>
        </Link>
      </div>

      {/* 4. Learn */}
      {/* <Link to="/learn" className="flex flex-col items-center w-16">
        <Icon name="grid" active={isActive('/learn')} />
        <span className={`text-xs mt-1 ${isActive('/learn') ? 'text-primary font-bold' : 'text-gray-400'}`}>Learn</span>
      </Link> */}

      {/* 5. About Us */}
      <Link to="/about" className="flex flex-col items-center w-16">
        <Icon name="people" active={isActive('/about')} />
        <span className={`text-xs mt-1 ${isActive('/about') ? 'text-primary font-bold' : 'text-gray-400'}`}>About Us</span>
      </Link>
    </div>
  );
}

export default Navbar;