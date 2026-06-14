from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Five Agra Select API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class QuoteRequestCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    company: Optional[str] = Field(default="", max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=80)
    commodity: str = Field(..., min_length=1, max_length=80)
    volume_tons: Optional[str] = Field(default="", max_length=80)
    message: Optional[str] = Field(default="", max_length=4000)
    language: Optional[str] = Field(default="en", max_length=5)


class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str = ""
    email: str
    phone: str = ""
    commodity: str
    volume_tons: str = ""
    message: str = ""
    language: str = "en"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "Five Agra Select", "status": "ok"}


@api_router.get("/health")
async def health():
    return {"status": "ok", "ts": datetime.now(timezone.utc).isoformat()}


@api_router.post("/quote-requests", response_model=QuoteRequest, status_code=201)
async def create_quote_request(payload: QuoteRequestCreate):
    allowed = {"corn", "wheat", "sunflower", "barley", "rapeseed", "soybean"}
    if payload.commodity.lower() not in allowed:
        raise HTTPException(status_code=400, detail="Invalid commodity")
    obj = QuoteRequest(**payload.model_dump())
    doc = obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.quote_requests.insert_one(doc)
    return obj


@api_router.get("/quote-requests", response_model=List[QuoteRequest])
async def list_quote_requests(limit: int = 100):
    items = await db.quote_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for it in items:
        if isinstance(it.get("created_at"), str):
            try:
                it["created_at"] = datetime.fromisoformat(it["created_at"])
            except ValueError:
                it["created_at"] = datetime.now(timezone.utc)
    return items


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
