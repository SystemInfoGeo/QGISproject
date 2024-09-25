from app import app, db
from models import User  # Assurez-vous d'importer correctement le modèle User

with app.app_context():
    # Rechercher l'administrateur par email
    admin = User.query.filter_by(email='admin@example.com').first()

    if admin:
        admin.set_password('sabrina2000')  # Remplacez par le nouveau mot de passe
        db.session.commit()
        print("Mot de passe administrateur mis à jour avec succès.")
    else:
        print("Administrateur non trouvé.")
