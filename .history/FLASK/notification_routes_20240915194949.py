from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User
notification_bp = Blueprint('notifications', __name__)

# Route pour envoyer les notifications
# Route pour envoyer une notification
@notification_bp.route('/user/send-notification', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.get_json()
    
    user_id = data.get('user_id')  # Assurez-vous que vous passez bien l'ID utilisateur dans le JSON envoyé
    message = data.get('message')
    
    # Créez une nouvelle notification sans utiliser l'argument 'user_name'
    notification = Notification(
        user_id=user_id,
        message=message
    )
    
    db.session.add(notification)
    
    try:
        db.session.commit()
        return jsonify({"msg": "Notification envoyée avec succès!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Erreur lors de l'envoi de la notification.", "error": str(e)}), 500


# Route pour récupérer les notifications
@notification_bp.route('/admin/get-notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    notifications = db.session.query(
        Notification.id,
        User.first_name.label('user_name'),  # Joindre les informations de l'utilisateur
        Notification.message,
        Notification.is_read,
        Notification.timestamp
    ).join(User, Notification.user_id == User.id).filter_by(is_read=False).all()
    
    return jsonify([{
        'id': n.id,
        'user_name': n.user_name,
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
