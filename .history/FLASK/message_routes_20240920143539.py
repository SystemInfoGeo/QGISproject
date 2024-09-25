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
@app.route('/messages', methods=['GET'])
@jwt_required()
def get_messages():
    messages = Message.query.all()
    messages_data = [{
        "id": message.id,
        "name": message.name,
        "email": message.email,
        "message": message.message,
        "date_received": message.date_received,
        "reply": message.reply,
        "reply_date": message.reply_date
    } for message in messages]
    
    return jsonify(messages=messages_data), 200