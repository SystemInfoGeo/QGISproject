// pages/api/updateStatus.js

let optimalPathData = null;

export default function handler(req, res) {
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
    } else {
        res.status(405).end(); 
    }
}

