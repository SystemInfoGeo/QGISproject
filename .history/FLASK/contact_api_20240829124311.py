from flask import Blueprint, request, jsonify
from flask_mail import Mail, Message


contact_bp = Blueprint('contact', __name__)  # Création du Blueprint
mail = Mail()

#  initialiser Flask-Mail avec l'application Flask
def init_mail(app):
    mail.init_app(app)

@contact_bp.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()

    if not data or not all(key in data for key in ('name', 'email', 'message')):
        return jsonify({'error': 'Données manquantes'}), 400

    name = data['name']
    email = data['email']
    message = data['message']

    # Créer le message email
    msg = Message(
        subject='Nouveau message de contact',
        sender=email,
        recipients=['admin@example.com'],  # Remplacez par l'email de l'administrateur
        body=f"Nom: {name}\nEmail: {email}\n\nMessage:\n{message}"
    )

    try:
        mail.send(msg)
        return jsonify({'success': 'Message envoyé avec succès'}), 200
    except Exception as e:
        print(f"Erreur lors de l'envoi du mail: {str(e)}")
        return jsonify({'error': 'Erreur lors de l\'envoi du message'}), 500
