from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin_bp', __name__)

# Route pour récupérer les données des utilisateurs pour l'administrateur
@admin_bp.route('/admin/data', methods=['GET'])
@jwt_required()  # Nécessite une authentification JWT
def get_admin_data():
    current_user = get_jwt_identity()
    
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403
    
    try:
        users = User.query.all()
        users_data = [{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone_number} for user in users]
        return jsonify({"users": users_data}), 200
    except Exception as e:
        return jsonify({"message": "Erreur lors de la récupération des utilisateurs", "error": str(e)}), 500

@admin_bp.route('/admin', methods=['GET', 'POST'])
@jwt_required()  # Nécessite une authentification JWT
def admin_dashboard():
    current_user = get_jwt_identity()
    
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403

    if request.method == 'POST':
        if request.headers.get('Content-Type') == 'application/json':
            data = request.json  
        else:
            return jsonify({"message": "Le type de contenu doit être application/json"}), 400

        if not data.get('email') or not data.get('first_name') or not data.get('last_name') or not data.get('phone_number') or not data.get('password'):
            return jsonify({"message": "Tous les champs sont requis"}), 422

        try:
            # Création d'un nouvel utilisateur sans hachage du mot de passe
            new_user = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                phone_number=data['phone_number'],
                password_hash=data['password'],  # Stockage direct du mot de passe
                role='agent'  
            )
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "Nouvel agent inscrit avec succès."}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return render_template('admin_dashboard.html')
