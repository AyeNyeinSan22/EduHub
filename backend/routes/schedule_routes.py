from flask import Blueprint, request, jsonify
from backend.models import db, ScheduleItem

schedule_bp = Blueprint("schedule_bp", __name__)

# GET weekly schedule
@schedule_bp.route("/schedule", methods=["GET"])
def get_schedule():
    items = ScheduleItem.query.order_by(ScheduleItem.weekday.asc()).all()

    return jsonify([
        {
            "id": item.id,
            "title": item.title,
            "weekday": item.weekday,
            "start_time": item.start_time,
            "location": item.location,
        }
        for item in items
    ])


# UPLOAD schedule 
@schedule_bp.route("/schedule/upload", methods=["POST"])
def bulk_upload_schedule():
    data = request.get_json()

    if not isinstance(data, list):
        return jsonify({"error": "Expected a list of schedule items"}), 400

    for item in data:
        new_item = ScheduleItem(
            title=item.get("title"),
            weekday=item.get("weekday"),
            start_time=item.get("start_time"),
            location=item.get("location")
        )
        db.session.add(new_item)

    db.session.commit()

    return jsonify({"message": "Schedule uploaded"}), 200
