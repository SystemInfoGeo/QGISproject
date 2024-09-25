from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/admin/data', methods=['GET'])
@jwt_required()  # Nécessite une authentification JWT
def get_admin_data():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403

    # Supposons que vous souhaitez renvoyer une liste d'utilisateurs
    users = User.query.all()
    users_data = [{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone_number} for user in users]
    return jsonify({"users": users_data}), 200
