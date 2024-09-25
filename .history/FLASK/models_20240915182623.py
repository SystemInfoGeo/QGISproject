from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from geoalchemy2 import Geometry

# Créez une instance de SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=True)  # Le champ peut être vide (nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # Date de création
    is_active = db.Column(db.Boolean, default=True)  # Utilisateur actif ou non
   

    def set_password(self, password):
        """Hash le mot de passe et le stocke."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Vérifie si le mot de passe fourni correspond au hash stocké."""
        return check_password_hash(self.password_hash, password)


class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    date_received = db.Column(db.DateTime, default=datetime.utcnow)
    reply = db.Column(db.Text, nullable=True)  # Champ pour stocker la réponse de l'admin
    reply_date = db.Column(db.DateTime, nullable=True)
    admin_name = db.Column(db.String(100))  # Champ pour le nom de l'administrateur qui a répondu
    admin_email = db.Column(db.String(100))  # Email de l'administrateur
    is_responded = db.Column(db.Boolean, default=False)  # Nouveau champ pour savoir si le message a été répondu
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # Date de mise à jour

    def __repr__(self):
        return f"<Message {self.name} - {self.email}>"

class TrashBin(db.Model):
    __tablename__ = 'trash_bins'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Champ pour le nom
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(10), nullable=False)  # 'plein' ou 'vide'
    last_collected = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)

    def __repr__(self):
        return f"<TrashBin {self.name} - {self.status}>"


class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    user_name = db.Column(db.String(120)) 
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)  # Pour indiquer si la notification a été lue
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='notifications')
   

    def __repr__(self):
        return f'<Notification {self.message}>'

# Créer les tables si elles n'existent pas encore
def init_db():
    db.create_all()
    

