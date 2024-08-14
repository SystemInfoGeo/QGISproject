
from flask import Flask, request, jsonify
import networkx as nx
import requests
import os

app = Flask(__name__)

Point_depart_fixe = {
    'latitude': 36.714666886023693,
    'longitude': 4.045495309895148
}

Point_decharge = {
    'latitude': 36.706130742911107,
    'longitude': 4.012404383608166
}


# ici on va ajouter une variable qui va nous permettre de suivre l'etat des données( pour l'envoi des données(chemin)de l'interface collect de next.js vers flask pour les sauvegrader)
saved_data = None
data_saved = False


def calculate_distance(point1, point2):
    distance = ((point2['latitude'] - point1['latitude'])**2 + (point2['longitude'] - point1['longitude'])**2)**0.5
    return distance

def inform_nextjs(data):
    url = 'http://localhost:3000/api/updateStatus'
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status
        print("Succès de l'envoi des données à Next.js")
    except request.RequestException as e:
        print(f"Erreur lors de l'envoi des données à Next.js: {e}")
        

@app.route('/data', methods=['POST'])
def receive_data():
    global saved_data, data_saved
    data = request.json
    print("Données reçues:", data)
    
    #validation des données
    if 'points' not in data or not all('latitude' in point and 'longitude' in point for point in data['points']):
        return jsonify({"status": "error", "message": "Invalid data format"}), 400

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
    
    saved_data = data #pour enregistrer les données
    data_saved = False #pour marquer que les données ne sont pas encore sauvegardées

    return jsonify({"status": "success", "optimal_path": optimal_path})

# on va sauvegarder les données envoyées pas next.js dans un fichier.txt
@app.route('/save-path', methods=['POST'])
def save_path():
    global saved_data, data_saved
    data = request.json
    points = data.get('points', [])
    optimal_path = data.get('optimal_path', [])

    if not points or not optimal_path:
        return jsonify({"error": "Invalid data"}), 400

    # Sauvegarder les données dans un fichier .txt
    save_path = os.path.join(os.getcwd(), 'saved_path.txt')
    with open(save_path, 'w') as file:
        file.write("Points:\n")
        for point in points:
            file.write(f"{point['latitude']}, {point['longitude']}\n")
        file.write("\nOptimal Path:\n")
        for coord in optimal_path:
            file.write(f"{coord[0]}, {coord[1]}\n")

    # Effacer les données sauvegardées et marquer comme sauvegardées
    saved_data = None
    data_saved = True
    
    #aprés avoir sauvegarder ces données on envoie une requette vers QGIS pour réinitialiser l'éetat des points (les remettre en vers)
    reset_qgis_points()
    
    return jsonify({"message": "Path saved successfully"}),200


def reset_qgis_points():
    url = 'http://localhost:5001/reset-points'    #url de l'api de qgis pour initialiser la couleur des points devenues rouges 
    try:
        response = request.post(url)
        response
        if response.statut.code == 200:
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
    app.run(debug=True)



