from flask import Blueprint, request, jsonify

# Créer un blueprint pour les routes utilisateur
user_bp = Blueprint('users', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    users = [
        {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'role': 'admin'},
        {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'role': 'user'},
    ]
    return jsonify(users)

@user_bp.route('/users', methods=['POST'])
def add_user():
    new_user = request.json
    # Logique pour ajouter l'utilisateur à la base de données
    return jsonify({"message": "User added successfully"}), 201

@user_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    updated_user = request.json
    # Logique pour mettre à jour l'utilisateur dans la base de données
    return jsonify({"message": "User updated successfully"})

@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Logique pour supprimer l'utilisateur de la base de données
    return jsonify({"message": "User deleted successfully"})

