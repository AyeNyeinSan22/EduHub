# backend/app.py
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

from backend.config import Config
from backend.extensions import db   # FIX: we import db from extensions
                                     # NOT create a new db instance here

jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

   # Auto-create upload folders
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(os.path.join(app.config["UPLOAD_FOLDER"], "covers"), exist_ok=True)
    
    # Initialize core extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    CORS(app)

    # Register Blueprints
    from backend.routes.auth_routes import auth_bp
    from backend.routes.notes_routes import notes_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(notes_bp, url_prefix="/api/notes")

    # Create tables
    with app.app_context():
        from backend import models   # this ensures models are registered
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)
