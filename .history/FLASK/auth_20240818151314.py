from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required
from models import User, db

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Clés manquantes.'}), 400

        email = data['email']
        password = data['password']

        # Vérifiez si l'utilisateur existe déjà
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'L\'utilisateur existe déjà.'}), 400

        # Créez un nouvel utilisateur
        user = User(email=email)
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Utilisateur créé avec succès.'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Clés manquantes.'}), 400

        email = data['email']
        password = data['password']

        # Récupérez l'utilisateur depuis la base de données
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=email)
            return jsonify({'access_token': access_token}), 200

        return jsonify({'message': 'Identifiants invalides.'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Accès accordé.'}), 200
