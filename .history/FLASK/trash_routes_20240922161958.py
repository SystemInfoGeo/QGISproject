from flask import Blueprint, request, jsonify
from models import db, TrashBin
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
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


# Route pour ajouter une poubelle
@trash_bp.route('/add-trash-bin', methods=['POST'])
def add_trash_bin():
    try:
        data = request.json
        name = data.get('name')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        status = data.get('status', 'vide')

        if not name or not isinstance(latitude, (float, int)) or not isinstance(longitude, (float, int)):
            return jsonify({"error": "Le nom, la latitude et la longitude sont requis"}), 400

        new_bin = TrashBin(name=name, latitude=latitude, longitude=longitude, status=status)
        db.session.add(new_bin)
        db.session.commit()

        return jsonify({"message": "Poubelle ajoutée avec succès"}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Route pour récupérer toutes les poubelles
@trash_bp.route('/get_all-trash-bins', methods=['GET'])
def get_all_trash_bins():
    try:
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


# Route pour mettre à jour une poubelle
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
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Route pour supprimer une poubelle
@trash_bp.route('/delete-trash-bin/<int:id>', methods=['DELETE'])
def delete_trash_bin(id):
    try:
        trash_bin = TrashBin.query.get(id)
        if not trash_bin:
            return jsonify({"error": "Poubelle non trouvée"}), 404

        db.session.delete(trash_bin)
        db.session.commit()
        return jsonify({"message": "Poubelle supprimée avec succès"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Route pour mettre à jour le statut d'une poubelle
@trash_bp.route('/update-trash-bin-status/<int:bin_id>', methods=['PUT'])
def update_trash_bin_status(bin_id):
    try:
        trash_bin = TrashBin.query.get(bin_id)
        if not trash_bin:
            return jsonify({'error': 'Poubelle non trouvée'}), 404

        data = request.json
        new_status = data.get('status')
        if new_status is None:
            return jsonify({"error": "Aucun statut fourni"}), 400

        trash_bin.status = new_status
        trash_bin.last_collected = datetime.utcnow() if new_status == 'vide' else trash_bin.last_collected
        db.session.commit()

        return jsonify({'message': 'Statut mis à jour avec succès'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Route pour enregistrer les données de collecte
@trash_bp.route('/collect-data', methods=['POST'])
def collect_data():
    try:
        data = request.json
        collected_bins = data.get('collectedBins')
        coordinates = data.get('coordinates')

        if not collected_bins or not coordinates:
            return jsonify({'error': 'Données manquantes'}), 400

        for bin_id in collected_bins:
            trash_bin = TrashBin.query.get(bin_id)
            if not trash_bin:
                return jsonify({'error': f'Poubelle avec l\'ID {bin_id} non trouvée'}), 404
            trash_bin.status = 'vide'
            trash_bin.last_collected = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Collecte terminée avec succès',
            'collected_bins': collected_bins,
            'coordinates': coordinates
        }), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Route pour obtenir le statut des points (collectés/non collectés)
@trash_bp.route('/points-status', methods=['GET'])
def get_points_status():
    try:
        total_points = TrashBin.query.count()
        collected_points = TrashBin.query.filter_by(status='vide').count()
        uncollected_points = TrashBin.query.filter_by(status='plein').count()

        return jsonify({
            'total_points': total_points,
            'collected_points': collected_points,
            'uncollected_points': uncollected_points
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@app.route('/report-bin', methods=['POST'])
def report_bin():
    data = request.json
    
    # Vérifier que toutes les données nécessaires sont présentes
    if not all(key in data for key in ('lat', 'lng', 'status')):
        return jsonify({"error": "Missing data"}), 400
    
    new_bin = TrashBin(
        latitude=data['lat'],
        longitude=data['lng'],
        status=data['status'],
        comments=data.get('comments', '')
    )
    
    db.session.add(new_bin)
    db.session.commit()

    return jsonify({"message": "Signalement reçu!"}), 201        

