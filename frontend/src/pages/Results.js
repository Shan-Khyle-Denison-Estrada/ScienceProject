import React from 'react';

// Reusable Result Card Component
const ResultCard = ({ status }) => {
  // Color Logic
  const isNormal = status === 'Normal';
  const bgColor = isNormal ? 'bg-green-500' : 'bg-red-500';
  const label = isNormal ? 'Normal' : 'Myopia';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* Card Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <span className="font-bold text-lg flex-1 text-center">Shan Khyle D. Estrada</span>
        <span className="text-gray-500 text-sm flex-1 text-center">Jan 20, 2026 | 12:06 PM</span>
      </div>

      {/* Card Body (Split View) */}
      <div className="flex h-40 gap-1 p-2">
        {/* Left Eye */}
        <div className={`flex-1 ${bgColor} rounded-l text-white flex items-center justify-center relative overflow-hidden`}>
            <span className="text-3xl font-bold z-10">{label}</span>
            {/* Background Big Letter */}
            <span className="absolute text-[10rem] font-bold opacity-20 leading-none select-none">L</span>
        </div>

        {/* Right Eye */}
        <div className={`flex-1 ${bgColor} rounded-r text-white flex items-center justify-center relative overflow-hidden`}>
            <span className="text-3xl font-bold z-10">{label}</span>
             {/* Background Big Letter */}
            <span className="absolute text-[10rem] font-bold opacity-20 leading-none select-none">R</span>
        </div>
      </div>
    </div>
  );
};

function Results() {
  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-24 font-switzal">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Results</h1>
      <ResultCard status="Normal" />
      <ResultCard status="Myopia" />
    </div>
  );
}

export default Results;