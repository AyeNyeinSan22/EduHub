# # backend/app.py
# from flask import Flask, send_from_directory
# from flask_cors import CORS
# from flask_socketio import SocketIO
# import os

# from dotenv import load_dotenv
# load_dotenv()

# from backend.config import Config
# from backend.models import db

# socketio = SocketIO(cors_allowed_origins="*")

# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)

#     # Ensure folders exist
#     os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
#     os.makedirs(app.config["COVER_FOLDER"], exist_ok=True)

#     # Init extensions
#     db.init_app(app)
#     socketio.init_app(app)
#     CORS(app)

#     # Register blueprints
#     from backend.routes.auth_routes import auth_bp
#     from backend.routes.notes_routes import notes_bp

#     app.register_blueprint(auth_bp, url_prefix="/api/auth")
#     app.register_blueprint(notes_bp, url_prefix="/api/notes")

#     # Serve uploaded files (PDF)
#     @app.route("/uploads/<path:filename>")
#     def uploaded_files(filename):
#         return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

#     # Serve cover images
#     @app.route("/uploads/covers/<path:filename>")
#     def cover_files(filename):
#         return send_from_directory(app.config["COVER_FOLDER"], filename)

#     # Create database
#     with app.app_context():
#         import backend.models
#         db.create_all()

#     return app

# app = create_app()

# if __name__ == "__main__":
#     socketio.run(app, debug=True)
# backend/app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
import os

from dotenv import load_dotenv
load_dotenv()

from backend.config import Config
from backend.models import db

socketio = SocketIO(cors_allowed_origins="*")
jwt = JWTManager()  # ✅ ADD THIS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure folders exist
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["COVER_FOLDER"], exist_ok=True)

    # Init extensions
    db.init_app(app)
    socketio.init_app(app)
    # CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    CORS(app,
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type", "Authorization"])

    jwt.init_app(app)   # ✅ VERY IMPORTANT — without this JWT won't work!

    # Register blueprints
    from backend.routes.auth_routes import auth_bp
    from backend.routes.notes_routes import notes_bp
    from backend.routes.reminders_routes import reminders_bp
    from backend.routes.schedule_routes import schedule_bp
    from backend.routes.ai_routes import ai_bp
    
 
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(notes_bp, url_prefix="/api/notes")
    app.register_blueprint(reminders_bp, url_prefix="/api")
    app.register_blueprint(schedule_bp, url_prefix="/api")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    



    # Serve uploaded files (PDF)
    @app.route("/uploads/<path:filename>")
    def uploaded_files(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # Serve cover images
    @app.route("/uploads/covers/<path:filename>")
    def cover_files(filename):
        return send_from_directory(app.config["COVER_FOLDER"], filename)
   
    @app.route("/uploads/avatars/<path:filename>")
    def avatar_files(filename):
        return send_from_directory(app.config.get("AVATAR_FOLDER"), filename)

    # Create database
    with app.app_context():
        import backend.models
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)
