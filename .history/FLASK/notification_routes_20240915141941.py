from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification, User
from datetime import datetime
from models import Message

notification_bp = Blueprint('notifications', __name__)

#Route pour envoyer les notifications
@notification_bp.route('/user/send-notification', methods=['POST'])
@jwt_required()
def send_notification():
    data = request.get_json()
    user_id = get_jwt_identity()  # Récupérer l'utilisateur authentifié

    # Créez une nouvelle notification
    notification = Notification(
        user_id=user_id,
        message=data.get('message')
    )

    try:
        db.session.add(notification)
        db.session.commit()
        return jsonify({"msg": "Notification envoyée avec succès!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Erreur lors de l'envoi de la notification.", "error": str(e)}), 500

# Route pour envoyer une notification à l'administrateur


#Route pour recupérer les notifications 
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


 # Route pour que l'utilisateur puisse envoyer un message et générer une notification pour l'administrateur
# Route pour que l'utilisateur puisse envoyer un message et générer une notification pour l'administrateur
@notification_bp.route('/user/send-message', methods=['POST'])
@jwt_required()
def user_send_message():
    data = request.json
    message_content = data.get('message')  # Assurez-vous que le champ est 'message'

    # Vérifiez si le message existe
    if not message_content:
        return jsonify({"error": "Le contenu du message est requis"}), 400

    # Obtenez l'identité de l'utilisateur connecté
    user_id = get_jwt_identity()

    # Enregistrez le message dans la base de données
    new_message = Message(
        user_id=user_id,
        name="Nom de l'utilisateur",  # Remplacez par le nom réel si nécessaire
        email="Email de l'utilisateur",  # Remplacez par l'email réel si nécessaire
        message=message_content  # Le champ doit être 'message'
    )
    db.session.add(new_message)
    db.session.commit()

    # Créez une notification pour l'administrateur
    admin_notification = Notification(
        user_id=1,  # ID de l'administrateur ou d'une liste d'administrateurs
        message="Un nouvel utilisateur a envoyé un message.",
        is_read=False
    )
    db.session.add(admin_notification)
    db.session.commit()

    return jsonify({"message": "Message envoyé et notification créée"}), 201
