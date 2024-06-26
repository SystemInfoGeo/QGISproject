from flask import Flask, request, jsonify
import networkx as nx
import requests

app = Flask(__name__)  # Corrigé ici

# On va spécifier le point de départ (un point fixe)
Point_depart_fixe = {
    'latitude': 36.714666886023693,
    'longitude': 4.045495309895148
}


# On va calculer la distance euclidienne entre deux points
def calculate_distance(point1, point2):
    distance = ((point2['latitude'] - point1['latitude'])**2 + (point2['longitude'] - point1['longitude'])**2)**0.5
    return distance

# envoyer les données vers Next.js
def inform_nextjs(data):
    url = 'http://localhost:3000/api/updateStatus'  # Assurez-vous que l'URL est correcte
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        print("Succès de l'envoi des données à Next.js")    
    else:
        print("Erreur lors de l'envoi des données à Next.js:", response.status_code, response.text)








# Route pour reçevoir les données envoyées dans la requette http par QGIS
@app.route('/data', methods=['POST'])
def receive_data():
    # Récupérer les données envoyées dans la requête HTTP
    data = request.json
    print("Données reçues:", data)

    # On va ajouter le point de départ aux points
    points = [Point_depart_fixe] + data['points']
    
    # Construire le graphe (le réseau de points) à partir des données reçues
    graph, positions = build_graph(points)
    print("Graphe construit:", graph.nodes, graph.edges)

    # Calculer le chemin optimal

    start_node_index = 0  # Le point de départ est toujours le premier point (index 0)
    optimal_path = calculate_optimal_path(graph, start_node_index, positions)
    print("Chemin optimal:", optimal_path)
    if not optimal_path:
        return jsonify({"status": "error", "message": "Aucun chemin trouvé entre le point de départ et le point d'arrivée"}), 404


    # Envoi le chemin optimal  à Next.js
    data['optimal_path'] = optimal_path
    inform_nextjs(data)


    # Renvoyer une réponse au client avec le chemin optimal calculé
    return jsonify({"status": "success", "optimal_path": optimal_path})

# la fonction pour construire le graphe des points 
def build_graph(points):
    # Créer un graphe vide
    graph = nx.Graph()
    positions = {}
   
    # Ajouter les nœuds (points)au graphe
    for i, point in enumerate(points):
        graph.add_node(i) 
        positions[i] = (point['latitude'], point['longitude'])
    
    # Ajouter les arêtes (connexions) pondérées au graphe
    for u in range(len(points)):
        for v in range(u + 1, len(points)):
            distance = calculate_distance(points[u], points[v])
            print(f"Distance entre les points {u} et {v} : {distance}")  # On affiche la distance calculée
            graph.add_edge(u, v, weight=distance)
    
    return graph, positions 


# la fonciton pour calculer le chemin optimal 
def calculate_optimal_path(graph, start_node_index, positions):
    try:
        path = [start_node_index]
        current = start_node_index
        nodes = set(graph.nodes) - {start_node_index}

        while nodes:
            next_node = min(nodes, key=lambda node: graph[current][node]['weight'])
            path.append(next_node)
            nodes.remove(next_node)
            current = next_node

        path.append(start_node_index)  # Revenir au point de départ
        optimal_path = [positions[node] for node in path]
        return optimal_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True)
