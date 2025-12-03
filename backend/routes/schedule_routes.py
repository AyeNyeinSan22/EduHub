from flask import Blueprint, request, jsonify
from backend.models import db, ScheduleItem

schedule_bp = Blueprint("schedule_bp", __name__)

# -------------------------------------
# GET ALL SCHEDULE
# -------------------------------------
@schedule_bp.get("/schedule")
def get_schedule():
    items = ScheduleItem.query.order_by(ScheduleItem.weekday.asc()).all()
    return jsonify([
        {
            "id": item.id,
            "title": item.title,
            "weekday": item.weekday,
            "start_time": item.start_time,
            "location": item.location,
        } for item in items
    ])


# -------------------------------------
# CREATE A CLASS
# -------------------------------------
@schedule_bp.post("/schedule")
def create_schedule():
    data = request.json
    item = ScheduleItem(
        title=data["title"],
        weekday=data["weekday"],
        start_time=data["start_time"],
        location=data["location"]
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "created", "id": item.id}), 201


# -------------------------------------
# UPDATE A CLASS
# -------------------------------------
@schedule_bp.put("/schedule/<int:item_id>")
def update_schedule(item_id):
    item = ScheduleItem.query.get_or_404(item_id)
    data = request.json

    item.title = data["title"]
    item.weekday = data["weekday"]
    item.start_time = data["start_time"]
    item.location = data["location"]

    db.session.commit()
    return jsonify({"message": "updated"})


# -------------------------------------
# DELETE A CLASS
# -------------------------------------
@schedule_bp.delete("/schedule/<int:item_id>")
def delete_schedule(item_id):
    item = ScheduleItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "deleted"})

# -------------------------------------
# DELETE ALL CLASSES
# -------------------------------------
@schedule_bp.delete("/schedule")
def delete_all_schedule():
    ScheduleItem.query.delete()
    db.session.commit()
    return jsonify({"message": "all deleted"}), 200

