from pydantic import BaseModel, EmailStr
from typing import List


# ------------------ User Schemas ------------------ #
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True


class AuthResponse(BaseModel):
    user: UserResponse
    token: str 

# ------------------ PDF Schemas ------------------ #
class PDFBase(BaseModel):
    filename: str


class PDFUploadResponse(BaseModel):
    id: int
    filename: str
    owner_id: int
    message: str   

    class Config:
        orm_mode = True


class PDFItem(BaseModel):
    id: int
    filename: str

    class Config:
        orm_mode = True


class PDFListResponse(BaseModel):
    pdfs: List[PDFItem]
