const DetailJour = require('../models/jourDetails');
const JourEvenement = require('../models/jourEvent');
const Event = require('../models/evenement');

exports.addMultipleDetails = async (req, res) => {
  try {
    const detailsToAdd = req.body;
    const insertedDetails = await DetailJour.insertMany(detailsToAdd);
    res.status(201).json({ message: 'Détails ajoutés avec succès', insertedDetails });
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'ajout des détails :", error);
    res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout des détails. Veuillez réessayer." });
  }
};

exports.getEventDetails = async (req, res) => {
  const eventId = req.params.eventId;

  try {
      // Récupérer l'événement principal
      const event = await Event.findById(eventId);

      // Récupérer tous les jours de l'événement
      const joursEvenement = await JourEvenement.find({ evenement: eventId });

      // Récupérer les détails de chaque jour
      const detailsPromises = joursEvenement.map(async (jour) => {
          const details = await DetailJour.find({ jourEvenement: jour._id });
          return {
              jour: jour,
              details: details
          };
      });

      // Attendre toutes les promesses de récupération des détails
      const jourDetails = await Promise.all(detailsPromises);

      // Retourner les données sous forme de JSON
      res.json({
          event: event,
          joursEvenement: jourDetails
      });
  } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'événement:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des détails de l'événement" });
  }
};

exports.updateDetailJour = async (req, res) => {
  const id = req.params.id;
  const { heureDebut, heureFin, titre } = req.body;

  try {
    const detailJour = await DetailJour.findById(id);

    if (!detailJour) {
      return res.status(404).json({ message: 'Le détail spécifié n\'existe pas' });
    }

    detailJour.heureDebut = heureDebut;
    detailJour.heureFin = heureFin;
    detailJour.titre = titre;

    const updatedDetailJour = await detailJour.save();

    res.status(200).json(updatedDetailJour);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la mise à jour du détail de jour : ${error.message}` });
  }
};

exports.getDetailJourById = async (req, res) => {
  const id = req.params.id; // Extraire l'ID correctement
  try {
    const detailJour = await DetailJour.findById(id)
      .populate('jourEvenement', 'date'); // Sélectionner uniquement le champ 'date' de jourEvenement

    if (!detailJour) {
      return res.status(404).json({ message: 'Le détail spécifié n\'existe pas' });
    }

    // Formatage de la date pour afficher uniquement la date sans l'heure
    const dateJourEvenement = new Date(detailJour.jourEvenement.date).toISOString().split('T')[0];

    // Construction de l'objet de réponse avec les champs nécessaires
    const detailJourAvecDate = {
      heureDebut: detailJour.heureDebut,
      heureFin: detailJour.heureFin,
      titre: detailJour.titre,
      dateJourEvenement: dateJourEvenement,
    };

    res.status(200).json(detailJourAvecDate); // Envoyer la réponse JSON avec le statut 200
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération du détail de jour : ${error.message}` });
  }
};

exports.deleteDetailJour = async (req, res) => {
  const id = req.params.id;

  try {
    const detail = await DetailJour.findByIdAndDelete(id);

    if (!detail) {
      return res.status(404).json({ message: 'Le détail spécifié n\'existe pas' });
    }

    res.status(200).json({ message: 'Détail supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la suppression du détail : ${error.message}` });
  }
};