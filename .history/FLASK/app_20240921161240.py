from flask import Flask, jsonify
import openrouteservice
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

app = Flask(__name__)

# Récupérer la clé API OpenRouteService depuis les variables d'environnement
ORS_API_KEY = os.getenv('ORS_API_KEY')

if ORS_API_KEY is None:
    raise ValueError("Clé API OpenRouteService non trouvée. Assurez-vous qu'elle est définie dans le fichier .env")

# Créer un client OpenRouteService avec la clé API
client = openrouteservice.Client(key=ORS_API_KEY)

# Exemple simple de requête ORS pour vérifier que l'API fonctionne
@app.route('/test-route', methods=['GET'])
def test_route():
    # Coordonnées de deux points de test (latitude, longitude)
    coords = [[4.045495309895148, 36.71466688602369], [4.012404383608166, 36.70613074291111]]
    
    try:
        # Faire une requête à l'API pour obtenir l'itinéraire entre ces deux points
        routes = client.directions(
            coordinates=coords,
            profile='driving-car',  # Choisissez un profil comme 'driving-car', 'walking', etc.
            format='geojson'
        )
        # Retourner les résultats en JSON
        return jsonify(routes)
    except openrouteservice.exceptions.ApiError as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
