from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User, db
from email_validator import validate_email, EmailNotValidError  # Importer la bibliothèque de validation d'email
import logging

# Configurer le logging
logging.basicConfig(level=logging.INFO)

# Création du blueprint pour regrouper les routes liées à l'authentification
auth_bp = Blueprint('auth', __name__)

# Route pour gérer l'inscription des utilisateurs
@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Récupération des informations du formulaire d'inscription
        email = request.form['email']
        password = request.form['password']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        phone_number = request.form['phone_number']
        
        logging.info(f"Demande d'inscription reçue pour l'email: {email}")

        try:
            # Validation de l'email
            valid = validate_email(email)
            email = valid.email  # L'adresse email normalisée
            logging.info(f"Email validé et normalisé: {email}")
        except EmailNotValidError as e:
            # Email non valide, retour au formulaire avec un message d'erreur
            flash(str(e), 'danger')
            logging.error(f"Email non valide: {email}. Erreur: {str(e)}")
            return redirect(url_for('auth.register'))

        # Vérification si l'utilisateur existe déjà
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
            role='agent'
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
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Récupération des informations du formulaire de connexion
        email = request.form['email']
        password = request.form['password']
        
        logging.info(f"Demande de connexion reçue pour l'email: {email}")

        # Recherche de l'utilisateur dans la base de données
        user = User.query.filter_by(email=email).first()

        # Vérification des informations d'identification
        if user and check_password_hash(user.password_hash, password):
            # Création d'un token JWT pour l'utilisateur connecté
            access_token = create_access_token(identity={'email': user.email, 'role': user.role})
            session['jwt_token'] = access_token  # Stockage du token JWT dans la session
            flash('Connexion réussie', 'success')
            logging.info(f"Connexion réussie pour l'utilisateur: {email}")

            # Redirection vers la page appropriée en fonction du rôle de l'utilisateur
            if user.role == 'admin':
                logging.info(f"Redirection de l'administrateur vers le tableau de bord: {email}")
                return redirect(url_for('admin_dashboard'))
            else:
                logging.info(f"Redirection de l'utilisateur vers la page de collecte: {email}")
                return redirect(url_for('collecte_page'))
        else:
            flash('Email ou mot de passe incorrect', 'danger')
            logging.warning(f"Échec de la connexion pour l'email: {email}")

    # Affichage du formulaire de connexion si la méthode est GET
    return render_template('login.html')

# N'oubliez pas d'enregistrer ce blueprint dans votre fichier principal (par exemple, app.py)
# app.register_blueprint(auth_bp)
