// Importer `fetch` pour envoyer des requêtes HTTP
export default async function handler(req, res) {
    if (req.method === 'PUT') {
      // Extraire le binId (ID de la poubelle) et le nouveau statut depuis le corps de la requête
      const { binId, status } = req.body;
  
      // Vérifiez que binId et status sont fournis
      if (!binId || !status) {
        return res.status(400).json({ error: 'binId et status sont requis' });
      }
  
      try {
        // URL de l'API Flask pour mettre à jour le statut de la poubelle
        const apiUrl = `http://localhost:5000/update-trash-bin-status/${binId}`;
  
        // Envoyer une requête PUT à l'API Flask pour mettre à jour le statut
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }), // Envoyer le nouveau statut dans le corps de la requête
        });
  
        // Vérifier si la requête a réussi
        if (!response.ok) {
          const errorData = await response.json();
          return res.status(response.status).json({ error: errorData.error || 'Erreur lors de la mise à jour de la poubelle' });
        }
  
        // Répondre au client Next.js si la mise à jour est réussie
        return res.status(200).json({ message: 'Statut de la poubelle mis à jour avec succès' });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
      }
    } else {
      // Gérer la méthode qui n'est pas un PUT
      res.setHeader('Allow', ['PUT']);
      return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
    }
  }
  