
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


# ici on va ajouter une variable qui va nous permettre de suivre l'etat des données 
saved_data = None
def calculate_distance(point1, point2):
    distance = ((point2['latitude'] - point1['latitude'])**2 + (point2['longitude'] - point1['longitude'])**2)**0.5
    return distance

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

    points = [Point_depart_fixe] + data['points'] + [Point_arrivee_fixe]
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
