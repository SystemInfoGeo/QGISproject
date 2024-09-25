from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Notification, db

# Créer un blueprint pour les routes des notifications
notification_bp = Blueprint('notifications', __name__)

# Route pour récupérer les notifications d'un utilisateur connecté
@notification_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=user_id).all()

    notifications_data = [
        {
            "id": notification.id,
            "message": notification.message,
            "is_read": notification.is_read,
            "timestamp": notification.timestamp
        }
        for notification in notifications
    ]
    return jsonify({"notifications": notifications_data})
