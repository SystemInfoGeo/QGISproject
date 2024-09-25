from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User
notification_bp = Blueprint('notifications', __name__)


# Route pour envoyer les notifications
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User

notification_bp = Blueprint('notifications', __name__)

# Route pour envoyer une notification
@notification_bp.route('/user/send-notification', methods=['POST'])
@jwt_required()
def send_notification():
    try:
        # Récupérer l'identité de l'utilisateur connecté (ID utilisateur depuis le token)
        user_id = get_jwt_identity()
        
        # Vérifier si l'utilisateur existe dans la base de données
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "Utilisateur non trouvé."}), 404
        
        # Récupérer les données du POST
        data = request.get_json()
        message = data.get('message')
        
        if not message:
            return jsonify({"msg": "Le message est obligatoire."}), 400
        
        # Créer la notification avec les informations de l'utilisateur
        notification = Notification(
            user_id=user.id,
            message=message
        )
        
        db.session.add(notification)
        db.session.commit()

        # Réponse avec succès
        return jsonify({"msg": "Notification envoyée avec succès!", "user_name": f"{user.first_name} {user.last_name}"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Erreur lors de l'envoi de la notification.", "error": str(e)}), 500




# Route pour récupérer les notifications
@notification_bp.route('/admin/get-notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    notifications = db.session.query(
        Notification.id,
        User.first_name.label('first_name'),  # Récupérer le prénom
        User.last_name.label('last_name'),    # Récupérer le nom de famille
        Notification.message,
        Notification.is_read,
        Notification.timestamp
    ).join(User, Notification.user_id == User.id).filter(Notification.is_read == False).all()
    
    return jsonify([{
        'id': n.id,
        'user_name': f"{n.first_name} {n.last_name}",  # Concaténer le prénom et le nom
        'message': n.message,
        'is_read': n.is_read,
        'timestamp': n.timestamp
    } for n in notifications]), 200


  # Route pour marquer une notification comme lue
@notification_bp.route('/admin/mark-as-read/<int:id>', methods=['POST'])
@jwt_required()
def mark_as_read(id):
    notification = Notification.query.get_or_404(id)
    notification.is_read = True
    try:
        db.session.commit()
        return jsonify({"msg": "Notification marquée comme lue!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Erreur lors de la mise à jour.", "error": str(e)}), 500


# Route pour supprimer une notification
@notification_bp.route('/admin/delete-notification/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_notification(id):
    notification = Notification.query.get_or_404(id)
    try:
        db.session.delete(notification)
        db.session.commit()
        return jsonify({"msg": "Notification supprimée!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Erreur lors de la suppression.", "error": str(e)}), 500  
