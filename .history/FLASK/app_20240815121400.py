import os
import sys
from flask import Flask, request, jsonify
import networkx as nx
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
import json

# Assurez-vous que l'encodage par défaut est UTF-8
if sys.getdefaultencoding() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Définition du modèle pour la table paths
class Path(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    optimal_path = db.Column(db.JSON, nullable=False)  # Utilisation du type JSON pour stocker directement les listes de coordonnées

Point_depart_fixe = {
    'latitude': 36.714666886023693,
    'longitude': 4.045495309895148
}

Point_decharge = {
    'latitude': 36.706130742911107,
    'longitude': 4.012404383608166
}

def calculate_distance(point1, point2):
    return ((point2['latitude'] - point1['latitude'])**2 + (point2['longitude'] - point1['longitude'])**2)**0.5

def inform_nextjs(data):
    url = 'http://localhost:3000/api/updateStatus'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        print("Succès de l'envoi des données à Next.js")
    else:
        print("Erreur lors de l'envoi des données à Next.js:", response.status_code, response.text)

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
        new_path = Path(optimal_path=optimal_path)  # Utilisation de la liste directement
        db.session.add(new_path)
        db.session.commit()
        print("Chemin optimal sauvegardé dans la base de données")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde dans la base de données : {e}")
        return jsonify({"error": "Erreur lors de la sauvegarde dans la base de données"}), 500

    return jsonify({"status": "success", "optimal_path": optimal_path})

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

def calculate_optimal_path(graph, start_node_index, end_node_index, positions):
    try:
        # Calcul du chemin optimal avec Dijkstra
        path = nx.dijkstra_path(graph, start_node_index, end_node_index, weight='weight')
        optimal_path = [positions[node] for node in path]
        return optimal_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

@app.route('/get_optimal_paths', methods=['GET'])
def get_optimal_paths():
    try:
        paths = Path.query.all()
        optimal_paths = [{"id": path.id, "optimal_path": path.optimal_path} for path in paths]
        return jsonify({"optimal_paths": optimal_paths}), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des chemins optimaux : {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
