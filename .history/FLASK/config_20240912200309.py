import os
from dotenv import load_dotenv
import datetime

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

class Config:
    # Clé secrète pour la sécurité des sessions Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')  
    
    # Clé secrète pour JWT (JSON Web Token)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default_jwt_secret')

    # Durée de vie du token JWT
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=24)  # Token valide pendant 24 heures
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)  # Refresh token valide pendant 30 jours

    # URL de connexion à la base de données PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://info:informatique@localhost:5432/Mydatabase'
    
    # Désactiver le suivi des modifications pour améliorer les performances
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Options supplémentaires pour SQLAlchemy
    SQLALCHEMY_ENGINE_OPTIONS = {
        'connect_args': {
            'client_encoding': 'utf8'
        }
    }
    
    # Configuration de Flask-Mail
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
