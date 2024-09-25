from flask import Blueprint, request, jsonify
from models import db, Message  # Assure-toi que le modèle est importé correctement

message_bp = Blueprint('message', __name__)

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

# Route pour récupérer tous les messages
@message_bp.route('/messages', methods=['GET'])
def list_messages():
    messages = Message.query.all()
    messages_data = [
        {"id": message.id, "name": message.name, "email": message.email, "message": message.message, "date_received": message.date_received}
        for message in messages
    ]
    return jsonify(messages_data), 200

#Route pour gèrer l'envoi de la réponse à l'utilisateur
@app.route('/messages/reply/<int:message_id>', methods=['POST'])
def reply_message(message_id):
    data = request.json
    reply_content = data.get('reply')

    # Rechercher le message de l'utilisateur avec son ID
    user_message = Message.query.get_or_404(message_id)

    # Enregistrer la réponse dans la base de données
    try:
        user_message.reply = reply_content  # Stocker la réponse dans le champ reply
        db.session.commit()  # Sauvegarder la modification dans la base de données

        return jsonify({"message": "Réponse enregistrée avec succès"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500