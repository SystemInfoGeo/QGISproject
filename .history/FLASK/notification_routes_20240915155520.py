from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Notification

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
        user_id=user.id,  # Utilisez l'ID de l'utilisateur ici
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
    admin_id = get_jwt_identity()  # Assurez-vous que l'utilisateur est admin s'il y a un tel rôle
    notifications = Notification.query.filter_by(is_read=False).all()
    return jsonify([{
        'id': n.id,
        'user_id': n.user_id,
        'message': n.message,
        'is_read': n.is_read,
        'timestamp': n.timestamp
    } for n in notifications]), 200
