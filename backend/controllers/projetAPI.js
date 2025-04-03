const Projet = require('../models/projet');
const Statut = require('../models/statut');
const RPU = require('../models/RPU')
const Tache = require('../models/tache')
const Phase = require('../models/phase')
const Evenement = require('../models/evenement')
const JourEvent = require('../models/jourEvent')
const DetailsJour = require('../models/jourDetails')

//Add
exports.addProjet = async (req, res) => {
  const {nomP,descriptionP,dateDebutP,dateFinEst,budget } = req.body;
  try {
      const defaultStatut = await Statut.findOne({ etat: 'À faire' });
      if (!defaultStatut) {
          throw new Error("Statut par défaut introuvable");
      }

      // Créer une nouvelle instance de projet avec l'ID du statut par défaut
      const projet = new Projet({
        nomP: nomP,
        descriptionP: descriptionP,
        dateDebutP: dateDebutP,
        dateFinEst: dateFinEst,
        budget: budget,
        statut_id: defaultStatut._id // Utiliser l'ID du statut par défaut
      });

      await projet.save();
      res.json({ message: 'Ajout réussi' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
  
//Update
exports.updateProjet = async(req,res)=>{
 const {nomP,descriptionP,dateDebutP,dateFinEst,dateFinP,budget,statut_id} = req.body
 try{
  await Projet.findByIdAndUpdate(req.params.id,{
   nomP: nomP,
   descriptionP: descriptionP,
   dateDebutP: dateDebutP,
   dateFinEst: dateFinEst,
   dateFinP: dateFinP,
   budget: budget,
   statut_id: statut_id
  });
  res.json({ message: 'updated successful' })
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//Delete
exports.deleteProjet = async (req, res) => {
  try {
    const projetId = req.params.id;
    const deletedPhases = await Phase.find({ projet_id: projetId });
    const phaseIds = deletedPhases.map(phase => phase._id);
    await Tache.deleteMany({ phase_id: { $in: phaseIds } });
    await Phase.deleteMany({ projet_id: projetId });
    await RPU.deleteMany({ projet_id: projetId });
    const events = await Evenement.find({ projet_id: projetId });
    const eventIds = events.map(event => event._id);
    const jourEvents = await JourEvent.find({ evenement: { $in: eventIds } });
    const jourEventIds = jourEvents.map(jourEvent => jourEvent._id);
    await DetailsJour.deleteMany({ jourEvenement: { $in: jourEventIds } });
    await JourEvent.deleteMany({ evenement: { $in: eventIds } });
    await Evenement.deleteMany({ projet_id: projetId });
    const deletedProject = await Projet.findByIdAndDelete(projetId);

    if (!deletedProject) {
      return res.status(401).json({ message: 'Project not found' });
    }

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Afficher
exports.getProjects = async (req, res) => {
  try {
    const projets = await Projet.find().populate('statut_id', 'etat'); // Peupler le champ 'statut_id' avec le champ 'etat' du modèle Statut
    const projetsFormatted = projets.map(projet => ({
      _id: projet._id,
      nomP: projet.nomP,
      descriptionP: projet.descriptionP,
      dateDebutP: projet.dateDebutP,
      dateFinEst: projet.dateFinEst,
      dateFinP: projet.dateFinP,
      budget: projet.budget,
      statut: projet.statut_id.etat // Récupérer le nom du statut à partir du champ peuplé 'statut_id'
    }));
    res.json(projetsFormatted);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProjetById = async (req, res) => {
  try {
    const projetId = req.params.id; // Récupérer l'ID du projet depuis l'URL
    const projet = await Projet.findById(projetId).populate('statut_id', 'etat');
    if (!projet) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }
    // Formater les données avant de les renvoyer
    const projetFormatted = {
      _id: projet._id,
      nomP: projet.nomP,
      descriptionP: projet.descriptionP,
      dateDebutP: projet.dateDebutP,
      dateFinEst: projet.dateFinEst,
      dateFinP: projet.dateFinP,
      budget: projet.budget,
      statut: projet.statut_id.etat
    };
    res.json(projetFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

//search
exports.searchProject = async (req, res) => {
  try {
      const searchTerm = req.params.searchTerm;

      const projetsTrouvees = await Projet.aggregate([
          {
              $lookup: {
                  from: 'statuts', // Remplacez 'statuts' par le nom de votre collection de statuts
                  localField: 'statut_id',
                  foreignField: '_id',
                  as: 'statut'
              }
          },
          {
              $match: {
                  $or: [
                      { nomP: { $regex: searchTerm, $options: 'i' } },
                      { descriptionP: { $regex: searchTerm, $options: 'i' } },
                      { budget: { $regex: searchTerm, $options: 'i' } },
                      { dateDebutP: { $regex: searchTerm, $options: 'i' } },
                      { dateFinEst: { $regex: searchTerm, $options: 'i' } },
                      { dateFinP: { $regex: searchTerm, $options: 'i' } },
                      { 'statut.etat': { $regex: searchTerm, $options: 'i' } }
                  ]
              }
          }
      ]);

      const projetsFormatted = projetsTrouvees.map(projet => ({
        _id: projet._id,
        nomP: projet.nomP,
        descriptionP: projet.descriptionP,
        dateDebutP: projet.dateDebutP,
        dateFinEst: projet.dateFinEst,
        dateFinP: projet.dateFinP,
        budget: projet.budget,
          statut: projet.statut[0].etat
      }));

      res.json(projetsFormatted);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la recherche des projets.' });
  }
};

exports.searchProjet = async (req, res) => {
  try {
      const searchTerm = req.params.searchTerm;
      const userId = req.userId; 

      const projetsTrouvees = await Projet.aggregate([
          {
              $lookup: {
                  from: 'statuts', // Remplacez 'statuts' par le nom de votre collection de statuts
                  localField: 'statut_id',
                  foreignField: '_id',
                  as: 'statut'
              }
          },
          {
              $match: {
                user_id: new ObjectId(userId),
                  $or: [
                      { nomP: { $regex: searchTerm, $options: 'i' } },
                      { descriptionP: { $regex: searchTerm, $options: 'i' } },
                      { budget: { $regex: searchTerm, $options: 'i' } },
                      { dateDebutP: { $regex: searchTerm, $options: 'i' } },
                      { dateFinEst: { $regex: searchTerm, $options: 'i' } },
                      { dateFinP: { $regex: searchTerm, $options: 'i' } },
                      { 'statut.etat': { $regex: searchTerm, $options: 'i' } }
                  ]
              }
          }
      ]);

      const projetsFormatted = projetsTrouvees.map(projet => ({
        _id: projet._id,
        nomP: projet.nomP,
        descriptionP: projet.descriptionP,
        dateDebutP: projet.dateDebutP,
        dateFinEst: projet.dateFinEst,
        dateFinP: projet.dateFinP,
        budget: projet.budget,
          statut: projet.statut[0].etat
      }));

      res.json(projetsFormatted);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la recherche des projets.' });
  }
};

//Statistique
exports.statutNombre = async (req, res) => {
  const { etat } = req.body; 
  try {
    const statut = await Statut.findOne({ etat: etat });
    if (!statut) {
      return res.status(404).json({ message: "Statut non trouvé" });
    }

    const count = await Projet.countDocuments({ statut_id: statut._id });
    res.json({ count: count });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande" });
  }
}

//Budget Total
exports.budgetTotal = async (req, res) => {
  try {
    const result = await Projet.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" }
        }
      }
    ]);
    res.json({ total: result[0].total }); // Renvoie la somme dans la réponse JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue lors du calcul du budget total.' });
  }
};

exports.budgetTotal2 = async (req, res) => {
  try {
    const statutEnCours = await Statut.findOne({ etat: 'En cours' });
    const result = await Projet.aggregate([
      {
        $match: {
          statut_id: statutEnCours._id // Filtrer les projets avec le statut en cours
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$budget" }
        }
      }
    ]);
    res.json({ total: result[0] ? result[0].total : 0 }); // Renvoie la somme dans la réponse JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Une erreur est survenue lors du calcul du budget total.' });
  }
};
