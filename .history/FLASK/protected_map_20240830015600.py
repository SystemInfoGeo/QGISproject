from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from flask import jsonify

@app.route('/protected-map', methods=['GET'])
@jwt_required()
def protected_map():
    claims = get_jwt()
    role = claims.get("role")

    if role not in ["admin", "agent_collecte", "superviseur"]:
        return jsonify({"status": "error", "message": "Permission denied"}), 403

    # Logique pour envoyer les données de la carte
    return jsonify({"status": "success", "message": "Access granted to the map data"}), 200
