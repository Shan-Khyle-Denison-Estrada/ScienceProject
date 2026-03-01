import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultDetailed() {
  const navigate = useNavigate();
  const location = useLocation();

  // Safely extract data passed from Action.js
  const { captureData, formData, diagnosis } = location.state || {
    captureData: { leftEye: null, rightEye: null },
    formData: { fullName: 'Unknown', age: '-', sex: '-' },
    diagnosis: { 
        left_diagnosis: 'Unknown', left_confidence: 0, 
        right_diagnosis: 'Unknown', right_confidence: 0 
    }
  };

  // Helper to determine text color based on diagnosis
  const getStatusColor = (status) => {
    return status === 'Normal' ? 'text-green-500' : 'text-red-500';
  };

  // Helper to format the confidence decimal into a percentage
  const formatConfidence = (conf) => {
    if (!conf) return '';
    return `Confidence: ${(conf * 100).toFixed(1)}%`;
  };

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

        {/* --- MAIN CONTENT ROW --- */}
        <div className="flex flex-row h-[40%] p-2 gap-2">
            
            {/* LEFT EYE CARD */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg px-2 shadow-sm">
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-4xl font-bold text-gray-700">LEFT EYE</p>
                </div>
                
                {/* Left Eye Image */}
                <div className="flex-[4] w-full flex justify-center items-center rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    {captureData.leftEye ? (
                        <img src={captureData.leftEye} className="h-full w-full object-contain" alt="Left Eye" />
                    ) : (
                        <span className="text-gray-400">No Image</span>
                    )}
                </div>

                {/* Left Eye Result & Confidence */}
                <div className="flex-1 flex flex-col justify-center items-center mt-2">
                    <p className={`text-4xl md:text-5xl font-bold ${getStatusColor(diagnosis.left_diagnosis)}`}>
                        {diagnosis.left_diagnosis.toUpperCase()}
                    </p>
                    {diagnosis.left_confidence > 0 && (
                        <p className="text-gray-500 text-sm md:text-base font-semibold">
                            {formatConfidence(diagnosis.left_confidence)}
                        </p>
                    )}
                </div>
            </div>

            {/* RIGHT EYE CARD */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-lg px-2 shadow-sm">
                <div className="flex-1 flex justify-center items-center">
                    <p className="text-4xl font-bold text-gray-700">RIGHT EYE</p>
                </div>

                {/* Right Eye Image */}
                <div className="flex-[4] w-full flex justify-center items-center rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                    {captureData.rightEye ? (
                        <img src={captureData.rightEye} className="h-full w-full object-contain" alt="Right Eye" />
                    ) : (
                        <span className="text-gray-400">No Image</span>
                    )}
                </div>

                {/* Right Eye Result & Confidence */}
                <div className="flex-1 flex flex-col justify-center items-center mt-2">
                    <p className={`text-4xl md:text-5xl font-bold ${getStatusColor(diagnosis.right_diagnosis)}`}>
                        {diagnosis.right_diagnosis.toUpperCase()}
                    </p>
                    {diagnosis.right_confidence > 0 && (
                        <p className="text-gray-500 text-sm md:text-base font-semibold">
                            {formatConfidence(diagnosis.right_confidence)}
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* --- DETAILS & ACTION ROW --- */}
        <div className="flex flex-col h-[32%] px-2 gap-2 mt-2">
            
            {/* Full Name */}
            <div className="bg-white rounded-lg h-full flex items-center px-6 shadow-sm">
                <span className="text-gray-500 font-bold w-24">Name:</span>
                <span className="text-2xl font-bold text-gray-800">{formData.fullName}</span>
            </div>

            {/* Age */}
            <div className="bg-white rounded-lg h-full flex items-center px-6 shadow-sm">
                <span className="text-gray-500 font-bold w-24">Age:</span>
                <span className="text-2xl font-bold text-gray-800">{formData.age} Years Old</span>
            </div>

            {/* Sex */}
            <div className="bg-white rounded-lg h-full flex items-center px-6 shadow-sm">
                <span className="text-gray-500 font-bold w-24">Sex:</span>
                <span className="text-2xl font-bold text-gray-800">{formData.sex}</span>
            </div>

            {/* Done Button */}
            <button 
                onClick={() => navigate('/')}
                className="bg-gray-900 text-white rounded-lg h-full flex justify-center items-center text-3xl font-bold active:scale-95 transition-transform shadow-lg"
            >
                Done
            </button>
        </div>
    </div>
  );
}

export default ResultDetailed;