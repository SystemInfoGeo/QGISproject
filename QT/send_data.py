from PyQt5.QtNetwork import QNetworkAccessManager, QNetworkRequest, QNetworkReply
from PyQt5.QtCore import QUrl, QByteArray
from PyQt5.QtWidgets import QApplication
import sys
import json

def main():
    app = QApplication(sys.argv)

    # Créer une instance de QNetworkAccessManager
    manager = QNetworkAccessManager()

    # Construire l'URL du serveur Flask
    url = QUrl("http://127.0.0.1:5000/data")  # Remplacez l'adresse et le port par ceux de votre serveur Flask

    # Créer une requête réseau avec l'URL et le type de contenu
    request = QNetworkRequest(url)
    request.setHeader(QNetworkRequest.ContentTypeHeader, "application/json")

    # Créer un objet JSON avec les données géospatiales, marquant le début et la fin au même point
    data = [
        {"latitude": 36.71365, "longitude": 4.04535, "is_start": True},  # Point de départ
        {"latitude": 36.71515, "longitude": 4.07257},
        {"latitude": 36.67798, "longitude": 4.05681},
        {"latitude": 36.69837, "longitude": 4.04905},
        {"latitude": 36.72212, "longitude": 4.02928},
        {"latitude": 36.71566, "longitude": 4.07022},
        {"latitude": 36.71365, "longitude": 4.04535, "is_end": True}   # Point d'arrivée (identique au départ)
    ]

    # Convertir l'objet JSON en chaîne JSON
    data_json = json.dumps(data)
    data_bytes = QByteArray(data_json.encode())

    # Envoyer la requête POST avec les données
    reply = manager.post(request, data_bytes)

    # Connecter le signal finished de QNetworkReply pour traiter la réponse
    def handle_response():
        if reply.error() == QNetworkReply.NoError:
            # Les données ont été envoyées avec succès, traiter la réponse si nécessaire
            response = str(reply.readAll(), 'utf-8')  # Convertir la réponse en chaîne
            print(response)
        else:
            # Gérer l'erreur
            print("Error:", reply.errorString())

        reply.deleteLater()

    reply.finished.connect(handle_response)

    # Lancer l'application Qt
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
