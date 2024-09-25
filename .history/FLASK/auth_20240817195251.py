from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager

auth = Blueprint('auth', __name__)

# Configuration de JWT
jwt = JWTManager()

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Vérifiez que les clés 'username' et 'password' sont présentes
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Clés manquantes.'}), 400

    username = data['username']
    password = generate_password_hash(data['password'])

    # Enregistrez l'utilisateur dans la base de données
    # Assurez-vous que l'utilisateur n'existe pas déjà
    # ...

    return jsonify({'message': 'Utilisateur créé avec succès.'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Vérifiez que les clés 'username' et 'password' sont présentes
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Clés manquantes.'}), 400

    username = data['username']
    password = data['password']

    # Récupérez l'utilisateur depuis la base de données
    # Assurez-vous que l'utilisateur existe et récupérez le mot de passe stocké
    # Remplacez cette ligne par la logique pour récupérer l'utilisateur
    # Exemple: user = User.query.filter_by(username=username).first()
    stored_password = None  # Remplacez par le mot de passe stocké pour l'utilisateur

    if stored_password and check_password_hash(stored_password, password):
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Identifiants invalides.'}), 401

# Route protégée pour tester l'authentification
@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Accès accordé.'}), 200
