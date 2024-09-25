from flask import Blueprint, request, jsonify
from models import db, User

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['POST'])
def add_user():
    data = request.json
    new_user = User(
        email=data['email'],
        password_hash=data['password_hash'],  # Assurez-vous de hasher le mot de passe avant de le stocker
        first_name=data['first_name'],
        last_name=data['last_name'],
        role=data['role']
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Utilisateur ajouté avec succès"}), 201
