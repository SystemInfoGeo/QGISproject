from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify,make_response
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, unset_jwt_cookies, jwt_required
from models import User, db
from email_validator import validate_email, EmailNotValidError  # Importer la bibliothèque de validation d'email
import logging

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
    role = data.get('role')  # Aucun rôle par défaut

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
        role=role  # Le rôle peut être vide ou nul, et sera assigné plus tard
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Inscription réussie!"}), 201
    except Exception as e:
        return jsonify({"error": f"Une erreur est survenue lors de l'inscription: {str(e)}"})


# Route pour gérer la connexion des utilisateurs
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email et mot de passe sont requis."}), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Email ou mot de passe incorrect."}), 401

    access_token = create_access_token(identity=user.email)

    return jsonify({
        "message": "Connexion réussie!",
        "token": access_token,
        "role": user.role
    }), 200


# Route de déconnexion
@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"message": "Déconnexion réussie"})
    unset_jwt_cookies(response)  # Supprimer le cookie JWT
    return response, 200


# Route pour vérifier l'état de connexion
@auth_bp.route('/check_login', methods=['GET'])
@jwt_required() 
def check_login():
    # Vérifiez si la clé 'user' est dans la session
    if 'user' in session:
        return jsonify({
            "logged_in": True,
            "role": session['user']['role']  # Retourner également le rôle de l'utilisateur
        })
    return jsonify({"logged_in": False})
