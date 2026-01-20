import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const Action = () => {
  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({ fullName: '', age: '', sex: '' });
  
  // Camera & Tracking Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureData, setCaptureData] = useState(null); // Stores cropped eyes
  const [showModal, setShowModal] = useState(false);
  
  const [error, setError] = useState('');

  // 1. Load Face-API Models on Mount
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // Assumes models are in public/models
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log("FaceAPI Models Loaded");
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Error loading AI models. Please ensure /public/models folder exists.");
      }
    };
    loadModels();
  }, []);

  // --- Form Handlers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSexSelect = (value) => setFormData({ ...formData, sex: value });

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
    let stream = null;
    if (step === 'camera' && modelsLoaded) {
      startCamera().then(s => stream = s);
    }
    return () => {
      // Cleanup: Stop camera and tracking intervals
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [step, modelsLoaded]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      setError("Could not access camera.");
    }
  };

  // --- Face Tracking Loop ---
  const handleVideoOnPlay = () => {
    // Run detection loop every 100ms
    setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Ensure canvas matches video size
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);

        // Detect Face
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        
        // Resize detections to match display
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear and Draw Tracking Box
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Uncomment to see dots
      }
    }, 100);
  };

  // --- Capture & Crop Logic ---
  const handleCapture = async () => {
    if (!videoRef.current) return;

    // Detect face one last time for high-res landmarks
    const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detections) {
      alert("No face detected! Please look at the camera.");
      return;
    }

    // Helper to crop eye
    const cropEye = (landmarks, part) => {
      const points = part === 'left' ? landmarks.getLeftEye() : landmarks.getRightEye();
      
      // Get bounding box of the eye points
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      
      const width = maxX - minX;
      const height = maxY - minY;
      const centerX = minX + width / 2;
      const centerY = minY + height / 2;

      // Create a square crop box (2x the eye width for context)
      const size = Math.max(width, height) * 2.5; 

      // Draw to temp canvas
      const canvas = document.createElement('canvas');
      canvas.width = 40; // Target Size
      canvas.height = 40; // Target Size
      const ctx = canvas.getContext('2d');

      // drawImage(source, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH)
      ctx.drawImage(
        videoRef.current,
        centerX - size / 2, centerY - size / 2, size, size, // Source Crop
        0, 0, 40, 40 // Dest Resize
      );

      return canvas.toDataURL('image/png');
    };

    const leftEyeImg = cropEye(detections.landmarks, 'left');
    const rightEyeImg = cropEye(detections.landmarks, 'right');

    setCaptureData({ leftEye: leftEyeImg, rightEye: rightEyeImg });
    setShowModal(true);
  };

  // --- Render ---
  return (
    <div className="min-h-screen p-6">
      
      {/* STEP 1: FORM (Hidden during camera) */}
      {step === 'form' && (
        <div className="max-w-lg mx-auto mt-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Start Action</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                placeholder="Enter full name" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                placeholder="Enter age" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-3">Sex</label>
              <div className="flex gap-4">
                {['Male', 'Female'].map(s => (
                  <button key={s} type="button" onClick={() => handleSexSelect(s)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.sex === s ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-500'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit"
              className="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 mt-6">
              Open Camera
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: CAMERA OVERLAY */}
      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          
          {/* Back Arrow */}
          <button onClick={() => setStep('form')}
             className="absolute top-6 left-6 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
             </svg>
          </button>

          {/* Loading State for Models */}
          {!modelsLoaded && <div className="absolute z-30 text-white bg-black/50 px-4 py-2 rounded">Loading Face Tracking...</div>}

          {/* Video Container (Relative for Canvas positioning) */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {error ? <div className="text-red-500 bg-white p-4 rounded">{error}</div> : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onPlay={handleVideoOnPlay}
                  className="absolute w-full h-full object-cover"
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute w-full h-full object-cover pointer-events-none" 
                />
              </>
            )}
          </div>

          {/* Capture Button */}
          <div className="absolute bottom-10 flex justify-center w-full z-20">
             <button 
                onClick={handleCapture}
                className="bg-white w-20 h-20 rounded-full border-4 border-gray-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
             >
                <div className="w-16 h-16 bg-white border-2 border-black rounded-full"></div>
             </button>
          </div>
        </div>
      )}

      {/* MODAL - Displays 40x40 Cropped Eyes */}
      {showModal && captureData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Eyes Captured</h3>
            
            <div className="flex justify-center gap-8 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Left Eye (40x40)</span>
                <img src={captureData.leftEye} alt="Left" className="w-[40px] h-[40px] border border-gray-300 rounded shadow-sm bg-gray-100" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">Right Eye (40x40)</span>
                <img src={captureData.rightEye} alt="Right" className="w-[40px] h-[40px] border border-gray-300 rounded shadow-sm bg-gray-100" />
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Images processed successfully. <br/> No records saved yet.
            </p>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Close / Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Action;