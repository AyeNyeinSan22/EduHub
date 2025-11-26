# # backend/routes/notes_routes.py
# import os
# from flask import Blueprint, request, jsonify, current_app
# from werkzeug.utils import secure_filename
# from ..extensions import db
# from ..models import Note

# notes_bp = Blueprint("notes", __name__)

# ALLOWED_FILE_EXT = {"pdf", "docx", "txt", "pptx"}
# ALLOWED_IMG_EXT = {"png", "jpg", "jpeg", "webp"}


# def ensure_folder(path):
#     """Create folder if missing"""
#     if not os.path.exists(path):
#         os.makedirs(path)


# def allowed(filename, allowed_set):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_set


# # LIST NOTES 
# @notes_bp.route("", methods=["GET"])
# def list_notes():
#     notes = Note.query.order_by(Note.created_at.desc()).all()
#     return jsonify([
#         {
#             "id": n.id,
#             "subject": n.subject,
#             "title": n.title,
#             "category": n.category,
#             "notes": n.notes,
#             "file_path": n.file_path,
#             "cover_path": n.cover_path,
#         }
#         for n in notes
#     ])


# # CREATE NOTE
# @notes_bp.route("", methods=["POST"])
# def create_note():
#     data = request.form
#     subject = data.get("subject")
#     title = data.get("title")
#     category = data.get("category")
#     notes_text = data.get("notes")

#     if not subject or not title or not category:
#         return jsonify({"error": "Missing required fields"}), 400

#     UPLOAD_FOLDER = current_app.config.get("UPLOAD_FOLDER")
#     COVER_FOLDER = current_app.config.get("COVER_FOLDER")

#     ensure_folder(UPLOAD_FOLDER)
#     ensure_folder(COVER_FOLDER)

#     file_path, cover_path = None, None

#     # ---- FILE UPLOAD ----
#     file = request.files.get("file")
#     if file:
#         if not allowed(file.filename, ALLOWED_FILE_EXT):
#             return jsonify({"error": "Invalid file type"}), 400

#         filename = secure_filename(file.filename)
#         save_path = os.path.join(UPLOAD_FOLDER, filename)
#         file.save(save_path)
#         file_path = save_path

#     # COVER UPLOAD 
#     cover = request.files.get("cover")
#     if cover:
#         if not allowed(cover.filename, ALLOWED_IMG_EXT):
#             return jsonify({"error": "Invalid cover image type"}), 400

#         filename = secure_filename(cover.filename)
#         save_path = os.path.join(COVER_FOLDER, filename)
#         cover.save(save_path)
#         cover_path = save_path

#     # SAVE RECORD 
#     note = Note(
#         subject=subject,
#         title=title,
#         category=category,
#         notes=notes_text,
#         file_path=file_path,
#         cover_path=cover_path,
#     )
#     db.session.add(note)
#     db.session.commit()

#     return jsonify({"msg": "created", "id": note.id}), 201


# #  GET SINGLE NOTE 
# @notes_bp.route("/<int:note_id>", methods=["GET"])
# def get_note(note_id):
#     n = Note.query.get_or_404(note_id)
#     return jsonify({
#         "id": n.id,
#         "subject": n.subject,
#         "title": n.title,
#         "category": n.category,
#         "notes": n.notes,
#         "file_path": n.file_path,
#         "cover_path": n.cover_path,
#     })


# # UPDATE NOTE 
# @notes_bp.route("/<int:note_id>", methods=["PUT"])
# def update_note(note_id):
#     n = Note.query.get_or_404(note_id)
#     data = request.form

#     n.subject = data.get("subject", n.subject)
#     n.title = data.get("title", n.title)
#     n.category = data.get("category", n.category)
#     n.notes = data.get("notes", n.notes)

#     UPLOAD_FOLDER = current_app.config.get("UPLOAD_FOLDER")
#     COVER_FOLDER = current_app.config.get("COVER_FOLDER")

#     ensure_folder(UPLOAD_FOLDER)
#     ensure_folder(COVER_FOLDER)

#     # update file
#     file = request.files.get("file")
#     if file:
#         if allowed(file.filename, ALLOWED_FILE_EXT):
#             filename = secure_filename(file.filename)
#             save_path = os.path.join(UPLOAD_FOLDER, filename)
#             file.save(save_path)
#             n.file_path = save_path

#     # update cover
#     cover = request.files.get("cover")
#     if cover:
#         if allowed(cover.filename, ALLOWED_IMG_EXT):
#             filename = secure_filename(cover.filename)
#             save_path = os.path.join(COVER_FOLDER, filename)
#             cover.save(save_path)
#             n.cover_path = save_path

#     db.session.commit()
#     return jsonify({"msg": "updated"})


# # ---------------- DELETE NOTE ----------------
# @notes_bp.route("/<int:note_id>", methods=["DELETE"])
# def delete_note(note_id):
#     n = Note.query.get_or_404(note_id)

#     if n.file_path and os.path.exists(n.file_path):
#         os.remove(n.file_path)

#     if n.cover_path and os.path.exists(n.cover_path):
#         os.remove(n.cover_path)

