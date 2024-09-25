import os
import sys
import secrets
from flask import Flask, request, jsonify, render_template
import networkx as nx
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import json
from models import db, User
from config import Config
from auth import auth
from flask_cors import CORS

# Assurez-vous que l'encodage par défaut est UTF-8
if sys.getdefaultencoding() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Création de l'application Flask
app = Flask(__name__)
app.config.from_object(Config)

# Génération et configuration de la clé JWT secrète
app.config['JWT_SECRET_KEY'] = secrets.token_urlsafe(32)

jwt = JWTManager(app)

CORS(app)  # Permettre les requêtes cross-origin

db.init_app(app)  # Initialisez db avec l'application Flask
migrate = Migrate(app, db)

# Enregistrez le Blueprint d'authentification
app.register_blueprint(auth)

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

# Route pour le tableau de bord de l'administrateur
@app.route('/admin', methods=['GET', 'POST'])
@jwt_required()  # Nécessite une authentification JWT
def admin_dashboard():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403

    if request.method == 'POST':
        data = request.form
         # Ajout des logs pour le débogage
        print("Données reçues du formulaire : ", data)
        print("Email : ", data.get('email'))
        print("Prénom : ", data.get('first_name'))
        print("Nom : ", data.get('last_name'))
        print("Téléphone : ", data.get('phone_number'))
        print("Mot de passe : ", data.get('password'))

        try:
            new_user = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                phone_number=data['phone_number'],
                role='agent'  # Par défaut, le nouvel utilisateur est un agent
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "Nouvel agent inscrit avec succès."}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Si la méthode est GET, afficher le tableau de bord admin
    return render_template('admin_dashboard.html')
    @app.route('/admin/data', methods=['GET'])
@jwt_required()  # Nécessite une authentification JWT
def get_admin_data():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403

    # Supposons que vous souhaitez renvoyer une liste d'utilisateurs
    users = User.query.all()
    users_data = [{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone_number} for user in users]
    return jsonify({"users": users_data}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
