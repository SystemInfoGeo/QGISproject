from flask import Blueprint, jsonify
from models import db, TrashBin  # Assurez-vous d'avoir un modèle TrashBin pour les poubelles

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