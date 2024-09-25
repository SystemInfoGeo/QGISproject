from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User
from datetime import datetime

notification_bp = Blueprint('notifications', __name__)

# Route pour envoyer une notification à l'administrateur
@notification_bp.route('/send-notification', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.json
    message = data.get('message')

    if not message:
        return jsonify({"error": "Le message est requis"}), 400

    # Trouver l'utilisateur administrateur
    admins = User.query.filter_by(role='admin').all()

    if not admins:
        return jsonify({"error": "Aucun administrateur trouvé"}), 404

    # Créer une notification pour chaque administrateur
    for admin in admins:
        notification = Notification(user_id=admin.id, message=message, timestamp=datetime.utcnow())
        db.session.add(notification)

    db.session.commit()

    return jsonify({"message": "Notification envoyée aux administrateurs"}), 201


@notification_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()

    # Récupérer toutes les notifications pour l'utilisateur connecté
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
