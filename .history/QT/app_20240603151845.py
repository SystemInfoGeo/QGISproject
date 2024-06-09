import os
import sys
from PyQt5.QtCore import QTimer
from PyQt5.QtGui import QColor
from PyQt5.QtWidgets import QApplication
from qgis.core import QgsApplication, QgsProject, QgsSymbol, QgsSingleSymbolRenderer

# Configurer les variables d'environnement pour QGIS
os.environ['QGIS_PREFIX_PATH'] = r'C:\Program Files\QGIS 3.34.3'
os.environ['PATH'] += r';C:\Program Files\QGIS 3.34.3\bin;C:\Program Files\QGIS 3.34.3\apps\qgis\bin;C:\Program Files\QGIS 3.34.3\apps\Qt5\bin'
os.environ['PYTHONPATH'] = r'C:\Program Files\QGIS 3.34.3\apps\qgis\python'

def changer_couleur_couche(layer, couleur):
    symbol = QgsSymbol.defaultSymbol(layer.geometryType())
    symbol.setColor(couleur)
    renderer = QgsSingleSymbolRenderer(symbol)
    layer.setRenderer(renderer)
    layer.triggerRepaint()
    QgsProject.instance().write()

# Initialiser l'application QGIS
QgsApplication.setPrefixPath("C:\Program Files\QGIS 3.34.3\apps\qgis", True)
qgs = QgsApplication([], False)
qgs.initQgis()

# Créer une application PyQt5
app = QApplication([])

# Charger le projet QGIS
project = QgsProject.instance()
path = 
project.read('C:\Users\SAV\Downloads\5layers.qgz')

# Configurer les couches et les changements de couleur
layers = [QgsProject.instance().mapLayersByName(f'point{i}')[0] for i in range(1, 6)]
couleurs = [QColor("red"), QColor("red"), QColor("red"), QColor("red"), QColor("red")]
delais = [2000, 5000, 9000, 12000, 15000]  # en millisecondes

for i, layer in enumerate(layers):
    QTimer.singleShot(delais[i], lambda l=layer, c=couleurs[i]: changer_couleur_couche(l, c))

# Démarrer l'application PyQt5
app.exec_()

# Nettoyer QGIS
qgs.exitQgis()
