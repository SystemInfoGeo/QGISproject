// pages/api/updateStatus.js

let optimalPathData = null;

export default function handler(req, res) {
    switch (req.method) {
        case 'POST':
            if (!req.body) {
                return res.status(400).json({ error: 'Aucune donnée reçue' });
            }

            optimalPathData = req.body;
            console.log('Le chemin optimal est:', optimalPathData);
            return res.status(200).json(optimalPathData);

        case 'GET':
            if (optimalPathData) {
                return res.status(200).json(optimalPathData);
            } else {
                return res.status(404).json({ error: 'Aucune donnée trouvée' });
            }

        case 'DELETE':
            optimalPathData = null;
            console.log('Le chemin optimal a été réinitialisé');
            return res.status(200).json({ message: 'Chemin optimal réinitialisé avec succès' });

        default:
            return res.status(405).json({ error: 'Méthode non autorisée' });
    }
}
