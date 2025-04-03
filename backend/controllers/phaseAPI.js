const Phase = require('../models/phase');
const Statut = require('../models/statut');
const Projet = require('../models/projet');
const Tache = require('../models/tache');
const { Types: { ObjectId } } = require('mongoose');

//Add

exports.ajouterPhase = async (req, res) => {
  try {
    const { projetId } = req.params;
    const { libelle, desc } = req.body;

    const statutAFaire = await Statut.findOne({ etat: "À faire" });
    const statutEnCours = await Statut.findOne({ etat: 'En cours' });
    const statutTermine = await Statut.findOne({ etat: 'Terminé' });

    if (!statutAFaire) {
      throw new Error("Le statut 'À faire' n'a pas été trouvé dans la base de données.");
    }

    const projet = await Projet.findById(projetId);
    if (!projet) {
      throw new Error("Projet introuvable.");
    }
    if (projet.statut_id.equals(statutTermine._id)) {
      projet.statut_id = statutEnCours._id;
      await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});
      await projet.save();
    }

    const nouvellePhase = new Phase({
      libelle,
      desc,
      statut_id: statutAFaire._id,
      projet_id: projetId
    });

    await nouvellePhase.save();

    res.status(201).json({ message: 'Nouvelle phase ajoutée avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la phase :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

//Update
exports.updatePhase = async(req,res)=>{
 const {libelle,desc} = req.body
 try{
  await Phase.findByIdAndUpdate(req.params.id,{
    libelle : libelle,
    desc : desc
  });
  res.json({ message: 'updated successful' })
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//Delete
exports.deletePhase = async (req, res) => {
  const phaseId = req.params.phaseId;
  try {
    const deletedPhase = await Phase.findByIdAndDelete(phaseId);
    if (!deletedPhase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
    await Tache.deleteMany({ phase_id: phaseId });
    const projetId = deletedPhase.projet_id;
    const projet = await Projet.findById(projetId);
    if (!projet) {
      throw new Error("Projet introuvable.");
    }

    const statutAFaire = await Statut.findOne({ etat: 'À faire' });
    const statutTermine = await Statut.findOne({ etat: 'Terminé' });

    const phasesRestantes = await Phase.find({ projet_id: projetId });

    if (phasesRestantes.length === 0) {
      projet.statut_id = statutAFaire._id;
      await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
    } else {
      const toutesPhasesTerminees = phasesRestantes.every(phase => phase.statut_id.toString() === statutTermine._id.toString());
      const toutesPhasesAFaire = phasesRestantes.every(phase => phase.statut_id.toString() === statutAFaire._id.toString());

      if (toutesPhasesTerminees) {
        projet.statut_id = statutTermine._id;
        projet.dateFinP = Date.now();
      } else if (toutesPhasesAFaire) {
        projet.statut_id = statutAFaire._id;
        await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
      }
    }
    await projet.save();
    res.json({ message: 'Phase deleted successfully' });
  } catch (error) {
    console.error('Error deleting phase:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getPhase = async(req,res)=>{
 const id = req.params.id
 const phase = await Phase.findById(id)
 res.json(phase)
}

exports.getPhasesByProjetId = async (req, res) => {
  try {
    const { projetId } = req.params;

    // Trouver les phases associées à un projet spécifique
    const phases = await Phase.find({ projet_id: projetId }).populate('statut_id');

    // Formater les phases pour inclure le statut
    const phasesWithStatut = phases.map(phase => ({
      _id: phase._id,
      libelle: phase.libelle,
      desc: phase.desc,
      statut: phase.statut_id.etat
    }));

    res.status(200).json(phasesWithStatut);
  } catch (error) {
    console.error('Erreur lors de la récupération des phases par ID de projet :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};


//search

exports.searchPhase = async (req, res) => {
  try {
    const { searchTerm, projetId } = req.params;

    const phasesTrouvees = await Phase.aggregate([
      {
        $match: {
          projet_id: new ObjectId(projetId),
          $or: [
            { libelle: { $regex: searchTerm, $options: 'i' } },
            { desc: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      },
      {
        $lookup: {
          from: 'statuts',
          localField: 'statut_id',
          foreignField: '_id',
          as: 'statut'
        }
      },
      {
        $unwind: '$statut'
      }
    ]);

    const phasesFormatted = phasesTrouvees.map(phase => ({
      _id: phase._id,
      libelle: phase.libelle,
      desc: phase.desc,
      statut: phase.statut.etat // Assurez-vous que 'etat' est un champ de 'Statut'
    }));

    res.json(phasesFormatted);
  } catch (error) {
    console.error('Erreur lors de la recherche des phases :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

