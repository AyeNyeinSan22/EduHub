
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:b%40o17icit@localhost/eduhub_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 24  # 24 hours

    UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
    COVER_FOLDER = os.path.join(UPLOAD_FOLDER, "covers") 
    # Set to 200MB (adjust if needed)
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  

    ALLOWED_FILE_EXTENSIONS = {"pdf", "jpg", "jpeg", "png"}
