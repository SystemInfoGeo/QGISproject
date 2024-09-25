from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User

# Créer un blueprint pour les routes administratives
admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/admin/data', methods=['GET'])
@jwt_required()  # Nécessite une authentification JWT
def get_admin_data():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403
    try:
        # Essayer de récupérer tous les utilisateurs depuis la base de données
        users = User.query.all()
    except Exception as e:
        # En cas d'erreur, retourner un message d'erreur avec les détails de l'exception
        return jsonify({"message": "Erreur lors de la récupération des utilisateurs", "error": str(e)}), 500


    # Si tout se passe bien, retourner la liste des utilisateurs
    users = User.query.all()
    users_data = [{"email": user.email, "first_name": user.first_name, "last_name": user.last_name, "phone_number": user.phone_number} for user in users]
    return jsonify({"users": users_data}), 200


# Route pour le tableau de bord de l'administrateur
@app.route('/admin', methods=['GET', 'POST'])
@jwt_required()  # Nécessite une authentification JWT
def admin_dashboard():
    current_user = get_jwt_identity()
    if current_user['role'] != 'admin':
        return jsonify({"message": "Accès non autorisé."}), 403

    if request.method == 'POST':
        data = request.form
         # Ajout des logs pour le débogage
        print("Données reçues du formulaire : ", data)
        print("Email : ", data.get('email'))
        print("Prénom : ", data.get('first_name'))
        print("Nom : ", data.get('last_name'))
        print("Téléphone : ", data.get('phone_number'))
        print("Mot de passe : ", data.get('password'))

        try:
            new_user = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                phone_number=data['phone_number'],
                role='agent'  # Par défaut, le nouvel utilisateur est un agent
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"message": "Nouvel agent inscrit avec succès."}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    # Si la méthode est GET, afficher le tableau de bord admin
    return render_template('admin_dashboard.html')
