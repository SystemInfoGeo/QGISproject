from flask import Flask, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

# Configuration de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'votre_email@example.com'
app.config['MAIL_PASSWORD'] = 'votre_mot_de_passe'
app.config['MAIL_DEFAULT_SENDER'] = ('Votre Nom', 'votre_email@example.com')

contact_bp = Blueprint('contact', __name__)
mail = Mail(app)

@app.route('/contact', methods=['POST'])
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

if __name__ == '__main__':
    app.run(debug=True)
