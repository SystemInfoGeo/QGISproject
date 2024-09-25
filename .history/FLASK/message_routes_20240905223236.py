from flask import Blueprint, request, jsonify
from models import db, Message  # Assure-toi que le modèle est importé correctement

message_bp = Blueprint('message', __name__)

@message_bp.route('/messages', methods=['POST'])
def receive_message():
    data = request.json
    new_message = Message(
        name=data['name'],
        email=data['email'],
        message=data['message']
    )
    db.session.add(new_message)
    db.session.commit()
    return jsonify({"msg": "Message reçu avec succès"}), 200

# Route pour récupérer tous les messages
@message_bp.route('/messages', methods=['GET'])
def list_messages():
    messages = Message.query.all()
    messages_data = [
        {"id": message.id, "name": message.name, "email": message.email, "message": message.message, "date_received": message.date_received}
        for message in messages
    ]
    return jsonify(messages_data), 200
