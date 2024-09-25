from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import get_jwt_identity  # Pour obtenir l'identité de l'utilisateur via JWT
from models import db, Message, User  # Assurez-vous que User est bien importé pour récupérer les informations de l'administrateur
message_bp = Blueprint('message', __name__)

# Route pour recevoir un nouveau message d'un utilisateur
@message_bp.route('/messages', methods=['POST'])
def receive_message():
    data = request.json

    try:
        new_message = Message(
            name=data['name'],
            email=data['email'],
            message=data['message']
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"msg": "Message reçu avec succès"}), 200
    except Exception as e:
        print(f"Erreur lors de l'enregistrement dans la base de données: {str(e)}")
        return jsonify({"error": "Erreur lors de l'enregistrement du message"}), 500


# Route pour récupérer tous les messages (administration)
@message_bp.route('/messages', methods=['GET'])
def list_messages():
    messages = Message.query.all()
    messages_data = [
        {
            "id": message.id,
            "name": message.name,
            "email": message.email,
            "message": message.message,
            "date_received": message.date_received,
            "reply": message.reply
        }
        for message in messages
    ]
    return jsonify(messages_data), 200


# Route pour gérer l'envoi de la réponse à l'utilisateur
@message_bp.route('/messages/reply/<int:message_id>', methods=['POST'])
def reply_message(message_id):
    data = request.json
    reply_content = data.get('reply')

    if not reply_content or reply_content.strip() == "":
        return jsonify({"error": "Le contenu de la réponse est requis."}), 400

    # Rechercher le message de l'utilisateur avec son ID
    user_message = Message.query.get_or_404(message_id)

    try:
        # Stocker la réponse dans le champ 'reply' du message
        user_message.reply = reply_content
        user_message.reply_date = datetime.utcnow()  # Ajouter la date de la réponse
        db.session.commit()  # Sauvegarder la modification dans la base de données

        return jsonify({"message": "Réponse enregistrée avec succès", "reply": reply_content, "reply_date": user_message.reply_date}), 200
    except Exception as e:
        db.session.rollback()  # Annuler les modifications en cas d'erreur
        return jsonify({"error": f"Erreur lors de l'enregistrement de la réponse: {str(e)}"}), 500


# Route pour récupérer les messages d'un utilisateur spécifique
@message_bp.route('/user/messages', methods=['GET'])
def get_user_messages():
    email = request.args.get('email')  # Récupérer l'email de l'utilisateur à partir des paramètres
    if not email:
        return jsonify({"error": "Email requis"}), 400

    # Rechercher les messages de l'utilisateur avec cet email
    user_messages = Message.query.filter_by(email=email).all()

    # Retourner les messages avec leurs réponses
    messages_data = [
        {
            "id": msg.id,
            "message": msg.message,
            "date_received": msg.date_received,
            "reply": msg.reply
        }
        for msg in user_messages
    ]

    return jsonify(messages_data), 200
