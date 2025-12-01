# backend/routes/reminders_routes.py
from flask import Blueprint, request, jsonify
from backend.extensions import db
from backend.models import Reminder
from datetime import datetime

reminders_bp = Blueprint("reminders_bp", __name__)

def parse_iso(dt_str):
    # Accept ISO or fallback
    try:
        return datetime.fromisoformat(dt_str)
    except Exception:
        # try common formats or raise
        raise

@reminders_bp.get("/reminders")
def get_reminders():
    reminders = Reminder.query.order_by(Reminder.remind_at.asc()).all()
    return jsonify([{
        "id": r.id,
        "title": r.title,
        "description": r.description,
        "remind_at": r.remind_at.isoformat(),
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "updated_at": r.updated_at.isoformat() if r.updated_at else None,
        "delivered": r.delivered
    } for r in reminders]), 200

@reminders_bp.post("/reminders")
def create_reminder():
    data = request.get_json() or {}
    title = data.get("title")
    remind_at = data.get("remind_at")
    description = data.get("description")

    if not title or not remind_at:
        return jsonify({"error": "title and remind_at are required"}), 400

    try:
        dt = parse_iso(remind_at)
    except Exception:
        return jsonify({"error": "invalid remind_at format; use ISO8601"}), 400

    r = Reminder(title=title, description=description, remind_at=dt)
    db.session.add(r)
    db.session.commit()
    return jsonify({"id": r.id}), 201

@reminders_bp.put("/reminders/<int:rem_id>")
def update_reminder(rem_id):
    r = Reminder.query.get_or_404(rem_id)
    data = request.get_json() or {}

    if "title" in data:
        r.title = data["title"]
    if "description" in data:
        r.description = data["description"]
    if "remind_at" in data:
        try:
            r.remind_at = parse_iso(data["remind_at"])
        except Exception:
            return jsonify({"error": "invalid remind_at format"}), 400
    if "delivered" in data:
        r.delivered = bool(data["delivered"])

    db.session.commit()
    return jsonify({"status": "ok"}), 200

@reminders_bp.delete("/reminders/<int:rem_id>")
def delete_reminder(rem_id):
    r = Reminder.query.get_or_404(rem_id)
    db.session.delete(r)
    db.session.commit()
    return jsonify({"status": "deleted"}), 200
