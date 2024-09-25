import os
import sys
from flask import Flask, request, jsonify
import networkx as nx
import requests
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
from sqlalchemy import text
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
    optimal_path = db.Column(db.Text, nullable=False)

# Test de connexion à la base de données
with app.app_context():
    try:
        # Test : créer une table temporaire
        with db.engine.connect() as connection:
            connection.execute(text("CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY);"))
            print("Connexion à la base de données réussie et création de table testée.")

            # Test : insérer une ligne
            connection.execute(text("INSERT INTO test_connection DEFAULT VALUES;"))
            print("Insertion réussie dans la table test_connection.")

            # Test : interroger la table
            result = connection.execute(text("SELECT * FROM test_connection;"))
            for row in result:
                print("Ligne dans test_connection :", row)

            # Optionnel : supprimer la table de test
            connection.execute(text("DROP TABLE IF EXISTS test_connection;"))
            print("Table de test supprimée.")

    except Exception as e:
        print(f"Erreur lors de la connexion ou de l'exécution des requêtes : {e}")

Point_depart_fixe = {
    'latitude': 36.714666886023693,
    'longitude': 4.045495309895148
}

Point_decharge = {
    'latitude': 36.706130742911107,
    'longitude': 4.012404383608166
}

saved_data = None
data_saved = False

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
    global saved_data, data_saved
    data = request.json
    print("Données reçues:", data)

    points = [Point_depart_fixe] + data['points'] + [Point_decharge]
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
    
    saved_data = data
    data_saved = False

    return jsonify({"status": "success", "optimal_path": optimal_path})

@app.route('/save-path', methods=['POST'])
def save_path():
    global saved_data, data_saved
    data = request.json
    optimal_path = data.get('optimal_path', [])

    if not optimal_path:
        return jsonify({"error": "Données invalides"}), 400

    # Chemin absolu pour le fichier de sauvegarde
    save_path = os.path.abspath(os.path.join(os.getcwd(), 'saved_path.txt'))
    print(f"Tentative de sauvegarde dans le fichier : {save_path}")
    try:
        with open(save_path, 'a') as file:
            file.write("Optimal Path:\n")
            for coord in optimal_path:
                file.write(f"{coord[0]}, {coord[1]}\n")
            file.write("\n---\n")
        print(f"Chemin optimal sauvegardé dans {save_path}")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde des données : {e}")

    # Sauvegarder uniquement le chemin optimal dans la base de données
    try:
        new_path = Path(optimal_path=json.dumps(optimal_path))
        db.session.add(new_path)
        db.session.commit()
        print("Chemin optimal sauvegardé dans la base de données")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde dans la base de données : {e}")
    
    saved_data = None
    data_saved = True
    
    reset_qgis_points()
    
    return jsonify({"message": "Chemin sauvegardé avec succès"}), 200

def reset_qgis_points():
    url = 'http://localhost:5001/reset-points'
    try:
        response = requests.post(url)
        if response.status_code == 200:
            print ("Notification envoyée à QGIS pour réinitialiser les points")
        else:
            print(f"Erreur lors de l'envoi de la notification à QGIS : {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi de la notification à QGIS : {e}")

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
