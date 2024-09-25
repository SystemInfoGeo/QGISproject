from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import Blueprint, jsonify

protected_map_bp = Blueprint('protected_map', __name__)

@protected_map_bp.route('/protected-map', methods=['GET'])
@jwt_required()
def protected_map():
    claims = get_jwt()
    role = claims.get("role")

    if role not in ["admin", "agent_collecte", "superviseur"]:
        return jsonify({"status": "error", "message": "Permission denied"}), 403

    # Logique pour envoyer les données de la carte
    return jsonify({"status": "success", "message": "Access granted to the map data"}), 200
