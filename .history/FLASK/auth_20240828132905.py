from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import User, db
from email_validator import validate_email, EmailNotValidError  # Importer la bibliothèque de validation d'email
import logging
from flask_jwt_extended import jwt_required

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
        role = request.form.get('role', 'visiteur')  # Par défaut, le rôle est 'visiteur'


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
            role=role  # Le rôle est défini ici
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
          logging.warning(f"Utilisateur non trouvé pour l'email: {data.get('email')}")
          return jsonify({"error": "Utilisateur non trouvé."}), 401

    if not user.check_password(data.get('password')):
        logging.warning(f"Mot de passe incorrect pour l'email: {data.get('email')}")
        return jsonify({"error": "Mot de passe incorrect."}), 401

    # Si tout est correct, générer un token JWT
    logging.info(f"Connexion réussie pour l'utilisateur: {data.get('email')}")
    access_token = create_access_token(identity=user.id)
    return jsonify({"msg": "Login réussi", "token": access_token}), 200





# Route pour gérer l'inscription des utilisateurs par l'administrateur
@auth_bp.route('/admin/register', methods=['POST'])
@jwt_required()  # Assurez-vous que seul un administrateur connecté peut accéder à cette route
def admin_register():
    # Récupère l'identité de l'utilisateur connecté à partir du token JWT
    user_id = get_jwt_identity()
    current_user = User.query.get(user_id)

    # Vérifie si l'utilisateur connecté est un administrateur
    if not current_user or current_user.role != 'administrateur':
        return jsonify({"error": "Accès non autorisé"}), 403

    # Récupère les données du formulaire (JSON)
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    role = data.get('role')  # L'administrateur choisit le rôle de l'utilisateur

    # Vérifie si tous les champs du formulaire sont remplis
    if not email or not password or not first_name or not last_name or not phone_number or not role:
        return jsonify({"error": "Tous les champs sont requis."}), 400

    # Vérifie si un utilisateur avec cet email existe déjà dans la base de données
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"error": "Cet email est déjà utilisé."}), 400

    # Crée un nouvel utilisateur avec les données fournies par l'administrateur
    new_user = User(
        email=email,
        password_hash=generate_password_hash(password),  # Hachage du mot de passe pour la sécurité
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role=role  # Le rôle est défini par l'administrateur
    )

    # Ajoute le nouvel utilisateur à la base de données et enregistre les changements
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": f'{role.capitalize()} ajouté avec succès!'}), 201