from datetime import datetime
from backend.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(200))
    avatar = db.Column(db.String(300)) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Note(db.Model):
    ##Data model for creating notes
    id = db.Column(db.Integer, primary_key=True)
    subject = db.Column(db.String(200))
    title = db.Column(db.String(200))
    category = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    file_path = db.Column(db.String(300))
    cover_path = db.Column(db.String(300))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    last_page = db.Column(db.Integer, default=1)

class Reminder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    remind_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    delivered = db.Column(db.Boolean, default=False)

class ScheduleItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    weekday = db.Column(db.Integer) # 0 = Mon
    start_time = db.Column(db.String(10))
    location = db.Column(db.String(200))
