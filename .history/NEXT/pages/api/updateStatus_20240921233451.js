// pages/api/updateStatus.js

let optimalPathData = null;

export default function handler(req, res) {
    if (req.method === 'POST') {
        // Reçoit les données de Flask et les stocke dans la variable global optimalPathData
        optimalPathData = req.body;
        console.log('Le chemin optimal est:', optimalPathData);
        res.status(200).json(optimalPathData);
    } else if (req.method === 'GET') {
        if (optimalPathData) {
            res.status(200).json(optimalPathData);
        } else {
            res.status(404).json({ error: 'No data found' });
        }
    } else if (req.method === 'DELETE') {
        // Réinitialise la variable optimalPathData à null
        optimalPathData = null;
        console.log('Le chemin optimal a été réinitialisé');
        res.status(200).json({ message: 'optimalPathData reset successfully' });

    } else {
        res.status(405).end(); 
    }
}
