from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin', __name__)

# Définir une fonction pour vérifier si l'utilisateur est un administrateur
def admin_only():
    # Assurez-vous que get_jwt_identity() retourne uniquement l'email
    current_user_email = get_jwt_identity()  # Cela devrait être une chaîne, pas un dictionnaire
    if isinstance(current_user_email, dict):
        current_user_email = current_user_email.get('email')  # Extraire l'email si c'est un dictionnaire

    current_user = User.query.filter_by(email=current_user_email).first()

    # Vérifier si l'utilisateur a le rôle 'admin'
    if not current_user or current_user.role != 'admin':
        return jsonify({"error": "Vous n'êtes pas autorisé à effectuer cette action"}), 403

# Route pour lister tous les utilisateurs (accessible à tous les utilisateurs authentifiés)
@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    print("Route '/users' atteinte")  # Log pour vérifier que la route est atteinte

    users = User.query.all()
    print(f"Nombre d'utilisateurs trouvés : {len(users)}")  # Log pour afficher le nombre d'utilisateurs trouvés

    users_data = [
        {"id": user.id, "email": user.email, "first_name": user.first_name, "last_name": user.last_name,  "phone_number": user.phone_number, "role": user.role}
        for user in users
    ]
    print(f"Données des utilisateurs : {users_data}")  # Log pour vérifier les données avant de les renvoyer

    return jsonify(users_data), 200



# Route pour ajouter un nouvel utilisateur (accessible uniquement aux administrateurs)
@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def add_user():
    admin_check = admin_only()  # Vérifier que seul l'admin peut ajouter des utilisateurs
    if admin_check:
        return admin_check  # Retourner la réponse d'erreur si l'utilisateur n'est pas autorisé
    
    try:
        data = request.json
        print(f"Requête reçue pour ajout d'utilisateur : {data}")  # Log pour afficher les données reçues

        # Vérifier si toutes les données requises sont présentes
        if not all(key in data for key in ('email', 'first_name', 'last_name', 'password', 'role')):
            return jsonify({"error": "Champs manquants"}), 400  # Erreur 400 si des champs sont manquants

        # Vérifier si l'email est déjà utilisé
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "Cet email est déjà utilisé."}), 400

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

        return jsonify({
            "message": "Utilisateur ajouté avec succès",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "first_name": new_user.first_name,
                "last_name": new_user.last_name,
                "role": new_user.role
            }
        }), 201

    except Exception as e:
        # En cas d'erreur, renvoyer une réponse avec le message d'erreur
        print(f"Erreur lors de l'ajout de l'utilisateur : {str(e)}")  # Log de l'erreur
        return jsonify({"error": f"Erreur lors de l'ajout de l'utilisateur: {str(e)}"}), 500



# Route pour modifier un utilisateur (accessible uniquement aux administrateurs)
@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    admin_check = admin_only()  # Vérifier que seul l'admin peut modifier des utilisateurs
    if admin_check:
        return admin_check  # Retourner la réponse d'erreur si l'utilisateur n'est pas autorisé
    
    try:
        user = User.query.get_or_404(user_id)
        data = request.json
        print(f"Requête reçue pour modification d'utilisateur : {data}")  # Log pour afficher les données reçues

        # Vérification de l'unicité de l'email lors de la modification
        if 'email' in data and User.query.filter(User.email == data['email'], User.id != user_id).first():
            return jsonify({"error": "Cet email est déjà utilisé."}), 400
        # Mise à jour des champs avec des logs pour chaque modification
        if 'email' in data:
            print(f"Modification de l'email de {user.email} à {data['email']}")
            user.email = data['email']

        if 'first_name' in data:
            print(f"Modification du prénom de {user.first_name} à {data['first_name']}")
            user.first_name = data['first_name']

        if 'last_name' in data:
            print(f"Modification du nom de {user.last_name} à {data['last_name']}")
            user.last_name = data['last_name']

        if 'phone_number' in data:
            print(f"Modification du numéro de téléphone de {user.phone_number} à {data['phone_number']}")
            user.phone_number = data['phone_number']

        if 'role' in data:
            print(f"Modification du rôle de {user.role} à {data['role']}")
            user.role = data['role']

        if 'password' in data:
            print(f"Modification du mot de passe pour l'utilisateur {user.email}")
            user.password_hash = generate_password_hash(data['password'])

        # Sauvegarder les modifications dans la base de données
        db.session.commit()

        return jsonify({
            "message": "Utilisateur modifié avec succès",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role
            }
        }), 200

    except Exception as e:
        print(f"Erreur lors de la modification de l'utilisateur : {str(e)}") 
        return jsonify({"error": f"Erreur lors de la modification de l'utilisateur: {str(e)}"}), 500



# Route pour supprimer un utilisateur (accessible uniquement aux administrateurs)
@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    admin_check = admin_only()  # Vérifier que seul l'admin peut supprimer des utilisateurs
    if admin_check:
        return admin_check  # Retourner la réponse d'erreur si l'utilisateur n'est pas autorisé
    
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "Utilisateur supprimé avec succès"}), 200

    except Exception as e:
        print(f"Erreur lors de la suppression de l'utilisateur : {str(e)}")  # Log de l'erreur
        return jsonify({"error": f"Erreur lors de la suppression de l'utilisateur: {str(e)}"}), 500



  #route pour  récupérer les informations
  # de l'administrateur actuellement connecté       
@admin_bp.route('/admin/profile', methods=['GET'])
@jwt_required()
def admin_profile():
    # Obtenir l'email de l'utilisateur connecté via JWT
    current_user_email = get_jwt_identity()
    
    # Rechercher l'utilisateur dans la base de données avec cet email
    admin = User.query.filter_by(email=current_user_email).first()

    if admin:
        return jsonify({
            'email': admin.email,
            'first_name': admin.first_name,
            'last_name': admin.last_name,
            'phone_number': admin.phone_number,
            'role': admin.role
        }), 200
    else:
        return jsonify({'error': 'Administrateur non trouvé'}), 404