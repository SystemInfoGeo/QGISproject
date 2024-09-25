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




# route pour ajouter un nouvel utilisateur
@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    data = request.json
    new_user = User(
        email=data['email'],
        password_hash=data['password_hash'],  # Note: Vous devrez normalement hasher le mot de passe avant de le stocker
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone_number=data.get('phone_number'),
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Utilisateur ajouté avec succès"}), 201



# route pour modifier un utilisateur existant
@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json

    user.email = data['email']
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.phone_number = data.get('phone_number', user.phone_number)
    user.role = data['role']

    db.session.commit()
    return jsonify({"message": "Utilisateur modifié avec succès"}), 200




# route pour supprimer un utilisateur 
@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Utilisateur supprimé avec succès"}), 200



#route pour attribuer un rôle à un utilisateur
@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.role = data['role']
    db.session.commit()
    return jsonify({"message": "Rôle mis à jour avec succès"}), 200


