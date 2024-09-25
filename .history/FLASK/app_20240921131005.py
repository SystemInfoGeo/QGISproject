from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import networkx as nx
import requests
import os
import sys
import secrets
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
import openrouteservice

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

# Configurer OpenRouteService (ORS)
ORS_API_KEY = "5b3ce3597851110001cf62483c4e70786f7c460498f73f7894803c2c"  # Clé API OpenRouteService
 
client = openrouteservice.Client(key=ORS_API_KEY)
# Point de départ et point d'arrivée fixes pour le camion
Point_depart_fixe = {
    'latitude': 36.714666886023693,
    'longitude': 4.045495309895148
}

Point_arrivee_fixe = {
    'latitude': 36.706130742911107,
    'longitude': 4.012404383608166
}


# Fonction pour calculer la distance entre deux points (latitude, longitude)
def calculate_distance(point1, point2):
    return ((point2['latitude'] - point1['latitude'])**2 + (point2['longitude'] - point1['longitude'])**2)**0.5


# Fonction pour construire le graphe des points
def build_graph(points):
    graph = nx.Graph()
    positions = {}

    for i, point in enumerate(points):
        graph.add_node(i)
        positions[i] = (point['latitude'], point['longitude'])

    for u in range(len(points)):
        for v in range(u + 1, len(points)):
            distance = calculate_distance(points[u], points[v])
            graph.add_edge(u, v, weight=distance)

    return graph, positions


# Fonction pour calculer le chemin optimal en utilisant l'algorithme du voyageur de commerce
def calculate_optimal_path(graph, start_node_index, end_node_index, positions):
    try:
        nodes_to_visit = set(graph.nodes) - {start_node_index, end_node_index}
        path = [start_node_index]
        current = start_node_index

        while nodes_to_visit:
            next_node = min(nodes_to_visit, key=lambda node: graph[current][node]['weight'])
            path.append(next_node)
            nodes_to_visit.remove(next_node)
            current = next_node

        path.append(end_node_index)
        optimal_path = [positions[node] for node in path]
        return optimal_path
    except Exception as e:
        logging.error(f"Erreur lors du calcul du chemin optimal : {e}")
        return None


# Fonction pour calculer les itinéraires via l'API ORS
def calculer_itineraires_ors(optimal_path, preference='shortest', mode='driving-hgv'):
    url = f"https://api.openrouteservice.org/v2/directions/{mode}"
    headers = {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
    }

    itineraires = []

    # Calculer l'itinéraire entre chaque paire de points dans le chemin optimal
    for i in range(len(optimal_path) - 1):
        coord_depart = [optimal_path[i][1], optimal_path[i][0]]  # Longitude, Latitude
        coord_arrivee = [optimal_path[i + 1][1], optimal_path[i + 1][0]]

        data = {
            "coordinates": [coord_depart, coord_arrivee],
            "instructions": True,
            "preference": preference
        }

        try:
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()
            itineraires.append(response.json())
        except requests.exceptions.RequestException as e:
            logging.error(f"Erreur lors du calcul de l'itinéraire entre {coord_depart} et {coord_arrivee}: {e}")
            time.sleep(1)  # Attendre avant de réessayer

    return itineraires


# Route pour calculer le chemin optimal pour un camion
@app.route('/calculate-route', methods=['POST'])
def calculate_route():
    """
    Calculer l'itinéraire optimal pour un camion entre plusieurs points.
    """
    data = request.json
    coordinates = data.get('coordinates')  # Liste des points de collecte [[lon, lat], ...]

    if not coordinates or len(coordinates) < 2:
        return jsonify({'error': 'Vous devez fournir au moins deux points pour calculer un itinéraire.'}), 400

    try:
        # Ajoutez le point de départ et d'arrivée fixes
        points = [{'latitude': coord[1], 'longitude': coord[0]} for coord in coordinates]
        points = [Point_depart_fixe] + points + [Point_arrivee_fixe]

        # Construire le graphe des points
        graph, positions = build_graph(points)

        # Calculer le chemin optimal
        start_node_index = 0
        end_node_index = len(points) - 1
        optimal_path = calculate_optimal_path(graph, start_node_index, end_node_index, positions)

        if not optimal_path:
            return jsonify({"error": "Aucun chemin optimal trouvé"}), 500

        # Calculer les itinéraires via ORS
        itineraires_ors = calculer_itineraires_ors(optimal_path)

        # Sauvegarder le chemin optimal dans la base de données
        new_path = Path(optimal_path=json.dumps(optimal_path))
        db.session.add(new_path)
        db.session.commit()

        # Retourner les itinéraires calculés et le chemin optimal
        return jsonify({"status": "success", "optimal_path": optimal_path, "itineraires_ors": itineraires_ors}), 200

    except Exception as e:
        logging.error(f"Erreur lors du calcul de l'itinéraire : {str(e)}")
        return jsonify({'error': str(e)}), 50


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
