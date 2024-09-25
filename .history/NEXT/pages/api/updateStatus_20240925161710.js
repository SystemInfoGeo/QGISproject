// pages/api/updateStatus.js


let optimalPathData = null;

export default function handler(req, res) {
    // Désactivation du cache pour cette route
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'POST') {
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
        optimalPathData = null;
        console.log('Le chemin optimal a été réinitialisé');
        res.status(200).json({ message: 'optimalPathData reset successfully' });
    } else {
        res.status(405).end();
    }
}



