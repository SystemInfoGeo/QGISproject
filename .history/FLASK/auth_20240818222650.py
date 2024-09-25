from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required
from models import User, db  # Importez User et db depuis models.py
from email_validator import validate_email, EmailNotValidError

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Données reçues pour l'inscription:", data)

    required_fields = ['email', 'password', 'confirm_password', 'first_name', 'last_name', 'phone_number']
    if any(field not in data for field in required_fields):
        print("Clés manquantes dans la requête d'inscription.")
        return jsonify({'message': 'Clés manquantes.'}), 400

    email = data['email']
    password = data['password']
    confirm_password = data['confirm_password']
    first_name = data['first_name']
    last_name = data['last_name']
    phone_number = data['phone_number']
    print(f"Tentative de création de l'utilisateur avec l'email: {email}")

    # Validation de l'email
    try:
        validate_email(email)
    except EmailNotValidError:
        print("Adresse e-mail invalide.")
        return jsonify({'message': 'Adresse e-mail invalide.'}), 400

    # Vérifiez si les mots de passe correspondent
    if password != confirm_password:
        print("Les mots de passe ne correspondent pas.")
        return jsonify({'message': 'Les mots de passe ne correspondent pas.'}), 400

    # Vérifiez si l'utilisateur existe déjà
    if User.query.filter_by(email=email).first():
        print(f"L'utilisateur avec l'email {email} existe déjà.")
        return jsonify({'message': 'L\'utilisateur existe déjà.'}), 400

    # Créez un nouvel utilisateur
    user = User(email=email, first_name=first_name, last_name=last_name, phone_number=phone_number)
    user.set_password(password)
    print(f"Création de l'utilisateur {email} avec mot de passe hashé.")

    try:
        db.session.add(user)
        db.session.commit()
        print(f"Utilisateur {email} créé avec succès.")
        return jsonify({'message': 'Utilisateur créé avec succès.'}), 201
    except Exception as e:
        print(f"Erreur lors de la création de l'utilisateur: {str(e)}")
        db.session.rollback()  # Annule les changements en cas d'erreur
        return jsonify({'message': 'Erreur interne du serveur.'}), 500

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Données reçues pour la connexion:", data)

        if 'email' not in data or 'password' not in data:
            print("Clés manquantes dans la requête de connexion.")
            return jsonify({'message': 'Clés manquantes.'}), 400

        email = data['email']
        password = data['password']
        print(f"Tentative de connexion pour l'utilisateur avec l'email: {email}")

        # Récupérez l'utilisateur depuis la base de données
        user = User.query.filter_by(email=email).first()
        if user:
            print(f"Utilisateur trouvé avec l'email: {email}")
        else:
            print(f"Aucun utilisateur trouvé avec l'email: {email}")
            return jsonify({'message': 'Identifiants invalides.'}), 401

        if user.check_password(password):
            access_token = create_access_token(identity={'email': email})
            print(f"Connexion réussie pour l'utilisateur avec l'email: {email}")
            return jsonify({'access_token': access_token}), 200

        print("Identifiants invalides.")
        return jsonify({'message': 'Identifiants invalides.'}), 401
    except Exception as e:
        print(f"Erreur lors de la connexion: {str(e)}")
        return jsonify({'message': 'Erreur interne du serveur.'}), 500

@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Accès accordé.'}), 200
