import React from 'react';

function Results() {
  return (
    <div className="bg-gray-100 h-[calc(100vh-80px)] overflow-x-hidden p-4 flex flex-col gap-4">
      <div className="bg-white h-[20%] rounded-lg flex flex-col overflow-clip">
        <div className="flex-1 p-2 flex flex-row items-center">
          <p className="flex-1 text-center font-semibold text-md">Shan Khyle Estrada</p>
          <p className="flex-1 text-center text-sm">01/21/26 | 1:16 AM</p>
        </div>
        <div className="flex-[4] flex flex-row gap-2">
          <div className="flex-1 bg-green-700 flex justify-center items-center relative overflow-hidden">
            {/* Background "L" */}
            <span className="absolute text-[6rem] font-bold text-white opacity-10 pointer-events-none -mt-4">
              L
            </span>
            {/* Foreground Text */}
            <p className="relative z-10 text-center font-bold text-4xl text-white">
              Normal
            </p>
          </div>
          <div className="flex-1 bg-green-700 flex justify-center items-center relative overflow-hidden">
            {/* Background "R" */}
            <span className="absolute text-[6rem] font-bold text-white opacity-10 pointer-events-none -mt-4">
              R
            </span>
            {/* Foreground Text */}
            <p className="relative z-10 text-center font-bold text-4xl text-white">
              Normal
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white h-[20%] rounded-lg flex flex-col overflow-clip">
        <div className="flex-1 p-2 flex flex-row items-center">
          <p className="flex-1 text-center font-semibold text-md">Shan Khyle Estrada</p>
          <p className="flex-1 text-center text-sm">01/21/26 | 1:16 AM</p>
        </div>
        <div className="flex-[4] flex flex-row gap-2">
          <div className="flex-1 bg-red-700 flex justify-center items-center relative overflow-hidden">
            {/* Background "L" */}
            <span className="absolute text-[6rem] font-bold text-white opacity-10 pointer-events-none -mt-4">
              L
            </span>
            {/* Foreground Text */}
            <p className="relative z-10 text-center font-bold text-4xl text-white">
              Myopia
            </p>
          </div>
          <div className="flex-1 bg-red-700 flex justify-center items-center relative overflow-hidden">
            {/* Background "R" */}
            <span className="absolute text-[6rem] font-bold text-white opacity-10 pointer-events-none -mt-4">
              R
            </span>
            {/* Foreground Text */}
            <p className="relative z-10 text-center font-bold text-4xl text-white">
              Myopia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;