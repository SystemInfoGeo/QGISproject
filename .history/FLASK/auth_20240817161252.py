from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager

auth = Blueprint('auth', __name__)

# Configuration de JWT
jwt = JWTManager()

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = generate_password_hash(data['password'])
    # Enregistrez l'utilisateur dans la base de données
    # Assurez-vous que l'utilisateur n'existe pas déjà
    # ...
    return jsonify({'message': 'User created successfully.'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    # Récupérez l'utilisateur depuis la base de données
    # ...
    # Vérifiez le mot de passe
    if check_password_hash(stored_password, password):
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials.'}), 401

# Route protégée pour tester l'authentification
@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Access granted.'}), 200
