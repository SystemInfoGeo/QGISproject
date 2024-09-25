from flask import Flask, request, jsonify
from flask import Blueprint, jsonify
from models import db, TrashBin  # Assurez-vous d'avoir un modèle TrashBin pour les poubelles
from psycopg2 import sql  # Import de sql depuis psycopg2
import traceback
import psycopg2
#from flask_socketio import emit
#from app import socketio  # Importer socketio depuis app.py


trash_bp = Blueprint('trash', __name__)

# Route pour obtenir l'état de toutes les poubelles
@trash_bp.route('/trash-status', methods=['GET'])
def get_trash_status():
    try:
        # Récupérer toutes les poubelles et leurs informations
        trash_bins = TrashBin.query.all()
        trash_data = [{
            'id': bin.id,
            'latitude': bin.latitude,
            'longitude': bin.longitude,
            'status': bin.status,  # 'plein' ou 'vide'
            'last_collected': bin.last_collected
        } for bin in trash_bins]

        return jsonify(trash_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Route pour l'ajout de points/poubelles dans la base de données
@trash_bp.route('/add-trash-bin', methods=['POST'])
def add_trash_bin():
    try:
        data = request.json  # Recevoir les données en format JSON depuis Next.js
        name = data.get('name')  # Récupérer le nom
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        status = data.get('status', 'vide')  # Par défaut 'vide'

        # Vérifier si name, latitude, et longitude sont présents
        if not name or not latitude or not longitude:
            return jsonify({"error": "Le nom et les coordonnées (latitude et longitude) sont requis"}), 400

        # Créer une nouvelle poubelle
        new_bin = TrashBin(
            name=name,
            latitude=latitude,
            longitude=longitude,
            status=status
        )

        # Ajouter la poubelle à la base de données
        db.session.add(new_bin)
        db.session.commit()

        return jsonify({"message": "Point de collecte ajouté avec succès"}), 201
    except Exception as e:
        print(f"Erreur lors de l'ajout du point de collecte : {e}")  # Afficher l'erreur complète
        return jsonify({"error": str(e)}), 500



# Route pour récupérer tous les points de collecte
@trash_bp.route('/get_all-trash-bins', methods=['GET'])
def get_all_trash_bins():
    try:
        # Récupérer toutes les poubelles
        trash_bins = TrashBin.query.all()
        trash_data = [{
            'id': bin.id,
            'name': bin.name,  
            'latitude': bin.latitude,
            'longitude': bin.longitude,
            'status': bin.status,
            'last_collected': bin.last_collected
        } for bin in trash_bins]

        return jsonify(trash_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#Route pour modifier un point de collecte
@trash_bp.route('/update-trash-bin/<int:id>', methods=['PUT'])
def update_trash_bin(id):
 
    try:
        data = request.json
        trash_bin = TrashBin.query.get(id)
        if not trash_bin:
            return jsonify({"error": "Poubelle non trouvée"}), 404

        trash_bin.name = data.get('name', trash_bin.name)
        trash_bin.latitude = data.get('latitude', trash_bin.latitude)
        trash_bin.longitude = data.get('longitude', trash_bin.longitude)
        trash_bin.status = data.get('status', trash_bin.status)

        db.session.commit()
        return jsonify({"message": "Poubelle mise à jour avec succès"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#Route pour supprimer un point de collecte
@trash_bp.route('/delete-trash-bin/<int:id>', methods=['DELETE'])
def delete_trash_bin(id):
    try:
        trash_bin = TrashBin.query.get(id)
        if not trash_bin:
            return jsonify({"error": "Poubelle non trouvée"}), 404

        db.session.delete(trash_bin)
        db.session.commit()
        return jsonify({"message": "Poubelle supprimée avec succès"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Route pour mettre à jour le statut du point dans la base de données
@trash_bp.route('/update-trash-bin-status/<int:id>', methods=['PUT'])
def update_trash_bin_status(id):
    try:
        print(f"ID reçu : {id}")  # Log pour l'ID reçu

        # Récupérer la poubelle par son ID
        trash_bin = TrashBin.query.get(id)

        if not trash_bin:
            return jsonify({"error": "Poubelle non trouvée"}), 404

        # Obtenir les nouvelles données envoyées dans la requête (seulement le statut)
        data = request.get_json()
        print(f"Données reçues : {data}")  # Log pour afficher les données reçues

        new_status = data.get('status')

        if new_status is None:
            print("Aucun statut fourni")  # Log si le statut est manquant
            return jsonify({"error": "Aucun statut fourni"}), 400

        # Mettre à jour uniquement le statut
        print(f"Mise à jour du statut de la poubelle {id} à {new_status}")  # Log pour la mise à jour du statut
        trash_bin.status = new_status

        # Sauvegarder la modification
        db.session.commit()

        print(f"Statut de la poubelle {id} mis à jour avec succès")  # Log pour indiquer que le commit a réussi
        return jsonify({"message": "Statut mis à jour avec succès"}), 200

    except Exception as e:
        print(f"Erreur : {e}")  # Log en cas d'erreur
        return jsonify({"error": str(e)}), 500


# Route pour recevoir les signalements de poubelles
@trash_bp.route('/report-bin', methods=['POST'])
def report_bin():
    data = request.get_json()
    
    # Extraction des données du formulaire
    lat = data.get('lat')
    lng = data.get('lng')
    status = data.get('status')
    comments = data.get('comments')

    try:
        # Connexion à la base de données PostgreSQL
        
        conn = psycopg2.connect("dbname='Mydatabase' user='info' host='localhost' password='informatique' port='5432'")
        cursor = conn.cursor()

        # Insertion des données dans la table trash_bins
        query = sql.SQL('''
            INSERT INTO trash_bins (latitude, longitude, status, last_collected, name)
            VALUES (%s, %s, %s, NOW(), %s)
        ''')
        cursor.execute(query, (lat, lng, status, comments))
        
        conn.commit()
        cursor.close()
        conn.close()

       # Informer l'administrateur via Socket.IO
        #socketio.emit('new_signalement', {
         #   'lat': lat,
           # 'lng': lng,
          #  'status': status,
         #   'comments': comments
       # }, namespace='/admin') '''

        # Informer l'agent de collecte via Socket.IO
        #socketio.emit('new_signalement', {
            #'lat': lat,
            #'lng': lng,
            #'status': status,
           # 'comments': comments
        #}, namespace='/agent')  

        return jsonify({'message': 'Signalement reçu avec succès !'}), 200
    except Exception as e:
        traceback.print_exc()  # Afficher plus de détails sur l'erreur dans les logs
        return jsonify({'error': str(e)}), 500


 # Route pour obtenir l'état des points de collecte
@trash_bp.route('/points-status', methods=['GET'])
def get_points_status():
    try:
        # Récupérer les poubelles avec les statuts "plein" et "vide"
        total_points = TrashBin.query.count()
        collected_points = TrashBin.query.filter_by(status='vide').count()  # Points de collecte terminés (vides)
        uncollected_points = TrashBin.query.filter_by(status='plein').count()  # Points de collecte restants (pleins)

        # Retourner les données pour l'affichage du tableau de bord
        return jsonify({
            'total_points': total_points,
            'collected_points': collected_points,
            'uncollected_points': uncollected_points
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
       

# Route pour mettre à jour le statut d'une poubelle à "vide"
@trash_bp.route('/update-trash-bin-status/<int:bin_id>', methods=['PUT'])
def update_trash_bin_status(bin_id):
    try:
        # Récupérer la poubelle dans la base de données
        trash_bin = TrashBin.query.get(bin_id)
        if not trash_bin:
            return jsonify({'error': 'Poubelle non trouvée'}), 404

        # Mettre à jour le statut de la poubelle à "vide"
        trash_bin.status = 'vide'
        trash_bin.last_collected = datetime.utcnow()

        # Enregistrer les modifications dans la base de données
        db.session.commit()

        return jsonify({'message': 'Statut de la poubelle mis à jour avec succès'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Route pour enregistrer la collecte des poubelles une fois terminée
@trash_bp.route('/collect-data', methods=['POST'])
def collect_data():
    data = request.json
    if not data or 'collectedBins' not in data or 'coordinates' not in data:
        return jsonify({'error': 'Données manquantes'}), 400

    collected_bins = data['collectedBins']
    coordinates = data['coordinates']

    try:
        # Parcourir chaque poubelle collectée pour enregistrer la collecte
        for bin_id in collected_bins:
            trash_bin = TrashBin.query.get(bin_id)
            if trash_bin:
                trash_bin.status = 'vide'
                trash_bin.last_collected = datetime.utcnow()

        # Enregistrer les modifications dans la base de données
        db.session.commit()

        # Log des points collectés
        return jsonify({
            'message': 'Collecte terminée avec succès',
            'collected_bins': collected_bins,
            'coordinates': coordinates
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500      