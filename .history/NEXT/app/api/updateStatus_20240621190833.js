// pages/api/updateStatus.js

export default function handler(req, res) {
    if (req.method === 'POST') {
      const data = req.body;
      console.log('Données reçues de Flask:', data);
  
    
  
      res.status(200).json(data);
    } else {
      res.status(405).end(); // Méthode non autorisée
    }
  }
  