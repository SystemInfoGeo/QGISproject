import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
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
@jwt_required()  # Authentification requise pour protéger cette route
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


# Fonction pour envoyer un email
def send_email(to_email, subject, message):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "sabhadid7@gmail.com"
    password = "wypstsosdqfttyay"  # Utilise ton mot de passe d'application

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
@jwt_required()  # L'authentification reste ici pour protéger cette action
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

        # Envoyer un email à l'utilisateur
        user_email = user_message.email  # Récupérer l'email de l'utilisateur
        subject = "Réponse à votre message"
        send_email(user_email, subject, reply_content)

        # Réponse avec les informations de l'administrateur et de la réponse
        return jsonify({
            "message": "Réponse enregistrée avec succès et envoyée à l'utilisateur.",
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

