from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User, db
from email_validator import validate_email, EmailNotValidError  # Importer la bibliothèque de validation d'email
import logging
from flask_jwt_extended import jwt_required

# Configurer le logging pour suivre les activités de l'application
logging.basicConfig(level=logging.INFO)

# Création du blueprint pour regrouper les routes liées à l'authentification
auth_bp = Blueprint('auth', __name__)




# Route pour gérer l'inscription des utilisateurs

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json  # Recevoir les données JSON depuis la requête

    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    role = data.get('role', 'visiteur')  # Par défaut, le rôle est 'visiteur'

    if not email or not password or not first_name or not last_name or not phone_number:
        return jsonify({"error": "Tous les champs sont requis."}), 400

    try:
        valid = validate_email(email)
        email = valid.email  # Normalisation de l'email
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Cet email est déjà utilisé."}), 400

    new_user = User(
        email=email,
        password_hash=generate_password_hash(password),
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role=role
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Inscription réussie!"}), 201
    except Exception as e:
     return jsonify({"error": f"Une erreur est survenue lors de l'inscription: {str(e)}"}



# Route pour gérer l'inscription des utilisateurs
@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json  # Recevoir les données JSON depuis la requête

    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    role = data.get('role', 'visiteur')  # Par défaut, le rôle est 'visiteur'

    if not email or not password or not first_name or not last_name or not phone_number:
        return jsonify({"error": "Tous les champs sont requis."}), 400

    try:
        valid = validate_email(email)
        email = valid.email  # Normalisation de l'email
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Cet email est déjà utilisé."}), 400

    new_user = User(
        email=email,
        password_hash=generate_password_hash(password),
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role=role
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Inscription réussie!"}), 201
    except Exception as e:
        return jsonify({"error": f"Une erreur est survenue lors de l'inscription: {str(e)}"}), 500  # Correction: Ajout de la parenthèse fermante et code de statut HTTP 500


# Route pour gérer l'inscription des utilisateurs par l'administrateur
@auth_bp.route('/admin/register', methods=['POST'])
@jwt_required()  # Assurez-vous que seul un administrateur connecté peut accéder à cette route
def admin_register():
    # Récupère l'identité de l'utilisateur connecté à partir du token JWT
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    # Vérifie si l'utilisateur connecté est un administrateur
    if not current_user or current_user.role != 'administrateur':
        return jsonify({"error": "Accès non autorisé"}), 403

    # Récupère les données du formulaire (JSON)
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    role = data.get('role')  # L'administrateur choisit le rôle de l'utilisateur

    # Vérifie si tous les champs du formulaire sont remplis
    if not email or not password or not first_name or not last_name or not phone_number or not role:
        return jsonify({"error": "Tous les champs sont requis."}), 400

    # Vérifie si un utilisateur avec cet email existe déjà dans la base de données
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Cet email est déjà utilisé."}), 400

    # Crée un nouvel utilisateur avec les données fournies par l'administrateur
    new_user = User(
        email=email,
        password_hash=generate_password_hash(password),  # Hachage du mot de passe pour la sécurité
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role=role  # Le rôle est défini par l'administrateur
    )

    # Ajoute le nouvel utilisateur à la base de données et enregistre les changements
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": f'{role.capitalize()} ajouté avec succès!'}), 201



# Route pour obtenir la liste des utilisateurs
@auth_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def manage_users():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'administrateur':
        return jsonify({"error": "Accès non autorisé"}), 403

    users = User.query.all()
    user_list = [{"id": user.id, "email": user.email, "first_name": user.first_name, 
                  "last_name": user.last_name, "phone_number": user.phone_number, 
                  "role": user.role} for user in users]

    return jsonify({"users": user_list}), 200
