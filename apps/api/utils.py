import os, secrets, string, json
from datetime import datetime, timedelta
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

STORAGE_DIR = Path(os.getenv("STORAGE_DIR", "./storage")).resolve()
UPLOADS_DIR = STORAGE_DIR / "uploads"
METADATA_PATH = STORAGE_DIR / "metadata.json"

def ensure_dirs():
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)
    if not METADATA_PATH.exists():
        METADATA_PATH.write_text(json.dumps({"version": 1}), encoding="utf-8")

def short_id(n=12):
    alphabet = string.ascii_lowercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(n))

def now_iso(dt: datetime | None = None):
    return (dt or datetime.utcnow()).isoformat() + "Z"

def days_from_now(days: int):
    return datetime.utcnow() + timedelta(days=days)
