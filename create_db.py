# create_db.py
from apps.api.database import Base, engine
from apps.api import models

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("Creating all tables...")
Base.metadata.create_all(bind=engine)

print("Database recreated successfully ✅")
