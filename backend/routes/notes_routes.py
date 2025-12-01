import os
import datetime
from difflib import get_close_matches

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

from ..models import Note
from ..extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity

notes_bp = Blueprint("notes", __name__)

# Allowed extensions
ALLOWED_FILE_EXT = {"pdf", "docx", "txt", "pptx"}
ALLOWED_IMG_EXT = {"png", "jpg", "jpeg", "webp"}



# Create folders safely

def ensure_folder(path):
    if not os.path.exists(path):
        os.makedirs(path)



# Check allowed extensions

def allowed(filename, allowed_set):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_set



# Convert stored filename → full URL

def build_url(filename):
    if not filename:
        return None

    # For images (cover)
    if filename.lower().endswith(("png", "jpg", "jpeg", "webp")):
        return f"http://127.0.0.1:5000/uploads/covers/{filename}"

    # For PDF/files
    return f"http://127.0.0.1:5000/uploads/{filename}"


def resolve_real_file_path(filename):
    uploads_folder = current_app.config["UPLOAD_FOLDER"]

    try:
        files = os.listdir(uploads_folder)
    except Exception:
        return filename

    # 1 Exact match
    if filename in files:
        return filename

    # 2 Case-insensitive match
    lower_map = {f.lower(): f for f in files}
    if filename.lower() in lower_map:
        return lower_map[filename.lower()]

    # 3 Fuzzy match with similarity
    pdfs = [f for f in files if f.lower().endswith(".pdf")]
    close = get_close_matches(filename, pdfs, n=1, cutoff=0.3)
    if close:
        return close[0]

    return filename



# GET ALL NOTES

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
            "file_url": build_url(resolve_real_file_path(n.file_path)) if n.file_path else None,
            "cover_url": build_url(n.cover_path) if n.cover_path else None,
            "last_page": getattr(n, "last_page", None),
        }
        for n in notes
    ])



# CREATE NOTE (expects multipart/form-data)

@notes_bp.route("", methods=["POST"])

def create_note():
    # Expect form-data (text fields + optional file/cover)
    data = request.form

    subject = data.get("subject")
    title = data.get("title")
    category = data.get("category")
    notes_text = data.get("notes")

    if not subject or not title or not category:
        return jsonify({"error": "Missing required fields (subject, title, category)"}), 400

    UPLOAD_FOLDER = current_app.config["UPLOAD_FOLDER"]
    COVER_FOLDER = current_app.config["COVER_FOLDER"]

    ensure_folder(UPLOAD_FOLDER)
    ensure_folder(COVER_FOLDER)

    file_filename = None
    cover_filename = None

    # Upload file (PDF)
    file = request.files.get("file")
    if file and allowed(file.filename, ALLOWED_FILE_EXT):
        safe = secure_filename(file.filename)
        # add timestamp to avoid collisions
        name, ext = os.path.splitext(safe)
        stamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        file_filename = f"{name}_{stamp}{ext}"
        file.save(os.path.join(UPLOAD_FOLDER, file_filename))

    # Upload cover (image)
    cover = request.files.get("cover")
    if cover and allowed(cover.filename, ALLOWED_IMG_EXT):
        safe = secure_filename(cover.filename)
        name, ext = os.path.splitext(safe)
        stamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        cover_filename = f"{name}_{stamp}{ext}"
        cover.save(os.path.join(COVER_FOLDER, cover_filename))

    note = Note(
        subject=subject,
        title=title,
        category=category,
        notes=notes_text,
        file_path=file_filename,
        cover_path=cover_filename
    )

    db.session.add(note)
    db.session.commit()

    return jsonify({
        "msg": "created",
        "note": {
            "id": note.id,
            "file_url": build_url(note.file_path),
            "cover_url": build_url(note.cover_path),
        }
    }), 201



# GET SINGLE NOTE

@notes_bp.route("/<int:note_id>", methods=["GET"])

def get_note(note_id):
    n = Note.query.get_or_404(note_id)
   
    # Fix mismatched filenames (only for files)
    file_path = n.file_path or None
    if file_path:
        file_path = resolve_real_file_path(file_path)

    return jsonify({
        "id": n.id,
        "subject": n.subject,
        "title": n.title,
        "category": n.category,
        "notes": n.notes,
        "file_url": build_url(file_path) if file_path else None,
        "cover_url": build_url(n.cover_path) if n.cover_path else None,
        "last_page": getattr(n, "last_page", None),
    })


# ---------------------------------------------------------
# UPDATE NOTE (multipart/form-data)
# ---------------------------------------------------------
@notes_bp.route("/<int:note_id>", methods=["PUT"])
def update_note(note_id):
    n = Note.query.get_or_404(note_id)
    

    n.subject = request.form.get("subject", n.subject)
    n.title = request.form.get("title", n.title)
    n.category = request.form.get("category", n.category)
    n.notes = request.form.get("notes", n.notes)

    UPLOAD_FOLDER = current_app.config["UPLOAD_FOLDER"]
    COVER_FOLDER = current_app.config["COVER_FOLDER"]
    ensure_folder(UPLOAD_FOLDER)
    ensure_folder(COVER_FOLDER)

    # File update
    file = request.files.get("file")
    if file and allowed(file.filename, ALLOWED_FILE_EXT):
        safe = secure_filename(file.filename)
        name, ext = os.path.splitext(safe)
        stamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = f"{name}_{stamp}{ext}"
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        n.file_path = filename

    # Cover update
    cover = request.files.get("cover")
    if cover and allowed(cover.filename, ALLOWED_IMG_EXT):
        safe = secure_filename(cover.filename)
        name, ext = os.path.splitext(safe)
        stamp = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        filename = f"{name}_{stamp}{ext}"
        cover.save(os.path.join(COVER_FOLDER, filename))
        n.cover_path = filename

    db.session.commit()
    return jsonify({"msg": "updated"}), 200



