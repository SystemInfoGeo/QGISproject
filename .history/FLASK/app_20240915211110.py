import os
import sys
import secrets
from flask import Flask, request, jsonify
import networkx as nx
import requests
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
import logging
import time
from models import TrashBin
from notification_routes import notification_bp


# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Assurez-vous que l'encodage par défaut est UTF-8
if sys.getdefaultencoding() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Création de l'application Flask
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
app.register_blueprint(notification_bp)


# Définition du modèle pour la table paths
class Path(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    optimal_path = db.Column(db.Text, nullable=False)

Point_depart_fixe = {
    'latitude': 36.714666886023693,
    'longitude': 4.045495309895148
}

Point_decharge = {
    'latitude': 36.706130742911107,
    'longitude': 4.012404383608166
}

# Fonction pour calculer la distance entre deux points
def calculate_distance(point1, point2):
    return ((point2['latitude'] - point1['latitude'])**2 + (point2['longitude'] - point1['longitude'])**2)**0.5

# Fonction pour informer Next.js du statut
def inform_nextjs(data):
    url = 'http://localhost:3000/api/updateStatus'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        print("Succès de l'envoi des données à Next.js")
    else:
        print("Erreur lors de l'envoi des données à Next.js:", response.status_code, response.text)

# Route pour recevoir les données et calculer le chemin optimal
@app.route('/data', methods=['POST'])
def receive_data():
    data = request.json
    print("Données reçues:", data)

    points = [Point_depart_fixe] + data.get('points', []) + [Point_decharge]
    if not points:
        return jsonify({"status": "error", "message": "Aucun point reçu"}), 400
    
    graph, positions = build_graph(points)
    print("Graphe construit:", graph.nodes, graph.edges)

    start_node_index = 0
    end_node_index = len(points) - 1
    optimal_path = calculate_optimal_path(graph, start_node_index, end_node_index, positions)
    print("Chemin optimal:", optimal_path)
    
    if not optimal_path:
        return jsonify({"status": "error", "message": "Aucun chemin trouvé entre le point de départ et le point d'arrivée"}), 404

    data['optimal_path'] = optimal_path
    inform_nextjs(data)
    
    # Sauvegarder le chemin optimal dans la base de données après le calcul
    try:
        new_path = Path(optimal_path=json.dumps(optimal_path))
        db.session.add(new_path)
        db.session.commit()
        print("Chemin optimal sauvegardé dans la base de données")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde dans la base de données : {e}")
        return jsonify({"error": "Erreur lors de la sauvegarde dans la base de données"}), 500

    return jsonify({"status": "success", "optimal_path": optimal_path})

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
            print(f"Distance entre les points {u} et {v} : {distance}")
            graph.add_edge(u, v, weight=distance)
    
    return graph, positions

# Fonction pour calculer le chemin optimal
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
        print(f"An error occurred: {e}")
        return None


# Route pour récupérer tous les chemins optimaux stockés
@app.route('/get_optimal_paths', methods=['GET'])
def get_optimal_paths():
    try:
        paths = Path.query.all()
        optimal_paths = [{"id": path.id, "optimal_path": json.loads(path.optimal_path)} for path in paths]
        return jsonify({"optimal_paths": optimal_paths}), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des chemins optimaux : {e}")
        return jsonify({"error": str(e)}), 500



# Route pour l'ajout de points/poubelles dans la base de données
@app.route('/add-trash-bin', methods=['POST'])
def add_trash_bin():
    try:
        data = request.json  # Recevoir les données en format JSON depuis Next.js
        name = data.get('name')  # Récupérer le nom
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        status = data.get('status', 'vide')  # Par défaut 'vide'

        # Vérifier si name, latitude, et longitude sont présents
        if not name or not latitude or not longitude:
            return jsonify({"error": "Le nom et les coordonnées (latitude et longitude) sont requis"}), 400

        # Créer une nouvelle poubelle
        new_bin = TrashBin(
            name=name,
            latitude=latitude,
            longitude=longitude,
            status=status
        )

        # Ajouter la poubelle à la base de données
        db.session.add(new_bin)
        db.session.commit()

        return jsonify({"message": "Point de collecte ajouté avec succès"}), 201
    except Exception as e:
        print(f"Erreur lors de l'ajout du point de collecte : {e}")  # Afficher l'erreur complète
        return jsonify({"error": str(e)}), 500



# Route pour récupérer tous les points de collecte
@app.route('/get_all-trash-bins', methods=['GET'])
def get_all_trash_bins():
    try:
        # Récupérer toutes les poubelles
        trash_bins = TrashBin.query.all()
        trash_data = [{
            'id': bin.id,
            'name': bin.name,  # Ajoutez le nom ici
            'latitude': bin.latitude,
            'longitude': bin.longitude,
            'status': bin.status,
            'last_collected': bin.last_collected
        } for bin in trash_bins]

        return jsonify(trash_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




#Route pour modifier un point de collecte
@app.route('/update-trash-bin/<int:id>', methods=['PUT'])
def update_trash_bin(id):
    try:
        data = request.json
        trash_bin = TrashBin.query.get(id)
        if not trash_bin:
            return jsonify({"error": "Poubelle non trouvée"}), 404

        trash_bin.name = data.get('name', trash_bin.name)
        trash_bin.latitude = data.get('latitude', trash_bin.latitude)
        trash_bin.longitude = data.get('longitude', trash_bin.longitude)
        trash_bin.status = data.get('status', trash_bin.status)

        db.session.commit()
        return jsonify({"message": "Poubelle mise à jour avec succès"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#Route pour supprimer un point de collecte
@app.route('/delete-trash-bin/<int:id>', methods=['DELETE'])
def delete_trash_bin(id):
    try:
        trash_bin = TrashBin.query.get(id)
        if not trash_bin:
            return jsonify({"error": "Poubelle non trouvée"}), 404

        db.session.delete(trash_bin)
        db.session.commit()
        return jsonify({"message": "Poubelle supprimée avec succès"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

        




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