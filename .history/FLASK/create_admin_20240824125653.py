from your_application import create_app, db  # Importez votre application Flask et l'objet db
from models import User  # Importez le modèle User

# Créez l'application Flask (assurez-vous que create_app est bien configuré dans votre projet)
app = create_app()

with app.app_context():  # Activez le contexte de l'application pour accéder à la base de données
    # Créez un utilisateur administrateur
    admin = User(
        email='admin@example.com',
        first_name='Admin',
        last_name='User',
        phone_number='0000000000',
        role='admin'  # Définir le rôle comme 'admin'
    )
    admin.set_password('admin_password')  # Définir un mot de passe sécurisé

    # Ajouter l'utilisateur à la session de la base de données et la valider
    db.session.add(admin)
    db.session.commit()

    print("Administrateur créé avec succès.")