# DELETE NOTE

@notes_bp.route("/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    n = Note.query.get_or_404(note_id)
   
    # Remove file
    if n.file_path:
        file_full = os.path.join(current_app.config["UPLOAD_FOLDER"], n.file_path)
        if os.path.exists(file_full):
            os.remove(file_full)

    # Remove cover
    if n.cover_path:
        cover_full = os.path.join(current_app.config["COVER_FOLDER"], n.cover_path)
        if os.path.exists(cover_full):
            os.remove(cover_full)

    db.session.delete(n)
    db.session.commit()

    return jsonify({"msg": "deleted"}), 200


# =====================================================================
#                     BOOKMARKS API (raw SQL kept for compatibility)
# =====================================================================
@notes_bp.route('/<int:note_id>/bookmarks', methods=['GET', 'POST', 'PUT', 'DELETE'])
def bookmarks(note_id):
    # GET — list bookmarks
    if request.method == 'GET':
        rows = db.session.execute(
            "SELECT id, note_id, page, title, created_at FROM bookmarks WHERE note_id = :nid ORDER BY created_at",
            {"nid": note_id}
        ).fetchall()
        return jsonify([dict(r) for r in rows])

    # POST — add bookmark (accepts JSON)
    if request.method == 'POST':
        data = request.get_json() or {}
        page = int(data.get("page", 1))
        title = data.get("title", f"Page {page}")
        created = datetime.datetime.utcnow()

        db.session.execute(
            "INSERT INTO bookmarks (note_id, page, title, created_at) VALUES (:nid, :p, :t, :c)",
            {"nid": note_id, "p": page, "t": title, "c": created}
        )
        db.session.commit()
        return jsonify({"msg": "ok"}), 201

    # PUT — rename bookmark
    if request.method == 'PUT':
        data = request.get_json() or {}
        bid = data.get("id")
        title = data.get("title")

        if not bid or not title:
            return jsonify({"error": "missing id or title"}), 400

        db.session.execute(
            "UPDATE bookmarks SET title = :t WHERE id = :id",
            {"t": title, "id": bid}
        )
        db.session.commit()
        return jsonify({"msg": "updated"}), 200

    # DELETE — remove bookmark
    if request.method == 'DELETE':
        data = request.get_json() or {}
        bid = data.get("id")

        if not bid:
            return jsonify({"error": "missing id"}), 400

        db.session.execute(
            "DELETE FROM bookmarks WHERE id = :id",
            {"id": bid}
        )
        db.session.commit()
        return jsonify({"msg": "deleted"}), 200


# =====================================================================
#                     ANNOTATIONS API
# =====================================================================
@notes_bp.route("/<int:note_id>/annotations", methods=["GET", "POST", "PUT", "DELETE"])
def annotations(note_id):
    if request.method == "GET":
        rows = db.session.execute(
            "SELECT id, note_id, page, x_pct, y_pct, text, created_at FROM annotations WHERE note_id = :nid ORDER BY created_at",
            {"nid": note_id}
        ).fetchall()
        return jsonify([dict(r) for r in rows])

    if request.method == "POST":
        data = request.get_json()
        page = int(data.get("page"))
        x = float(data.get("x_pct"))
        y = float(data.get("y_pct"))
        text = data.get("text", "")
        created = datetime.datetime.utcnow()

        db.session.execute(
            "INSERT INTO annotations (note_id, page, x_pct, y_pct, text, created_at) "
            "VALUES (:nid, :p, :x, :y, :t, :c)",
            {"nid": note_id, "p": page, "x": x, "y": y, "t": text, "c": created},
        )
        db.session.commit()
        return jsonify({"msg": "created"}), 201

    if request.method == "PUT":
        data = request.get_json()
        aid = data.get("id")
        text = data.get("text")

        db.session.execute(
            "UPDATE annotations SET text = :t WHERE id = :id",
            {"t": text, "id": aid}
        )
        db.session.commit()
        return jsonify({"msg": "updated"}), 200

    if request.method == "DELETE":
        data = request.get_json()
        aid = data.get("id")

        db.session.execute("DELETE FROM annotations WHERE id = :id", {"id": aid})
        db.session.commit()
        return jsonify({"msg": "deleted"}), 200


# =====================================================================
#                     LAST PAGE SAVER
# =====================================================================
@notes_bp.route("/<int:note_id>/lastpage", methods=["GET", "POST"])
def last_page(note_id):
    if request.method == "GET":
        n = Note.query.get(note_id)
        if not n:
            return jsonify({"last_page": None})
        return jsonify({"last_page": getattr(n, "last_page", None)})

    if request.method == "POST":
        data = request.get_json() or {}
        page = int(data.get("page", 1))

        db.session.execute(
            "UPDATE note SET last_page = :p WHERE id = :id",
            {"p": page, "id": note_id}
        )
        db.session.commit()
        return jsonify({"msg": "saved"}), 200
