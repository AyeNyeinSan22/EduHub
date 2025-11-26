from datetime import datetime
from backend.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(200))
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
    