// pages/api/updateStatus.js

let optimalPathData = null;

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Vérification que le corps de la requête contient des données
        if (!req.body) {
            return res.status(400).json({ error: 'Aucune donnée reçue' });
        }

        // Stocke les données dans la variable globale optimalPathData
        optimalPathData = req.body;
        console.log('Le chemin optimal est:', optimalPathData);
        return res.status(200).json(optimalPathData);
        
    } else if (req.method === 'GET') {
        if (optimalPathData) {
            return res.status(200).json(optimalPathData);
        } else {
            return res.status(404).json({ error: 'Aucune donnée trouvée' });
        }
        
    } else if (req.method === 'DELETE') {
        // Réinitialise la variable optimalPathData à null
        optimalPathData = null;
        console.log('Le chemin optimal a été réinitialisé');
        return res.status(200).json({ message: 'Chemin optimal réinitialisé avec succès' });

    } else {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
