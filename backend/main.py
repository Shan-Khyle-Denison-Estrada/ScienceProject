from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# CORS Setup (same as before)
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
# Replace with your actual connection string if using Atlas
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client.farm_database

@app.get("/")
async def read_root():
    return {"message": "Hello from the FARM Stack!"}

@app.get("/items")
async def get_items():
    # Example: Fetching all documents from a collection named 'items'
    items = []
    cursor = db.items.find({})
    async for document in cursor:
        # Convert ObjectId to string for JSON serialization
        document['_id'] = str(document['_id']) 
        items.append(document)
    return items