from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin', __name__)

# route pour lister tous les utilisateurs
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    users = User.query.all()
    users_data = [{"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "role": user.role} for user in users]
    return jsonify(users_data), 200


