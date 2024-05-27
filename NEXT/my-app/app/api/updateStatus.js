// app/api/updateStatus.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
      // Gérer les cas où la méthode n'est pas POST
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
      return;
  }

  try {
      // Assurez-vous que le corps de la requête contient les informations nécessaires
      const data = req.body;
      if (!data || typeof data.status === 'undefined') {
          // Valider que les données nécessaires sont présentes
          res.status(400).json({ error: 'Données manquantes ou invalides' });
          return;
      }

      console.log('Données reçues:', data);

      // Ici, vous pouvez traiter les données reçues comme nécessaire
      // Par exemple, mettre à jour le statut de la commande de nettoyage dans votre base de données
      // Envoi d'email
      // Cette section peut être asynchrone si vous interagissez avec une base de données ou un service externe

      // Simulez une opération asynchrone, comme une interaction avec une base de données
      // await database.updateOrderStatus(data.id, data.status);

      // Informez que l'ordre a été reçu et traité avec succès. L'équipe de nettoyage est désormais prête à intervenir sur le terrain selon les directives établies
      res.status(200).json({ status: 'Succès', message: 'Statut mis à jour avec succès' });
  } catch (error) {
      console.error('Erreur lors du traitement de la requête:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
  }
}
