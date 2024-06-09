import random
from PyQt5.QtCore import QTimer, QTime
from qgis.core import QgsProject, QgsSymbol, QgsSingleSymbolRenderer, QgsWkbTypes
from PyQt5.QtGui import QColor

# Liste globale pour stocker les coordonnées des points devenus rouges
points_rouges_coords = []

def changer_couleur_couche(layer, couleur):
    """
    Change la couleur de la couche spécifiée et enregistre les coordonnées des points devenus rouges.
    """
    symbol = QgsSymbol.defaultSymbol(layer.geometryType())
    symbol.setColor(couleur)
    renderer = QgsSingleSymbolRenderer(symbol)
    layer.setRenderer(renderer)
    layer.triggerRepaint()
    QgsProject.instance().write()

    # Enregistrer les coordonnées des points devenus rouges
    for feature in layer.getFeatures():
        geom = feature.geometry()
        if geom.isEmpty() or geom.type() != QgsWkbTypes.PointGeometry:
            continue
        point = geom.asPoint()
        points_rouges_coords.append({"latitude": point.y(), "longitude": point.x()})

def reset_state():
    
def random_color_change():
    """
    Change la couleur de quelques points aléatoirement à rouge avec des délais différents.
    Cette fonction s'arrête après 2 minutes.
    """
    # Obtenir les couches de points
    layers = [QgsProject.instance().mapLayersByName(f'point{i}')[0] for i in range(1, 6)]

    # Durée totale en millisecondes (2 minutes)
    total_duration = 120000  # 2 minutes

    # Déterminer l'heure de fin
    end_time = QTime.currentTime().addMSecs(total_duration)

    # Vérifier si le temps est écoulé à chaque fois qu'un point est sur le point de changer de couleur
    def change_if_time_allows(layer, couleur):
        if QTime.currentTime() < end_time:
            changer_couleur_couche(layer, couleur)

    # Sélectionner aléatoirement les points à changer de couleur
    points_to_change = random.sample(layers, random.randint(1, len(layers)))

    # Déterminer des délais aléatoires pour chaque point sélectionné dans l'intervalle de 2 minutes
    for layer in points_to_change:
        delay = random.randint(0, total_duration)
        # Définir une fonction qui vérifie si le délai est écoulé
        QTimer.singleShot(delay, lambda l=layer: change_if_time_allows(l, QColor("red")))

    # Arrêter la fonction après 2 minutes
    stop_timer = QTimer()
    stop_timer.setSingleShot(True)
    stop_timer.timeout.connect(lambda: print("Changement de couleur terminé"))
    stop_timer.start(total_duration)

# Démarrer le changement de couleur une fois
random_color_change()

# Après le changement de couleur, afficher les coordonnées des points devenus rouges
def afficher_points_rouges():
    print("Points devenus rouges:")
    for point in points_rouges_coords:
        print(point)

# Afficher les points rouges après le délai
afficher_timer = QTimer()
afficher_timer.setSingleShot(True)
afficher_timer.timeout.connect(lambda: afficher_points_rouges())
afficher_timer.start(120000)
