# models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Créez une instance de SQLAlchemy
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='visiteur')  # Rôle par défaut 'visiteur'

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
    admin_name = db.Column(db.String(100))  # Nouveau champ pour le nom de l'administrateur
    admin_email = db.Column(db.String(100))  
    def __repr__(self):
        return f"<Message {self.name} - {self.email}>"

# Créer les tables si elles n'existent pas encore
def init_db():
    db.create_all()        

