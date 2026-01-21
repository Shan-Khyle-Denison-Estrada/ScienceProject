from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import base64

app = FastAPI()

# 1. CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load the Model (FIXED)
MODEL_PATH = "efficientnet_b0_full_model.pth"
model = None
device = torch.device('cpu')

try:
    # --- THE FIX IS HERE: weights_only=False ---
    # This tells PyTorch to allow loading the full model architecture
    model = torch.load(MODEL_PATH, map_location=device, weights_only=False)
    
    model.eval() 
    print("✅ efficientnet_b0_full_model loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading model: {e}")
    print("Detailed error for debugging:", str(e))

# 3. Define Image Preprocessing
preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 4. Request Schema
class EyeData(BaseModel):
    left_eye: str
    right_eye: str

# 5. Helper Function for Prediction
def predict_eye(base64_img):
    if model is None:
        return "Model Error"
    
    try:
        # Decode the Base64 string
        if "base64," in base64_img:
            base64_img = base64_img.split(",")[1]
        
        image_data = base64.b64decode(base64_img)
        image = Image.open(io.BytesIO(image_data)).convert("RGB")
        
        # Preprocess
        input_tensor = preprocess(image).unsqueeze(0).to(device)
        
        # Run Inference
        with torch.no_grad():
            outputs = model(input_tensor)
            _, predicted = torch.max(outputs, 1)
            idx = predicted.item()
            
            # --- CHECK YOUR LABELS ---
            # Ensure this order matches how you trained the model!
            classes = ["Myopia", "Normal"] 
            
            if idx < len(classes):
                return classes[idx]
            return "Unknown"
            
    except Exception as e:
        print(f"Prediction Error: {e}")
        return "Error"

@app.post("/predict")
async def predict_eyes(data: EyeData):
    left_result = predict_eye(data.left_eye)
    right_result = predict_eye(data.right_eye)
    
    return {
        "left_diagnosis": left_result,
        "right_diagnosis": right_result
    }

@app.get("/")
def read_root():
    return {"status": "Backend is running"}