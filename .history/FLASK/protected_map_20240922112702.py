from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import Blueprint, jsonify

protected_map_bp = Blueprint('protected_map', __name__)

@protected_map_bp.route('/protected-map', methods=['GET'])
@jwt_required()
def protected_map():
    try:
        # Obtenez les revendications du JWT
        claims = get_jwt()
        print(f"Claims: {claims}")  # Log pour afficher les revendications du JWT

        # Récupérer le rôle de l'utilisateur
        role = claims.get("role")
        print(f"User role: {role}")  # Log pour afficher le rôle de l'utilisateur

        # Vérifiez si l'utilisateur a l'autorisation d'accéder à la carte
        if role not in ["admin", "agent_collecte", "client "]:
            print("Permission denied: User does not have the required role")  # Log si la permission est refusée
            return jsonify({"status": "error", "message": "Permission denied"}), 403

        # Logique pour envoyer les données de la carte
        print("Access granted: Sending map data to the user")  # Log pour confirmer l'accès
        response = jsonify({"status": "success", "message": "Access granted to the map data"})
        print(f"Response to be sent: {response.json}")  # Log la réponse finale
        return response

    except Exception as e:
        print(f"An error occurred: {e}")  # Log de l'exception
        return jsonify({"status": "error", "message": str(e)}), 500
