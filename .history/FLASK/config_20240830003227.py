import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

class Config:
    # Clé secrète pour la sécurité des sessions Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')  
    
    # Clé secrète pour JWT (JSON Web Token)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'default_jwt_secret')  # Remplacez 'default_jwt_secret' dans un environnement de production

    # URL de connexion à la base de données PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://info:informatique@localhost:5432/Mydatabase'
    
    # Désactiver le suivi des modifications pour améliorer les performances
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Options supplémentaires pour SQLAlchemy, notamment l'encodage en UTF-8
    SQLALCHEMY_ENGINE_OPTIONS = {
        'connect_args': {
            'client_encoding': 'utf8'
        }
    }
    
 # Configuration de Flask-Mail
   
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'irmatique44@gmail.com'
app.config['MAIL_PASSWORD'] = 'hgtvymiyaxgozwus'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False


