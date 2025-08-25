from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models, schemas

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------- Users ----------------
def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> models.User | None:
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    u = models.User(
        email=user.email,
        username=user.username,
        password_hash=pwd.hash(user.password)
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


# ---------------- Documents ----------------
def create_document(db: Session, **kwargs) -> models.Document:
    doc = models.Document(**kwargs)
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def get_document(db: Session, doc_id: str) -> models.Document | None:
    return db.query(models.Document).filter(models.Document.id == doc_id).first()


def list_documents_for_user(db: Session, user_id: int) -> list[models.Document]:
    return (
        db.query(models.Document)
        .filter(models.Document.user_id == user_id)
        .order_by(models.Document.created_at.desc())
        .all()
    )


def delete_document(db: Session, doc: models.Document):
    db.delete(doc)
    db.commit()
