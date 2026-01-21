import React from 'react';


function ResultDetailed() {
  return (
    <div className="bg-gray-100 h-[calc(100vh-80px)] font-switzal overflow-x-hidden">
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
        <div className="flex flex-row h-[40%] p-2 gap-2">
            <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg px-2">
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-4xl">LEFT EYE</p>
                </div>
                <div className="flex-[4] w-full flex justify-center items-center rounded-lg bg-primary">
                    Image Container
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-6xl font-bold text-red-500">MYOPIA</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg px-2">
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-4xl">RIGHT EYE</p>
                </div>
                <div className="flex-[4] w-full flex justify-center items-center rounded-lg bg-primary">
                    Image Container
                </div>
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-6xl font-bold text-green-500">NORMAL</p>
                </div>
            </div>
        </div>
        <div className="flex flex-col h-[32%] outline outline-red-900 px-2 gap-2">
            <div className="bg-white rounded-lg h-full flex justify-center items-center">
                Name Placeholder
            </div>
            <div className="bg-white rounded-lg h-full flex justify-center items-center">
                Name Placeholder
            </div>
            <div className="bg-white rounded-lg h-full flex justify-center items-center">
                Name Placeholder
            </div>
            <div className="bg-white rounded-lg h-full flex justify-center items-center">
                Done Button
            </div>
        </div>
    </div>
  );
}

export default ResultDetailed;