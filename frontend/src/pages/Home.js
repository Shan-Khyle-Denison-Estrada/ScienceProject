import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)] font-switzal overflow-y-auto pb-24">
      
      {/* HEADER PANEL */}
      <div className="relative bg-primary w-full pb-16 pt-8 rounded-b-[4rem] shadow-lg">
        <div className="flex flex-col justify-center items-center">
            {/* Logo & Title */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/10 rounded-full p-2">
                    <img 
                        src="/Vector-White.svg" 
                        alt="Logo" 
                        className="w-full h-full object-contain" 
                    />
                </div>
                <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wide">
                    VisionCheck
                </h1>
            </div>
            
            <p className="text-center text-white/90 text-lg md:text-2xl font-light px-6 max-w-2xl">
                Eye Health is Wealth. Check your Vision today.
            </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        
        {/* HERO CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img 
                    src="/hero-image.png" 
                    alt="Vision Check Hero" 
                    className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-6">
                    <p className="text-white text-2xl md:text-3xl font-bold text-center px-4">
                        Scan Now for Instant Results
                    </p>
                </div>
            </div>
        </div>

        {/* EXPLORE SECTION */}
        <div className="space-y-4"> 
            <div className="flex items-center gap-4">
            <div className="flex-1 h-[2px] bg-gray-300 rounded-full"></div>
            <span className="text-gray-400 font-medium uppercase tracking-wider text-sm">Explore More</span>
            <div className="flex-1 h-[2px] bg-gray-300 rounded-full"></div>
            </div>

            <Link to="/about" className="block group">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98] flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">About Us</span>
                    <span className="text-gray-500 text-sm mt-1">Learn more about the team and mission</span>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>
            </Link>
        </div>
      </div>
      
    </div>
  );
}

export default Home;