from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin', __name__)

# route pour lister tous les utilisateurs
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    print("Route '/users' atteinte")  # Log pour vérifier que la route est atteinte

    try:
        users = User.query.all()
        print(f"Nombre d'utilisateurs trouvés : {len(users)}")  # Log pour afficher le nombre d'utilisateurs trouvés

        users_data = [
            {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "role": user.role}
            for user in users
        ]
        print(f"Données des utilisateurs : {users_data}")  # Log pour vérifier les données avant de les renvoyer

        return jsonify(users_data), 200
    except Exception as e:
        print(f"Erreur lors de la récupération des utilisateurs : {str(e)}")  # Log pour capturer toute erreur
        return jsonify({"error": "Erreur lors de la récupération des utilisateurs"}), 500

# route pour ajouter un nouvel utilisateur
@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    print("Route '/users' [POST] atteinte")  # Log pour vérifier que la route est atteinte
    try:
        data = request.json
        print(f"Données reçues pour l'ajout d'utilisateur : {data}")  # Log pour vérifier les données reçues

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
        print("Nouvel utilisateur ajouté avec succès")  # Log pour confirmer l'ajout de l'utilisateur

        return jsonify({"message": "Utilisateur ajouté avec succès"}), 201
    except Exception as e:
        print(f"Erreur lors de l'ajout de l'utilisateur : {str(e)}")  # Log pour capturer toute erreur
        return jsonify({"error": "Erreur lors de l'ajout de l'utilisateur"}), 500

# route pour modifier un utilisateur existant
@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    print(f"Route '/users/{user_id}' [PUT] atteinte")  # Log pour vérifier que la route est atteinte
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        print(f"Données reçues pour la mise à jour de l'utilisateur {user_id} : {data}")  # Log pour vérifier les données reçues

        user.email = data['email']
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.phone_number = data.get('phone_number', user.phone_number)
        user.role = data['role']

        db.session.commit()
        print(f"Utilisateur {user_id} mis à jour avec succès")  # Log pour confirmer la mise à jour

        return jsonify({"message": "Utilisateur modifié avec succès"}), 200
    except Exception as e:
        print(f"Erreur lors de la mise à jour de l'utilisateur {user_id} : {str(e)}")  # Log pour capturer toute erreur
        return jsonify({"error": "Erreur lors de la mise à jour de l'utilisateur"}), 500

# route pour supprimer un utilisateur 
@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    print(f"Route '/users/{user_id}' [DELETE] atteinte")  # Log pour vérifier que la route est atteinte
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        print(f"Utilisateur {user_id} supprimé avec succès")  # Log pour confirmer la suppression

        return jsonify({"message": "Utilisateur supprimé avec succès"}), 200
    except Exception as e:
        print(f"Erreur lors de la suppression de l'utilisateur {user_id} : {str(e)}")  # Log pour capturer toute erreur
        return jsonify({"error": "Erreur lors de la suppression de l'utilisateur"}), 500

# route pour attribuer un rôle à un utilisateur
@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    print(f"Route '/users/{user_id}/role' [PUT] atteinte")  # Log pour vérifier que la route est atteinte
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        print(f"Données reçues pour la mise à jour du rôle de l'utilisateur {user_id} : {data}")  # Log pour vérifier les données reçues

        user.role = data['role']
        db.session.commit()
        print(f"Rôle de l'utilisateur {user_id} mis à jour avec succès")  # Log pour confirmer la mise à jour du rôle

        return jsonify({"message": "Rôle mis à jour avec succès"}), 200
    except Exception as e:
        print(f"Erreur lors de la mise à jour du rôle de l'utilisateur {user_id} : {str(e)}")  # Log pour capturer toute erreur
        return jsonify({"error": "Erreur lors de la mise à jour du rôle de l'utilisateur"}), 500

