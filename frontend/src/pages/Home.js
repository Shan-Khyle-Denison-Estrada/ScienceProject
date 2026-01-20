import React from 'react';
import { Link } from 'react-router-dom';
// Removed unused Link import to fix warning

function Home() {
  return (
    <div className="bg-gray-100 h-[calc(100vh-80px)] font-switzal overflow-x-hidden">
      
      {/* HEADER PANEL */}
      <div className="relative h-[20%] bg-transparent overflow-hidden w-full">
        {/* Giant Circle for Curve Effect */}
        <div className="absolute bg-primary rounded-full" 
             style={{
               width: '400%',
               height: '1500px',
               top: '-1350px',
               left: '-150%'
             }}>
        </div>
        
        <div className="absolute inset-0 flex justify-center items-center -mt-3 -ml-4">
            {/* 1. Logo Container (Left) */}
            <div className="w-24 aspect-square flex items-center justify-center">
                <img 
                    src="/Vector-White.svg" 
                    alt="Logo" 
                    className="w-24 aspect-square object-contain" 
                />
            </div>

            {/* 2. Text (Right) */}
            <h1 className="text-white text-5xl -ml-4 -mb-4">
                VisionCheck
            </h1>
        </div>
      </div>

      <div className="h-[10%] justify-center items-center flex">
        <p className="text-center text-[40px] leading-8 text-primary">Check your Vision with VisionCheck</p>
      </div>

      <div className="p-1 mx-4 h-[30%] bg-primary rounded-xl">
        {/* BACKGROUND IMAGE FIX HERE */}
        {/* 1. Wrapper: Handles size, rounding, and clips the zoomed image */}
        <div className="w-full h-[75%] bg-white rounded-lg overflow-hidden relative">
            {/* 2. Image: object-cover fills the space, scale-125 zooms it in */}
            <img 
                src="/hero-image.png" 
                alt="Vision Check Hero" 
                className="w-full h-full object-cover scale-125" 
            />
        </div>

        <div className="flex justify-center items-center h-[25%]">
          <p className="text-center text-white text-3xl">Eye Health is Wealth. Scan Now!</p>
        </div>
      </div>

      <div className="h-[40%] px-4 py-2"> 
        <div className="flex items-center mt-2">
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <span className="px-4 text-gray-300">Explore More</span>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
        <Link to="/results" className="rounded-lg bg-white">
          <div className="bg-white rounded-lg active:scale-95 transition-transform h-[20%] flex justify-center items-center mt-4">
              <span className="text-2xl text-center">Check Past Results</span>
          </div>
        </Link>
        <Link to="/learn" className="rounded-lg bg-white">
          <div className="bg-white rounded-lg active:scale-95 transition-transform h-[20%] flex justify-center items-center mt-4">
              <span className="text-2xl text-center">Learn New Things</span>
          </div>
        </Link>
        <Link to="/about" className="rounded-lg bg-white">
          <div className="bg-white rounded-lg active:scale-95 transition-transform h-[20%] flex justify-center items-center mt-4">
              <span className="text-2xl text-center">Know More About Us</span>
          </div>
        </Link>
      </div>
      
    </div>
  );
}

export default Home;