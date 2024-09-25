import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from datetime import datetime
from models import db, Message, User
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import logging

# Configurer les logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

message_bp = Blueprint('message', __name__)

# Route pour recevoir un nouveau message d'un utilisateur
@message_bp.route('/messages/new', methods=['POST'])  # Changé pour éviter les conflits
def receive_message():
    data = request.json

    # Validation des champs requis
    if not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({"error": "Tous les champs sont requis (nom, email, message)."}), 400

    try:
        # Création d'un nouveau message
        new_message = Message(
            name=data['name'],
            email=data['email'],
            message=data['message'],
            date_received=datetime.utcnow()
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"msg": "Message reçu avec succès"}), 200
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Erreur d'intégrité : {str(e)}")
        return jsonify({"error": "Violation d'intégrité, vérifiez vos données."}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Erreur lors de l'enregistrement dans la base de données: {str(e)}")
        return jsonify({"error": "Erreur lors de l'enregistrement du message."}), 500


# Route pour récupérer tous les messages (administration)
# Route pour récupérer tous les messages sans protection JWT temporairement
@message_bp.route('/messages', methods=['GET'])
def list_messages():
    #try:
        # Récupération de tous les messages sans pagination
        messages = Message.query.all()

        # Formatage des messages pour l'API
        messages_data = [
            {
                "id": message.id,
                "name": message.name,
                "email": message.email,
                "message": message.message,
                "date_received": message.date_received,
                "reply": message.reply,
                "reply_date": message.reply_date,
                "admin_name": message.admin_name,
                "admin_email": message.admin_email
            }
            for message in messages
        ]

        return jsonify({
            "messages": messages_data,  # La liste des messages formatés
            "total_messages": len(messages_data)  # Nombre total de messages
        }), 200  # Code de succès HTTP 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Erreur lors de la récupération des messages"}), 500


# Fonction pour envoyer un email
def send_email(to_email, subject, message):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "sabhadid7@gmail.com"
    password = os.getenv('SMTP_PASSWORD')  # Utilisez une variable d'environnement

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        print(f"Email envoyé avec succès à {to_email}")
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email : {e}")

# Route pour gérer l'envoi de la réponse à l'utilisateur
@message_bp.route('/messages/reply/<int:message_id>', methods=['POST'])
@jwt_required()
def reply_message(message_id):
    data = request.json
    reply_content = data.get('reply')

    if not reply_content or reply_content.strip() == "":
        return jsonify({"error": "Le contenu de la réponse est requis."}), 400

    try:
        # Récupérer l'identité de l'administrateur via le JWT
        admin_email = get_jwt_identity()
        if not admin_email:
            return jsonify({"error": "Administrateur non authentifié."}), 401

        # Vérifier que l'utilisateur est bien un admin
        admin = User.query.filter_by(email=admin_email, role='admin').first()
        if not admin:
            return jsonify({"error": "Accès refusé. Vous n'êtes pas autorisé à répondre aux messages."}), 403

        # Rechercher le message de l'utilisateur avec son ID
        user_message = Message.query.get_or_404(message_id)
        user_message.reply = reply_content
        user_message.reply_date = datetime.utcnow()
        user_message.admin_name = f"{admin.first_name} {admin.last_name}"
        user_message.admin_email = admin_email

        db.session.commit()

        # Envoyer un email à l'utilisateur
        user_email = user_message.email
        subject = "Réponse à votre message"
        send_email(user_email, subject, reply_content)

        return jsonify({
            "message": "Réponse enregistrée avec succès et envoyée à l'utilisateur.",
            "reply": reply_content,
            "reply_date": user_message.reply_date,
            "admin_name": user_message.admin_name,
            "admin_email": user_message.admin_email
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logger.error(f"Erreur lors de l'enregistrement de la réponse: {str(e)}")
        return jsonify({"error": f"Erreur lors de l'enregistrement de la réponse: {str(e)}"}), 500
    except Exception as e:
        logger.error(f"Erreur générique : {str(e)}")
        return jsonify({"error": f"Erreur lors de l'envoi de la réponse ou de l'email : {str(e)}"}), 500
