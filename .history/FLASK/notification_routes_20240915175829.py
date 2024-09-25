from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User
notification_bp = Blueprint('notifications', __name__)

# Route pour envoyer les notifications
@notification_bp.route('/user/send-notification', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.get_json()
    user_email = get_jwt_identity()  # Récupérer l'utilisateur authentifié
    
    # Trouver l'utilisateur à partir de l'email
    user = User.query.filter_by(email=user_email).first()

    if not user:
        return jsonify({"msg": "Utilisateur non trouvé"}), 404

    # Créez une nouvelle notification
    notification = Notification(
        user_id=user.id,  
        user_name=f"{user.first_name} {user.last_name}",
        message=data.get('message')
    )    

    try:
        db.session.add(notification)
        db.session.commit()
        return jsonify({"msg": "Notification envoyée avec succès!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Erreur lors de l'envoi de la notification.", "error": str(e)}), 500
  

# Route pour récupérer les notifications
@notification_bp.route('/admin/get-notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    notifications = Notification.query.filter_by(is_read=False).all()
    return jsonify([{
        'id': n.id,
        'user_id': n.user_id,
        'user_name': n.user.first_name + ' ' + n.user.last_name,
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
