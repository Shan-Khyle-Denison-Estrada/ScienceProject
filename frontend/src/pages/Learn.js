import React from 'react';

const LearnItem = ({ title }) => (
  <div className="bg-white h-24 rounded-lg shadow-sm flex items-center justify-between px-6 mb-4 cursor-pointer hover:bg-gray-50 transition">
    <span className="font-bold text-2xl text-gray-800">{title}</span>
    {/* SVG Arrow built with Tailwind divs for simplicity, or use an actual SVG */}
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0BB08B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
  </div>
);

function Learn() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-24 font-switzal">
       <h1 className="text-2xl font-bold mb-6 text-center">Learning Center</h1>
       <LearnItem title="Common Refractive Errors" />
       <LearnItem title="Eye Care 101" />
       <LearnItem title="Eccentric Photorefraction" />
    </div>
  );
}

export default Learn;