import React, { useState, useRef, useEffect } from 'react';

const Action = () => {
  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    sex: '' 
  });
  
  const videoRef = useRef(null);
  const [error, setError] = useState('');

  // Handle Text Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Sex Selection (Button Click)
  const handleSexSelect = (value) => {
    setFormData({ ...formData, sex: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.age || !formData.sex) {
      alert("Please fill in all fields");
      return;
    }
    setStep('camera');
  };

  // --- Camera Logic ---
  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen p-6">
      
      {/* --- STEP 1: FORM --- */}
      {step === 'form' && (
        <div className="max-w-lg mx-auto mt-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Start Action</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                placeholder="Enter full name"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                placeholder="Enter age"
              />
            </div>

            {/* Sex - Pretty Toggle Buttons */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">Sex</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSexSelect('Male')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                    formData.sex === 'Male'
                      ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-green-200'
                  }`}
                >
                  Male
                </button>

                <button
                  type="button"
                  onClick={() => handleSexSelect('Female')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
                    formData.sex === 'Female'
                      ? 'border-green-600 bg-green-50 text-green-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-green-200'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition duration-300 mt-6 shadow-lg shadow-green-200"
            >
              Open Camera
            </button>
          </form>
        </div>
      )}

      {/* --- STEP 2: CAMERA OVERLAY --- */}
      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          
          {/* Back Arrow - Top Left */}
          <button 
             onClick={() => setStep('form')}
             className="absolute top-6 left-6 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition"
          >
             {/* SVG Arrow Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
             </svg>
          </button>

          {error ? (
             <div className="text-red-500 bg-white p-4 rounded z-10">{error}</div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}

          {/* Bottom Control Area - Only Capture Button */}
          <div className="absolute bottom-10 flex justify-center w-full z-20">
             <button 
                className="bg-white w-20 h-20 rounded-full border-4 border-gray-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                onClick={() => alert("Capture Logic Here")}
             >
                <div className="w-16 h-16 bg-white border-2 border-black rounded-full"></div>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Action;