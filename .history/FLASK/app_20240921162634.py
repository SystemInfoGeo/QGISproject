from flask import Flask, jsonify
import openrouteservice
from dotenv import load_dotenv
import os
import json
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
# Exemple simple de requête ORS pour vérifier que l'API fonctionne
@app.route('/test-route', methods=['GET'])
def test_route():
    coords = [[4.045495309895148, 36.71466688602369], [4.012404383608166, 36.70613074291111]]
    
    try:
        routes = client.directions(
            coordinates=coords,
            profile='driving-car',
            format='geojson'
        )
        
        # Imprimer la structure complète des itinéraires pour le débogage
        print(json.dumps(routes, indent=2))  # Ceci imprime les résultats JSON dans la console
        
        # Vérifiez si la clé 'routes' existe dans la réponse
        if 'routes' not in routes:
            return jsonify({'error': "La clé 'routes' est manquante dans la réponse de l'API."}), 500
        
        # Assurez-vous que la structure est correcte
        distance = routes['routes'][0]['summary']['distance']
        duration = routes['routes'][0]['summary']['duration']
        
        return jsonify({
            'distance_totale (mètres)': distance,
            'duree_totale (secondes)': duration,
            'itineraire': routes
        })
        
    except openrouteservice.exceptions.ApiError as e:
        return jsonify({'error': str(e)}), 400
    except KeyError as e:
        # Gestion de l'erreur KeyError
        return jsonify({'error': f"Clé manquante dans la réponse : {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
