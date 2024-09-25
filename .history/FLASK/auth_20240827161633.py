from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User, db
from email_validator import validate_email, EmailNotValidError  # Importer la bibliothèque de validation d'email
import logging

# Configurer le logging pour suivre les activités de l'application
logging.basicConfig(level=logging.INFO)

# Création du blueprint pour regrouper les routes liées à l'authentification
auth_bp = Blueprint('auth', __name__)

# Route pour gérer l'inscription des utilisateurs
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Loguer les données du formulaire pour le débogage
        logging.debug(f"Form data: {request.form}")  
        
        # Utiliser .get() pour éviter les KeyError si une clé est manquante
        email = request.form.get('email')
        password = request.form.get('password')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        phone_number = request.form.get('phone_number')

        # Loguer l'action d'inscription
        logging.info(f"Demande d'inscription reçue pour l'email: {email}")

        # Vérification que tous les champs sont remplis
        if not email or not password or not first_name or not last_name or not phone_number:
            flash('Tous les champs sont requis.', 'danger')
            return redirect(url_for('auth.register'))

        try:
            # Validation de l'email avec la bibliothèque email_validator
            valid = validate_email(email)
            email = valid.email  # Normalisation de l'email
            logging.info(f"Email validé et normalisé: {email}")
        except EmailNotValidError as e:
            # En cas d'email non valide, retour au formulaire avec un message d'erreur
            flash(str(e), 'danger')
            logging.error(f"Email non valide: {email}. Erreur: {str(e)}")
            return redirect(url_for('auth.register'))

        # Vérification si l'utilisateur existe déjà dans la base de données
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Cet email est déjà utilisé. Veuillez en choisir un autre.', 'danger')
            logging.warning(f"Tentative d'inscription avec un email déjà utilisé: {email}")
            return redirect(url_for('auth.register'))

        # Création d'un nouvel utilisateur avec les données du formulaire
        new_user = User(
            email=email,
            password_hash=generate_password_hash(password),  # Hachage du mot de passe pour la sécurité
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            role='agent'  # Définir un rôle par défaut (par exemple, "agent")
        )
        
        logging.info(f"Création d'un nouvel utilisateur: {email}")

        try:
            # Ajout du nouvel utilisateur à la base de données
            db.session.add(new_user)
            db.session.commit()
            flash('Inscription réussie! Vous pouvez maintenant vous connecter.', 'success')
            logging.info(f"Nouvel utilisateur ajouté à la base de données: {email}")
            return redirect(url_for('auth.login'))  # Redirection vers la page de connexion
        except Exception as e:
            # Gestion des erreurs si l'ajout de l'utilisateur échoue
            flash(f'Une erreur est survenue lors de l\'inscription: {str(e)}', 'danger')
            logging.error(f"Erreur lors de l'inscription de l'utilisateur: {email}. Erreur: {str(e)}")
            return redirect(url_for('auth.register'))

    # Affichage du formulaire d'inscription si la méthode est GET
    return render_template('register.html')




# Route pour gérer la connexion des utilisateurs
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Vérification des données d'entrée
    if not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Email et mot de passe sont requis."}), 400

    user = User.query.filter_by(email=data.get('email')).first()

    if user is None:
        return jsonify({"error": "Utilisateur non trouvé."}), 401

    if not user.check_password(data.get('password')):
        return jsonify({"error": "Mot de passe incorrect."}), 401

    # Si tout est correct, générer un token JWT
    access_token = create_access_token(identity=user.id)
    return jsonify({"msg": "Login réussi", "token": access_token}), 200
