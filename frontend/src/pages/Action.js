import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Access face-api from global window object
const faceapi = window.faceapi;

const Action = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); 
  const [formData, setFormData] = useState({ fullName: '', age: '', sex: '' });
  
  // Camera & Tracking Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // State
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [setError] = useState('');

  // Flash & UI State
  const [hasFlash, setHasFlash] = useState(false);
  const [flashActive, setFlashActive] = useState(false); // Visual white screen effect
  const [feedback, setFeedback] = useState("Initializing...");
  const [isReadyToCapture, setIsReadyToCapture] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false); 
  const [isAnalyzing, setIsAnalyzing] = useState(false); 

  // Constants
  const MAX_CENTER_OFFSET = 100; 
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

  // --- 2. HD CAMERA CONFIGURATION ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { exact: "environment" }, 
          width: { ideal: 1920 }, 
          height: { ideal: 1080 } 
        } 
      });
      
      if (videoRef.current) videoRef.current.srcObject = stream;

      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) setHasFlash(true);

      return stream;
    } catch (err) {
      console.warn("HD failed, falling back", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
        return stream;
      } catch (e) { setError("Camera access denied"); }
    }
  };

  const sendToBackend = async (leftImage, rightImage) => {
    setIsAnalyzing(true);
    try {
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
        setIsCapturing(false); 
      } else {
        navigate('/result-detailed', { 
          state: { 
            captureData: { leftEye: leftImage, rightEye: rightImage },
            formData: formData,
            diagnosis: result
          } 
        });
      }
    } catch (err) {
      console.error(err);
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
      
      const displaySize = { width: video.clientWidth, height: video.clientHeight };
      faceapi.matchDimensions(canvas, displaySize);

      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (detection) {
        const resized = faceapi.resizeResults(detection, displaySize);
        // const { width, x } = resized.detection.box; // Unused if checks are disabled
        // const landmarks = resized.landmarks; // Unused if checks are disabled

        // Always Green Box if detected
        new faceapi.draw.DrawBox(resized.detection.box, { label: 'Face', boxColor: '#22c55e' }).draw(canvas);

        /* // --- CONDITIONS COMMENTED OUT ---
        const distanceOk = width > 70 && width < 250; 
        const centerX = x + width / 2;
        const screenCenter = displaySize.width / 2;
        const isCentered = Math.abs(centerX - screenCenter) < MAX_CENTER_OFFSET;

        const getEyeRatio = (eyePoints) => {
            const d1 = Math.hypot(eyePoints[1].x - eyePoints[5].x, eyePoints[1].y - eyePoints[5].y);
            const d2 = Math.hypot(eyePoints[2].x - eyePoints[4].x, eyePoints[2].y - eyePoints[4].y);
            const w = Math.hypot(eyePoints[0].x - eyePoints[3].x, eyePoints[0].y - eyePoints[3].y);
            return (d1 + d2) / (2 * w);
        };
        const eyesOpen = getEyeRatio(landmarks.getLeftEye()) > MIN_EYE_OPEN_RATIO && getEyeRatio(landmarks.getRightEye()) > MIN_EYE_OPEN_RATIO;
        */

        let msg = "Ready";
        let ready = true;

        /*
        if (!distanceOk) msg = width < 70 ? "Move Closer" : "Too Close";
        else if (!isCentered) msg = "Center Face";
        else if (!eyesOpen) msg = "Open Eyes";
        else {
          msg = "Perfect!";
          ready = true;
        }
        */

        setFeedback(msg);
        setIsReadyToCapture(ready);
      } else {
        setFeedback("No Face");
        setIsReadyToCapture(false);
      }
    }, 200); 
    return () => clearInterval(interval);
  };

  // --- 3. CAPTURE SEQUENCE ---
  const handleCapture = async () => {
    if (!isReadyToCapture || !videoRef.current || isCapturing) return;
    
    setIsCapturing(true); 
    const video = videoRef.current;
    const stream = video.srcObject;
    const track = stream.getVideoTracks()[0];
    
    // A. Flash ON
    if (hasFlash) {
      try {
        await track.applyConstraints({ advanced: [{ torch: true }] });
        await new Promise(resolve => setTimeout(resolve, 400)); 
      } catch (err) { console.warn("Flash failed", err); }
    }

    // B. Visual Shutter Effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    // C. Detect on High-Res Source
    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    
    // D. Flash OFF
    if (hasFlash) {
      track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => {});
    }

    if (detection) {
      const cropEyeMacro = (landmarks, part) => {
        const points = part === 'left' ? landmarks.getLeftEye() : landmarks.getRightEye();
        
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
        const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;

        const eyeWidth = Math.hypot(points[3].x - points[0].x, points[3].y - points[0].y);
        
        // --- MACRO ZOOM (0.65) ---
        const zoomFactor = 0.65; 
        const cropSize = Math.max(eyeWidth * zoomFactor, 40); 

        const canvas = document.createElement('canvas');
        canvas.width = 224; 
        canvas.height = 224; 
        const ctx = canvas.getContext('2d');
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          video, 
          centerX - cropSize / 2, 
          centerY - cropSize / 2, 
          cropSize,               
          cropSize,               
          0, 0, 224, 224          
        );
        
        return canvas.toDataURL('image/jpeg', 0.95);
      };

      const left = cropEyeMacro(detection.landmarks, 'left');
      const right = cropEyeMacro(detection.landmarks, 'right');
      
      sendToBackend(left, right);

    } else {
      alert("Motion blur prevented capture. Please try again.");
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {step === 'form' && (
        <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Start Assessment</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
               <label className="block text-gray-700 font-bold mb-2">Full Name</label>
               <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition" placeholder="Enter name" />
             </div>
             <div>
               <label className="block text-gray-700 font-bold mb-2">Age</label>
               <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition" placeholder="Enter age" />
             </div>
             <div className="flex gap-4 pt-2">
                {['Male','Female'].map(s => (
                  <button key={s} type="button" onClick={() => handleSexSelect(s)} 
                    className={`flex-1 py-4 font-bold rounded-xl border-2 transition-all ${formData.sex === s ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}>{s}</button>
                ))}
             </div>
             <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl mt-6 shadow-lg transform transition active:scale-95">
               Start Camera
             </button>
          </form>
        </div>
      )}

      {step === 'camera' && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          
          <div className={`fixed inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-200 ease-out ${flashActive ? 'opacity-100' : 'opacity-0'}`}></div>

          <button onClick={() => setStep('form')} className="absolute top-6 left-6 z-20 text-white p-2 bg-black/30 backdrop-blur-md rounded-full">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>

          {hasFlash && (
             <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
               <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
               <span className="text-white text-xs font-bold uppercase tracking-wider">Flash Ready</span>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 z-[70] bg-black/80 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4 font-bold text-lg animate-pulse">Analyzing Refraction...</p>
            </div>
          )}

          <div className={`absolute top-24 px-6 py-2 rounded-full z-20 font-bold shadow-lg transition-all duration-300 transform ${isReadyToCapture ? 'bg-green-500 text-white scale-105' : 'bg-white/90 text-red-500 backdrop-blur-sm'}`}>
             {isCapturing ? "Hold Steady..." : feedback}
          </div>

          <div className="relative w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden">
             
             {/* --- OVAL GUIDE (Size: w-32 h-56) --- */}
             <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-32 h-56 border-4 border-dashed rounded-[50%] pointer-events-none transition-colors duration-300 opacity-60 ${isReadyToCapture ? 'border-green-400' : 'border-white'}`}></div>
             
             <video ref={videoRef} autoPlay playsInline muted onPlay={handleVideoOnPlay} className="absolute w-full h-full object-cover" />
             <canvas ref={canvasRef} className="absolute w-full h-full object-cover pointer-events-none" />
          </div>

          <div className="absolute bottom-12 flex justify-center w-full z-20">
             <button 
                onClick={handleCapture}
                disabled={!isReadyToCapture || isCapturing}
                className={`w-20 h-20 rounded-full border-[6px] shadow-2xl flex items-center justify-center transition-all duration-300 ${
                  isReadyToCapture && !isCapturing
                    ? 'bg-transparent border-white hover:bg-white/10 scale-110 cursor-pointer active:scale-95' 
                    : 'bg-transparent border-gray-500 opacity-50 cursor-not-allowed'
                }`}
             >
                <div className={`w-16 h-16 rounded-full transition-all duration-300 ${isReadyToCapture ? 'bg-white scale-90' : 'bg-gray-500 scale-75'}`}></div>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Action;