import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
// import * as faceapi from 'face-api.js';
// import * as faceapi from 'face-api.js/dist/face-api.js';

// Add this line to access the library loaded from the CDN
const faceapi = window.faceapi;

const Action = () => {
  const navigate = useNavigate(); // <--- Initialize Hook
  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({ fullName: '', age: '', sex: '' });
  
  // Camera & Tracking Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState('');

  // Flash & UI State
  const [hasFlash, setHasFlash] = useState(false);
  const [feedback, setFeedback] = useState("Initializing...");
  const [isReadyToCapture, setIsReadyToCapture] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); 
  const [isAnalyzing, setIsAnalyzing] = useState(false); // Loading state for API

  // Constants (1 Meter Distance)
  const TARGET_FACE_WIDTH_MIN = 85;  
  const TARGET_FACE_WIDTH_MAX = 165; 
  const MIN_BRIGHTNESS = 20; 
  const MAX_CENTER_OFFSET = 50; 
  const MIN_EYE_OPEN_RATIO = 0.25; 

  // 1. Load Face-API Models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; 
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error(err);
        setError("Error loading models. Ensure /public/models exists.");
      }
    };
    loadModels();
  }, []);

  // Form Handlers
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

  // Camera Lifecycle
  useEffect(() => {
    let stream = null;
    if (step === 'camera' && modelsLoaded) {
      startCamera().then(s => stream = s);
    }
    return () => {
      if (stream) {
        const track = stream.getVideoTracks()[0];
        if (track) {
           track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => {});
           track.stop();
        }
      }
    };
  }, [step, modelsLoaded]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) setHasFlash(true);

      return stream;
    } catch (err) {
      console.error(err);
      setError("Could not access camera. Ensure you are on HTTPS.");
    }
  };

  // --- API CALL & REDIRECT ---
  const sendToBackend = async (leftImage, rightImage) => {
    setIsAnalyzing(true);
    
    try {
      // NOTE: Update this IP to your specific laptop IP
      const API_URL = "https://khalix27-scienceproject.hf.space/predict"; 
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          left_eye: leftImage,
          right_eye: rightImage
        })
      });

      const result = await response.json();

      if (result.error) {
        alert("Server Error: " + result.error);
        setIsCapturing(false); // Allow retrying
      } else {
        // --- SUCCESS: REDIRECT TO RESULT PAGE ---
        navigate('/result-detailed', { 
          state: { 
            captureData: { leftEye: leftImage, rightEye: rightImage },
            formData: formData,
            diagnosis: result
          } 
        });
      }

    } catch (err) {
      console.error("Prediction failed", err);
      alert("Could not connect to server.");
      setIsCapturing(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Tracking Loop ---
  const handleVideoOnPlay = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || isCapturing) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detection) {
        const resized = faceapi.resizeResults(detection, displaySize);
        const { width, x } = resized.detection.box;
        const landmarks = resized.landmarks;

        new faceapi.draw.DrawBox(resized.detection.box, { label: 'Face', boxColor: isReadyToCapture ? 'green' : 'red' }).draw(canvas);

        let distanceStatus = 'OK';
        if (width < TARGET_FACE_WIDTH_MIN) distanceStatus = 'Too Far';
        else if (width > TARGET_FACE_WIDTH_MAX) distanceStatus = 'Too Close';

        const centerX = x + width / 2;
        const screenCenter = displaySize.width / 2;
        const isCentered = Math.abs(centerX - screenCenter) < MAX_CENTER_OFFSET;

        const getEyeRatio = (eyePoints) => {
            const d1 = Math.hypot(eyePoints[1].x - eyePoints[5].x, eyePoints[1].y - eyePoints[5].y);
            const d2 = Math.hypot(eyePoints[2].x - eyePoints[4].x, eyePoints[2].y - eyePoints[4].y);
            const width = Math.hypot(eyePoints[0].x - eyePoints[3].x, eyePoints[0].y - eyePoints[3].y);
            return (d1 + d2) / (2 * width);
        };
        const eyesOpen = getEyeRatio(landmarks.getLeftEye()) > MIN_EYE_OPEN_RATIO && getEyeRatio(landmarks.getRightEye()) > MIN_EYE_OPEN_RATIO;

        const checkBrightness = (v) => {
          const c = document.createElement('canvas');
          c.width = 50; c.height = 50; 
          const x = c.getContext('2d');
          x.drawImage(v, 0, 0, 50, 50);
          const d = x.getImageData(0, 0, 50, 50).data;
          let sum = 0;
          for (let i = 0; i < d.length; i += 4) sum += (d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114);
          return sum / (d.length / 4); 
        };
        const lightOk = checkBrightness(video) > MIN_BRIGHTNESS; 

        let msg = '';
        let ready = false;

        if (!lightOk) msg = "Too Dark";
        else if (distanceStatus !== 'OK') msg = distanceStatus;
        else if (!isCentered) msg = "Center Face";
        else if (!eyesOpen) msg = "Open Eyes";
        else {
          msg = "Perfect!";
          ready = true;
        }
        setFeedback(msg);
        setIsReadyToCapture(ready);
      } else {
        setFeedback("No Face");
        setIsReadyToCapture(false);
      }
    }, 200); 
    return () => clearInterval(interval);
  };

  // --- CAPTURE SEQUENCE ---
  const handleCapture = async () => {
    if (!isReadyToCapture || !videoRef.current || isCapturing) return;
    
    setIsCapturing(true); 
    const stream = videoRef.current.srcObject;
    const track = stream.getVideoTracks()[0];
    let flashEnabled = false;

    if (hasFlash) {
      try {
        await track.applyConstraints({ advanced: [{ torch: true }] });
        flashEnabled = true;
        await new Promise(resolve => setTimeout(resolve, 400));
      } catch (err) { console.warn("Flash failed", err); }
    }

    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    
    if (flashEnabled) {
      track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => {});
    }

    if (detection) {
      const cropEye = (landmarks, part) => {
        const points = part === 'left' ? landmarks.getLeftEye() : landmarks.getRightEye();
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
        const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
        const size = 50; 

        const canvas = document.createElement('canvas');
        canvas.width = 40; canvas.height = 40; 
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, centerX - size/2, centerY - size/2, size, size, 0, 0, 40, 40);
        return canvas.toDataURL('image/png');
      };

      const left = cropEye(detection.landmarks, 'left');
      const right = cropEye(detection.landmarks, 'right');
      
      // SEND TO BACKEND & REDIRECT
      sendToBackend(left, right);

    } else {
      alert("Face lost during flash! Try again.");
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      {step === 'form' && (
        <div className="max-w-lg mx-auto mt-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Start Action</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div><label className="block text-gray-700 font-bold mb-2">Full Name</label>
             <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border rounded" placeholder="Name" /></div>
             <div><label className="block text-gray-700 font-bold mb-2">Age</label>
             <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded" placeholder="Age" /></div>
             <div className="flex gap-4">
                {['Male','Female'].map(s => (
                  <button key={s} type="button" onClick={() => handleSexSelect(s)} 
                    className={`flex-1 py-3 border rounded-xl ${formData.sex === s ? 'bg-green-100 border-green-600' : 'bg-white'}`}>{s}</button>
                ))}
             </div>
             <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl mt-4">Open Camera</button>
          </form>
        </div>
      )}

      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <button onClick={() => setStep('form')} className="absolute top-6 left-6 z-20 text-white p-2 bg-black/30 rounded-full">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>

          {hasFlash && (
            <div className="absolute top-6 right-6 z-20 bg-yellow-500/90 text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm border border-yellow-400">
               ⚠️ Warning: Flash will activate
            </div>
          )}

          {/* LOADING OVERLAY */}
          {isAnalyzing && (
            <div className="absolute inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4 font-bold text-lg">Analyzing Eyes...</p>
            </div>
          )}

          <div className={`absolute top-20 px-6 py-2 rounded-full z-20 font-bold shadow-lg transition-colors duration-300 ${isReadyToCapture ? 'bg-green-500 text-white' : 'bg-red-500/80 text-white'}`}>
             {isCapturing ? "Capturing..." : feedback}
          </div>

          <div className="relative w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden">
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-64 h-80 border-2 border-dashed border-white/50 rounded-[50%] pointer-events-none opacity-50"></div>
             <video ref={videoRef} autoPlay playsInline muted onPlay={handleVideoOnPlay} className="absolute w-full h-full object-cover" />
             <canvas ref={canvasRef} className="absolute w-full h-full object-cover pointer-events-none" />
          </div>

          <div className="absolute bottom-10 flex justify-center w-full z-20">
             <button 
                onClick={handleCapture}
                disabled={!isReadyToCapture || isCapturing}
                className={`w-20 h-20 rounded-full border-4 shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  isReadyToCapture && !isCapturing
                    ? 'bg-white border-green-500 scale-110 cursor-pointer hover:scale-125' 
                    : 'bg-gray-400 border-gray-600 opacity-50 cursor-not-allowed'
                }`}
             >
                <div className={`w-16 h-16 rounded-full border-2 ${isReadyToCapture ? 'bg-white border-black' : 'bg-gray-500 border-gray-700'}`}></div>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Action;