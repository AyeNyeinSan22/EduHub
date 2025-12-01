import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:b%40o17icit@localhost/eduhub_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key")

    # --- FIXED PATHS ---
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # backend/
    PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))  # EduHub/

    UPLOAD_FOLDER = os.path.join(PROJECT_ROOT, "uploads")
    COVER_FOLDER = os.path.join(UPLOAD_FOLDER, "covers")
    AVATAR_FOLDER = os.path.join(UPLOAD_FOLDER, "avatars")
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024
    ALLOWED_FILE_EXTENSIONS = {"pdf", "jpg", "jpeg", "png"}
