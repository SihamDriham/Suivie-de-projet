const JourEvent = require('../models/jourEvent'); 

exports.getJourEvenementByEvenementId = async(req, res) =>{
  const evenementId = req.params.evenementId; 
  try {
    const joursEvenement = await JourEvent.find({ evenement: evenementId }).exec();
    if (!joursEvenement || joursEvenement.length === 0) {
      return res.status(404).json({ message: "Aucun jour associé à cet événement." });
    }
    res.json({ joursEvenement: joursEvenement });
  } catch (error) {
    console.error("Erreur lors de la récupération des jours de l'événement :", error);
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des jours de l'événement." });
  }
}

exports.getJour = async (req, res) => {
    const jourId = req.params.jourId;
    try {
      const jour = await JourEvent.findById(jourId);
  
      if (!jour) {
        return res.status(404).json({ error: 'Jour non trouvé' });
      }
      res.json(jour);
    } catch (error) {
      console.error("Erreur lors de la récupération du jour :", error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
};