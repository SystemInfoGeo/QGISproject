from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from models import db, Message, User

message_bp = Blueprint('message', __name__)

# Route pour recevoir un nouveau message d'un utilisateur
@message_bp.route('/messages', methods=['POST'])
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
            date_received=datetime.utcnow()  # Ajout de la date de réception
        )
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"msg": "Message reçu avec succès"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()  # En cas d'erreur, annuler la transaction
        print(f"Erreur lors de l'enregistrement dans la base de données: {str(e)}")
        return jsonify({"error": "Erreur lors de l'enregistrement du message"}), 500


# Route pour récupérer tous les messages (administration)
@message_bp.route('/messages', methods=['GET'])
def list_messages():
    try:
        page = request.args.get('page', 1, type=int)  # Pagination
        per_page = request.args.get('per_page', 10, type=int)

        # Récupération des messages avec pagination
        messages = Message.query.paginate(page=page, per_page=per_page, error_out=False)

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
            for message in messages.items
        ]

        return jsonify({
            "messages": messages_data,
            "total": messages.total,
            "pages": messages.pages,
            "current_page": messages.page
        }), 200
    except SQLAlchemyError as e:
        print(f"Erreur lors de la récupération des messages: {str(e)}")
        return jsonify({"error": "Erreur lors de la récupération des messages"}), 500


# Route pour gérer l'envoi de la réponse à l'utilisateur
@message_bp.route('/messages/reply/<int:message_id>', methods=['POST'])
def reply_message(message_id):
    data = request.json
    reply_content = data.get('reply')

    if not reply_content or reply_content.strip() == "":
        return jsonify({"error": "Le contenu de la réponse est requis."}), 400

    try:
        # Récupérer l'identité de l'administrateur connecté via JWT
        admin_email = get_jwt_identity()
        if not admin_email:
            return jsonify({"error": "Administrateur non authentifié."}), 401

        # Rechercher l'administrateur dans la base de données par email et vérifier le rôle
        admin = User.query.filter_by(email=admin_email, role='admin').first()
        if not admin:
            return jsonify({"error": "Accès refusé. Vous n'êtes pas autorisé à répondre aux messages."}), 403

        # Rechercher le message de l'utilisateur avec son ID
        user_message = Message.query.get_or_404(message_id)

        # Stocker la réponse dans le champ 'reply' du message
        user_message.reply = reply_content
        user_message.reply_date = datetime.utcnow()  # Ajouter la date de la réponse

        # Stocker les informations de l'administrateur
        user_message.admin_name = f"{admin.first_name} {admin.last_name}"  # Nom complet de l'administrateur
        user_message.admin_email = admin_email  # Email de l'administrateur

        # Sauvegarder les modifications dans la base de données
        db.session.commit()

        # Réponse avec les informations de l'administrateur et de la réponse
        return jsonify({
            "message": "Réponse enregistrée avec succès",
            "reply": reply_content,
            "reply_date": user_message.reply_date,
            "admin_name": user_message.admin_name,
            "admin_email": user_message.admin_email
        }), 200

    except SQLAlchemyError as e:
        # En cas d'erreur, annuler les modifications et retourner une erreur
        db.session.rollback()
        print(f"Erreur lors de l'enregistrement de la réponse: {str(e)}")
        return jsonify({"error": f"Erreur lors de l'enregistrement de la réponse: {str(e)}"}), 500


# Route pour récupérer les messages d'un utilisateur spécifique
@message_bp.route('/user/messages', methods=['GET'])
@jwt_required()  # Exiger un JWT pour cette route
def get_user_messages():
    email = request.args.get('email')  # Récupérer l'email de l'utilisateur à partir des paramètres
    if not email:
        return jsonify({"error": "Email requis"}), 400

    try:
        # Pagination pour les messages de l'utilisateur
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        # Rechercher les messages de l'utilisateur avec cet email
        user_messages = Message.query.filter_by(email=email).paginate(page=page, per_page=per_page, error_out=False)

        # Retourner les messages avec leurs réponses
        messages_data = [
            {
                "id": msg.id,
                "message": msg.message,
                "date_received": msg.date_received,
                "reply": msg.reply,
                "reply_date": msg.reply_date
            }
            for msg in user_messages.items
        ]

        return jsonify({
            "messages": messages_data,
            "total": user_messages.total,
            "pages": user_messages.pages,
            "current_page": user_messages.page
        }), 200
    except SQLAlchemyError as e:
        print(f"Erreur lors de la récupération des messages de l'utilisateur: {str(e)}")
        return jsonify({"error": "Erreur lors de la récupération des messages de l'utilisateur"}), 500
