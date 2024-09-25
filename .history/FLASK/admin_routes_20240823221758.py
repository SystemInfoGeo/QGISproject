from flask import Blueprint, jsonify, request, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin_bp', __name__)

# Route pour récupérer les données des utilisateurs pour l'administrateur
@admin_bp.route('/admin/data', methods=['GET'])
@jwt_required()  # Nécessite une authentification JWT
def get_admin_data():
    # Récupération de l'identité de l'utilisateur courant
    current_user = get_jwt_identity()
    
    # Vérification si l'utilisateur a les droits d'administrateur
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403
    
    try:
        # Récupération de tous les utilisateurs depuis la base de données
        users = User.query.all()
        # Préparation des données des utilisateurs pour l'envoi en réponse JSON
        users_data = [{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone_number} for user in users]
        return jsonify({"users": users_data}), 200
    except Exception as e:
        # Gestion des erreurs lors de la récupération des utilisateurs
        return jsonify({"message": "Erreur lors de la récupération des utilisateurs", "error": str(e)}), 500

# Route pour le tableau de bord de l'administrateur
@admin_bp.route('/admin', methods=['GET', 'POST'])
@jwt_required()  # Nécessite une authentification JWT
def admin_dashboard():
    # Récupération de l'identité de l'utilisateur courant
    current_user = get_jwt_identity()
    
    # Vérification si l'utilisateur a les droits d'administrateur
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403

    if request.method == 'POST':
        # Vérification des en-têtes pour s'assurer que le Content-Type est JSON
        if request.headers.get('Content-Type') == 'application/json':
            data = request.json  # Extraction des données JSON envoyées dans la requête
        else:
            return jsonify({"message": "Le type de contenu doit être application/json"}), 400

        # Vérification que tous les champs requis sont présents dans les données reçues
        if not data.get('email') or not data.get('first_name') or not data.get('last_name') or not data.get('phone_number') or not data.get('password'):
            return jsonify({"message": "Tous les champs sont requis"}), 422

        try:
            # Création d'un nouvel utilisateur avec les données reçues
            new_user = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                phone_number=data['phone_number'],
                role='agent'  # Par défaut, le nouvel utilisateur est enregistré comme "agent"
            )
            # Hashage du mot de passe pour la sécurité
            new_user.set_password(data['password'])
            # Ajout du nouvel utilisateur à la base de données
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "Nouvel agent inscrit avec succès."}), 201
        except Exception as e:
            # Gestion des erreurs lors de l'ajout de l'utilisateur à la base de données
            return jsonify({"error": str(e)}), 500

    # Si la méthode est GET, afficher le tableau de bord admin (HTML)
    return render_template('admin_dashboard.html')
