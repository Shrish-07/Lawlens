import os
from pathlib import Path
from datetime import datetime
from sqlalchemy.orm import Session
from .utils import ensure_dirs, UPLOADS_DIR
from . import crud, models

def purge_expired_files(db: Session):
    ensure_dirs()
    # Load all documents and remove the expired ones
    rows = db.query(models.Document).all()
    removed = 0
    for r in rows:
        if r.expires_at and r.expires_at < datetime.utcnow():
            try:
                p = Path(r.path)
                if p.exists():
                    p.unlink(missing_ok=True)
            except Exception:
                pass
            crud.delete_document(db, r)
            removed += 1
    return removed
