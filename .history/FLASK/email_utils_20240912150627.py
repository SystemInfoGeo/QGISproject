import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, subject, message):
    # Informations de configuration pour Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "lamiaadidas2@gmail.com"
    password = "jcrbonqmfdtgzjnz"  # Mot de passe généré

    # Créer le message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    # Connexion au serveur SMTP
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Utiliser TLS
        server.login(sender_email, password)  # Se connecter avec l'adresse email et le mot de passe
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)  # Envoyer l'email
        server.quit()
        print(f"Email envoyé avec succès à {to_email}")
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email : {e}")

# Exemple d'utilisation (à ne pas exécuter ici directement mais via ton application) :
# send_email("utilisateur@exemple.com", "Sujet de l'email", "Message de réponse")
