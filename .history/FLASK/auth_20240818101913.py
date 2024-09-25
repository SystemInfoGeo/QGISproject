from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Vérifiez que les clés 'username' et 'password' sont présentes
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Clés manquantes.'}), 400

    username = data['username']
    password = generate_password_hash(data['password'])

    # Vérifier que l'utilisateur n'existe pas déjà
    user = User.query.filter_by(username=username).first()
    if user:
        return jsonify({'message': 'Utilisateur déjà existant.'}), 400

    # Enregistrer l'utilisateur dans la base de données
    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Utilisateur créé avec succès.'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Vérifiez que les clés 'username' et 'password' sont présentes
    if 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Clés manquantes.'}), 400

    username = data['username']
    password = data['password']

    # Récupérer l'utilisateur depuis la base de données
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Identifiants invalides.'}), 401

@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return jsonify({'message': 'Accès accordé.'}), 200