#     db.session.delete(n)
#     db.session.commit()

#     return jsonify({"msg": "deleted"})
# backend/routes/notes_routes.py
import os
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from ..extensions import db
from ..models import Note

notes_bp = Blueprint("notes", __name__)

ALLOWED_FILE_EXT = {"pdf", "docx", "txt", "pptx"}
ALLOWED_IMG_EXT = {"png", "jpg", "jpeg", "webp"}


def ensure_folder(path):
    if not os.path.exists(path):
        os.makedirs(path)


def allowed(filename, allowed_set):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_set


# Convert filesystem path → public URL
def build_url(filepath):
    if not filepath:
        return None

    filename = filepath.replace("\\", "/").split("/")[-1]

    # detect if cover or file
    if "covers" in filepath.replace("\\", "/"):
        return f"http://127.0.0.1:5000/uploads/covers/{filename}"
    else:
        return f"http://127.0.0.1:5000/uploads/{filename}"


# SERVE UPLOAD FILES
@notes_bp.route("/file/<filename>")
def serve_file(filename):
    folder = current_app.config["UPLOAD_FOLDER"]
    return send_from_directory(folder, filename)


@notes_bp.route("/cover/<filename>")
def serve_cover(filename):
    folder = os.path.join(current_app.config["UPLOAD_FOLDER"], "covers")
    return send_from_directory(folder, filename)


# -------- LIST NOTES --------
@notes_bp.route("", methods=["GET"])
def list_notes():
    notes = Note.query.order_by(Note.created_at.desc()).all()
    return jsonify([
        {
            "id": n.id,
            "subject": n.subject,
            "title": n.title,
            "category": n.category,
            "notes": n.notes,
            "file_url": build_url(n.file_path),
            "cover_url": build_url(n.cover_path),
        }
        for n in notes
    ])


# -------- CREATE NOTE --------
@notes_bp.route("", methods=["POST"])
def create_note():
    data = request.form
    subject = data.get("subject")
    title = data.get("title")
    category = data.get("category")
    notes_text = data.get("notes")

    if not subject or not title or not category:
        return jsonify({"error": "Missing required fields"}), 400

    UPLOAD_FOLDER = current_app.config["UPLOAD_FOLDER"]
    COVER_FOLDER = current_app.config["COVER_FOLDER"]

    ensure_folder(UPLOAD_FOLDER)
    ensure_folder(COVER_FOLDER)

    file_path = None
    cover_path = None

    # ---- FILE ----
    file = request.files.get("file")
    if file and allowed(file.filename, ALLOWED_FILE_EXT):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

    # ---- COVER ----
    cover = request.files.get("cover")
    if cover and allowed(cover.filename, ALLOWED_IMG_EXT):
        filename = secure_filename(cover.filename)
        cover_path = os.path.join(COVER_FOLDER, filename)
        cover.save(cover_path)

    note = Note(
        subject=subject,
        title=title,
        category=category,
        notes=notes_text,
        file_path=file_path,
        cover_path=cover_path
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({
        "msg": "created",
        "id": note.id,
        "file_url": build_url(file_path),
        "cover_url": build_url(cover_path),
    }), 201


# -------- GET ONE NOTE --------
@notes_bp.route("/<int:note_id>", methods=["GET"])
def get_note(note_id):
    n = Note.query.get_or_404(note_id)
    return jsonify({
        "id": n.id,
        "subject": n.subject,
        "title": n.title,
        "category": n.category,
        "notes": n.notes,
        "file_url": build_url(n.file_path),
        "cover_url": build_url(n.cover_path),
    })


# -------- UPDATE NOTE --------
@notes_bp.route("/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    n = Note.query.get_or_404(note_id)
    data = request.form

    n.subject = data.get("subject", n.subject)
    n.title = data.get("title", n.title)
    n.category = data.get("category", n.category)
    n.notes = data.get("notes", n.notes)

    UPLOAD_FOLDER = current_app.config["UPLOAD_FOLDER"]
    COVER_FOLDER = current_app.config["COVER_FOLDER"]

    ensure_folder(UPLOAD_FOLDER)
    ensure_folder(COVER_FOLDER)

    # update file
    file = request.files.get("file")
    if file and allowed(file.filename, ALLOWED_FILE_EXT):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        n.file_path = save_path

    # update cover
    cover = request.files.get("cover")
    if cover and allowed(cover.filename, ALLOWED_IMG_EXT):
        filename = secure_filename(cover.filename)
        save_path = os.path.join(COVER_FOLDER, filename)
        cover.save(save_path)
        n.cover_path = save_path

    db.session.commit()

    return jsonify({"msg": "updated"})


# -------- DELETE NOTE --------
@notes_bp.route("/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    n = Note.query.get_or_404(note_id)

    if n.file_path and os.path.exists(n.file_path):
        os.remove(n.file_path)

    if n.cover_path and os.path.exists(n.cover_path):
        os.remove(n.cover_path)

    db.session.delete(n)
    db.session.commit()

    return jsonify({"msg": "deleted"})
