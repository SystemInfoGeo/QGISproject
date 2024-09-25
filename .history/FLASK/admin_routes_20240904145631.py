from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin', __name__)

# Route pour accéder à la page d'administration avec vérification du rôle admin
@admin_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_page():
    # Récupérer l'identité de l'utilisateur à partir du token JWT
    current_user = get_jwt_identity()
    print(f"Identité de l'utilisateur récupérée : {current_user}")  # Log pour vérifier l'identité

    # Rechercher l'utilisateur dans la base de données
    user = User.query.filter_by(email=current_user).first()

    # Vérifier si l'utilisateur a été trouvé et s'il a le rôle d'admin
    if user:
        print(f"Utilisateur trouvé : {user.email}, rôle : {user.role}")
    else:
        print("Utilisateur non trouvé dans la base de données.")

    if user and user.role == 'admin':
        return jsonify({"message": "Bienvenue sur la page d'administration."}), 200
    else:
        return jsonify({"error": "Accès refusé. Vous n'avez pas les droits d'administration."}), 403




# Route pour lister tous les utilisateurs, seulement accessible par un admin
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    # Récupérer l'identité de l'utilisateur à partir du token JWT
    current_user = get_jwt_identity()

    # Rechercher l'utilisateur dans la base de données
    user = User.query.filter_by(email=current_user).first()

    # Vérifier si l'utilisateur a le rôle d'admin
    if user and user.role == 'admin':
        print("Route '/users' atteinte")  # Log pour vérifier que la route est atteinte

        users = User.query.all()
        print(f"Nombre d'utilisateurs trouvés : {len(users)}")  # Log pour afficher le nombre d'utilisateurs trouvés

        users_data = [
            {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name, "role": user.role}
            for user in users
        ]
        print(f"Données des utilisateurs : {users_data}")  # Log pour vérifier les données avant de les renvoyer

        return jsonify(users_data), 200
    else:
        return jsonify({"error": "Accès refusé. Vous n'avez pas les droits d'administration."}), 403


# Route pour ajouter un nouvel utilisateur, seulement accessible par un admin
@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    # Récupérer l'identité de l'utilisateur à partir du token JWT
    current_user = get_jwt_identity()

    # Rechercher l'utilisateur dans la base de données
    user = User.query.filter_by(email=current_user).first()

    # Vérifier si l'utilisateur a le rôle d'admin
    if user and user.role == 'admin':
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
    else:
        return jsonify({"error": "Accès refusé. Vous n'avez pas les droits d'administration."}), 403
