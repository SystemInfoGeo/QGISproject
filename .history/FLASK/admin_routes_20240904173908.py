from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin', __name__)

# route pour lister tous les utilisateurs
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    print("Route '/users' atteinte")  # Log pour vérifier que la route est atteinte

    users = User.query.all()
    print(f"Nombre d'utilisateurs trouvés : {len(users)}")  # Log pour afficher le nombre d'utilisateurs trouvés

    users_data = [
        {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "role": user.role}
        for user in users
    ]
    print(f"Données des utilisateurs : {users_data}")  # Log pour vérifier les données avant de les renvoyer

    return jsonify(users_data), 200

# route pour ajouter un nouvel utilisateur
@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    try:
        data = request.json
        print(f"Requête reçue pour ajout d'utilisateur : {data}")  # Log pour afficher les données reçues

        # Vérifier si toutes les données requises sont présentes
        if not all(key in data for key in ('email', 'first_name', 'last_name', 'password', 'role')):
            return jsonify({"error": "Champs manquants"}), 400  # Erreur 400 si des champs sont manquants

        # Hachage du mot de passe avant de le stocker
        password_hash = generate_password_hash(data['password'])

        # Créer un nouvel utilisateur
        new_user = User(
            email=data['email'],
            password_hash=password_hash,  # Stocker le mot de passe haché
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data.get('phone_number'),  
            role=data['role']
        )
        
        # Ajouter l'utilisateur à la base de données
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Utilisateur ajouté avec succès"}), 201

    except Exception as e:
        # En cas d'erreur, renvoyer une réponse avec le message d'erreur
        print(f"Erreur lors de l'ajout de l'utilisateur : {str(e)}")  # Log de l'erreur
        return jsonify({"error": f"Erreur lors de l'ajout de l'utilisateur: {str(e)}"}), 500



# Route pour modifier un utilisateur
@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        print(f"Requête reçue pour modification d'utilisateur : {data}")  # Log pour afficher les données reçues

        # Mise à jour des champs
        if 'email' in data:
            user.email = data['email']
        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'phone_number' in data:
            user.phone_number = data['phone_number']
        if 'role' in data:
            user.role = data['role']
        if 'password' in data:
            user.password_hash = generate_password_hash(data['password'])

        # Sauvegarder les modifications dans la base de données
        db.session.commit()

        return jsonify({"message": "Utilisateur modifié avec succès"}), 200

    except Exception as e:
        print(f"Erreur lors de la modification de l'utilisateur : {str(e)}")  # Log de l'erreur
        return jsonify({"error": f"Erreur lors de la modification de l'utilisateur: {str(e)}"}), 500



# Route pour supprimer un utilisateur
@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "Utilisateur supprimé avec succès"}), 200

    except Exception as e:
        print(f"Erreur lors de la suppression de l'utilisateur : {str(e)}")  # Log de l'erreur
        return jsonify({"error": f"Erreur lors de la suppression de l'utilisateur: {str(e)}"}), 500
