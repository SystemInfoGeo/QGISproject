from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required
from models import User, db  # Importez User et db depuis models.py

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Données reçues pour l'inscription:", data)

    if 'email' not in data or 'password' not in data:
        print("Clés manquantes dans la requête d'inscription.")
        return jsonify({'message': 'Clés manquantes.'}), 400

    email = data['email']
    password = data['password']
    print(f"Tentative de création de l'utilisateur avec l'email: {email}")

    # Vérifiez si l'utilisateur existe déjà
    if User.query.filter_by(email=email).first():
        print(f"L'utilisateur avec l'email {email} existe déjà.")
        return jsonify({'message': 'L\'utilisateur existe déjà.'}), 400

    # Créez un nouvel utilisateur
    user = User(email=email)
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

        if user and user.check_password(password):
            access_token = create_access_token(identity=email)
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
