# # backend/routes/auth_routes.py
# from flask import Blueprint, request, jsonify
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from backend.extensions import db
# from backend.models import User

# auth_bp = Blueprint("auth", __name__)

# @auth_bp.route("/register", methods=["POST"])
# def register():
#     data = request.get_json() or {}
#     name = data.get("name")
#     email = data.get("email")
#     password = data.get("password")

#     if not email or not password:
#         return jsonify({"msg": "Email & password required"}), 400

#     if User.query.filter_by(email=email).first():
#         return jsonify({"msg": "User already exists"}), 400

#     hashed = generate_password_hash(password)
#     user = User(name=name, email=email, password=hashed)

#     db.session.add(user)
#     db.session.commit()

#     return jsonify({"msg": "User registered"}), 201


# @auth_bp.route("/login", methods=["POST"])
# def login():
#     data = request.get_json() or {}

#     user = User.query.filter_by(email=data.get("email")).first()
#     if not user or not check_password_hash(user.password, data.get("password", "")):
#         return jsonify({"msg": "Invalid credentials"}), 401

#     token = create_access_token(identity=user.id)
#     # return some basic user info + token
#     return jsonify({
#         "token": token,
#         "user": {"id": user.id, "name": user.name, "email": user.email}
#     }), 200


# # -------- profile route ----------
# @auth_bp.route("/profile", methods=["GET"])
# @jwt_required()
# def profile():
#     # jwt_required ensures a valid token is provided in Authorization header
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"msg": "User not found"}), 404

#     # Minimal profile object — extend as needed
#     return jsonify({
#         "id": user.id,
#         "name": user.name,
#         "email": user.email,
#         # If you want an avatar URL field you can add here (default placeholder)
#         "avatar_url": None
#     }), 200

# backend/routes/auth_routes.py
import os
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import datetime

from backend.extensions import db
from backend.models import User

auth_bp = Blueprint("auth", __name__)

# -------------------------
# Register
# -------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email & password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 400

    hashed = generate_password_hash(password)
    user = User(name=name, email=email, password=hashed)

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered"}), 201


# -------------------------
# Login
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)
    # also return basic user info
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar_url": (f"http://127.0.0.1:5000/uploads/avatars/{user.avatar}" if user.avatar else None)
        }
    }), 200


# -------------------------
# Profile: GET, PUT (multipart/form-data)
# -------------------------
ALLOWED_IMG_EXT = {"png", "jpg", "jpeg", "webp"}

def allowed_image(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMG_EXT

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "avatar_url": (f"http://127.0.0.1:5000/uploads/avatars/{user.avatar}" if user.avatar else None)
    })

@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    uid = get_jwt_identity()
    user = User.query.get_or_404(uid)

    # Accept form data (name, optionally avatar file)
    name = request.form.get("name")
    if name is not None:
        user.name = name

    # handle avatar upload
    file = request.files.get("avatar")
    if file and allowed_image(file.filename):
        safe = secure_filename(file.filename)
        name_part, ext = os.path.splitext(safe)
        stamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = f"{name_part}_{stamp}{ext}"
        avatar_folder = current_app.config.get("AVATAR_FOLDER", os.path.join(current_app.config["UPLOAD_FOLDER"], "avatars"))
        os.makedirs(avatar_folder, exist_ok=True)
        file.save(os.path.join(avatar_folder, filename))
        # remove old avatar if exists (optional)
        if user.avatar:
            try:
                old = os.path.join(avatar_folder, user.avatar)
                if os.path.exists(old):
                    os.remove(old)
            except Exception:
                pass
        user.avatar = filename

    db.session.commit()
    return jsonify({
        "msg": "profile updated",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "avatar_url": (f"http://127.0.0.1:5000/uploads/avatars/{user.avatar}" if user.avatar else None)
        }
    }), 200

