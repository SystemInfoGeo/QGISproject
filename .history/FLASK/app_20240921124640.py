from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import networkx as nx
import requests
import os
import sys
import secrets
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, get_jwt
import json
from models import db, User
from config import Config
from flask_cors import CORS
from contact_api import contact_bp, init_mail   # Importer le Blueprint de contact_api.py
from protected_map import protected_map_bp
from admin_routes import admin_bp
from dotenv import load_dotenv
from auth import auth_bp
from message_routes import message_bp
from trash_routes import trash_bp
import logging
import time
from models import TrashBin

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Assurez-vous que l'encodage par défaut est UTF-8
if sys.getdefaultencoding() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')


# Créer l'application Flask
app = Flask(__name__)

# Configurer la clé secrète depuis les variables d'environnement
app.secret_key = os.getenv('SECRET_KEY')

app.config.from_object(Config)  # Charger la configuration depuis config.py

# Configurations de l'application
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')  # Clé secrète pour JWT

# Initialisation des extensions
migrate = Migrate(app, db)
jwt = JWTManager(app)

CORS(app, supports_credentials=True)  # Assurez-vous d'autoriser les cookies ou jetons d'authentification

# Appliquez CORS à toute l'application pour autoriser les requêtes depuis localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
# Initialisez db avec l'application Flask
db.init_app(app)

# Initialisez Flask-Mail avec l'application Flask
init_mail(app)

# Enregistrer les Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(contact_bp)  # Enregistrement du Blueprint de contact_api.py
app.register_blueprint(protected_map_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(message_bp)
app.register_blueprint(trash_bp)

# Activer les Cross-Origin Resource Sharing (CORS) si nécessaire pour Next.js
CORS(app)


# Configuration de la base de données PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://<username>:<password>@localhost/<database_name>'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy
db = SQLAlchemy(app)

# Importer le Blueprint pour les routes liées aux poubelles
from trash_routes import trash_bp

# Enregistrer le blueprint
app.register_blueprint(trash_bp, url_prefix='/api')

# Configurer OpenRouteService (ORS)
ORS_API_KEY = "5b3ce3597851110001cf62483c4e70786f7c460498f73f7894803c2c"  # Clé API OpenRouteService
 
import openrouteservice

client = openrouteservice.Client(key=ORS_API_KEY)


@app.route('/calculate-route', methods=['POST'])
def calculate_route():
    """
    Calculer l'itinéraire optimal pour un camion entre plusieurs points.
    """
    data = request.json
    coordinates = data.get('coordinates')  # [[lon1, lat1], [lon2, lat2], ...]

    if not coordinates or len(coordinates) < 2:
        return jsonify({'error': 'Vous devez fournir au moins deux points pour calculer un itinéraire.'}), 400

    try:
        # Calculer l'itinéraire avec OpenRouteService pour les camions (driving-hgv)
        route = client.directions(
            coordinates,
            profile='driving-hgv',  # Transport camion
            format='geojson',        # Format GeoJSON
            optimize_waypoints=True   # Optimisation de l'ordre des points
        )
        
        # Retourner l'itinéraire calculé
        return jsonify(route), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Route pour récupérer le profil de l'utilisateur connecté
@app.route('/user/profile', methods=['GET'])
@jwt_required()
def user_profile():
    try:
        current_user_email = get_jwt_identity()  # Obtenir l'email depuis le token
        if not current_user_email:
            print("JWT Identity not found", flush=True)
            return jsonify({'error': 'Token JWT invalide ou expiré'}), 401

        print(f"JWT Identity: {current_user_email}", flush=True)

        # Rechercher l'utilisateur dans la base de données par email
        user = User.query.filter_by(email=current_user_email).first()

        if user:
            return jsonify({
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'role': user.role  # Récupérer le rôle depuis la base de données
            }), 200
        else:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404

    except Exception as e:
        print(f"Erreur lors de l'exécution de la route : {str(e)}", flush=True)
        return jsonify({'error': 'Erreur serveur'}), 500





if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
