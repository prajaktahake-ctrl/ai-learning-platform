from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordRequestForm

from app.db.session import get_db
from app.models.user import User
from app.schemas.user_schema import UserRegister, UserLogin, TokenResponse
from app.core.security import hash_password, verify_password
from app.core.auth import create_access_token, SECRET_KEY, ALGORITHM


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ✅ REGISTER
@router.post("/register", response_model=TokenResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        personality_mode=user.personality_mode,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ✅ LOGIN (OAuth2)
@router.post("/login", response_model=TokenResponse)
def login(
    user: UserLogin = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout():
    return {"message": "Logout successful"}
# # ✅ JWT SETUP
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email = payload.get("sub")

#         if email is None:
#             raise HTTPException(status_code=401, detail="Invalid token")

#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

#     user = db.query(User).filter(User.email == email).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     return user

from fastapi.security import HTTPAuthorizationCredentials

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials  # <-- actual token

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user