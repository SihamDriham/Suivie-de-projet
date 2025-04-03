const Tache = require('../models/tache')
const Statut = require('../models/statut')
const User = require('../models/user');
const Projet = require('../models/projet');
const Phase = require('../models/phase');
const Notification = require('../models/notification');
const { Types: { ObjectId } } = require('mongoose');

exports.addTache = async (req, res) => {
    const { nomT, descriptionT, dateDebutT, dateFinT, user_id } = req.body;
    const { phaseId } = req.params;
  
    try {
      const defaultStatut = await Statut.findOne({ etat: 'À faire' });
      const defaultStatutN = await Statut.findOne({ etat: 'No lu' });
  
      if (!defaultStatut) {
        throw new Error("Statut par défaut introuvable");
      }
  
      const phase = await Phase.findById(phaseId).populate('projet_id');
      if (!phase) {
        throw new Error("Phase introuvable");
      }
  
      const statutEnCours = await Statut.findOne({ etat: 'En cours' });
      const statutTermine = await Statut.findOne({ etat: 'Terminé' });

      if (phase.statut_id.equals(statutTermine._id)) {
        phase.statut_id = statutEnCours._id;
        await phase.save();    
        const projet = phase.projet_id;
        const projetId = phase.projet_id;
        if (projet.statut_id.equals(statutTermine._id)) {
            projet.statut_id = statutEnCours._id;
            await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});
            await projet.save();
        }
      }
  
      const tache = new Tache({
        nomT: nomT,
        descriptionT: descriptionT,
        dateDebutT: dateDebutT,
        dateFinT: dateFinT,
        statut_id: defaultStatut._id,
        phase_id: phaseId,
        user_id: user_id,
      });
      await tache.save();
  
      const newNotification = new Notification({
        contenuN: `Vous avez une nouvelle tâche assignée : ${nomT}. Consultez dès maintenant pour les détails`,
        typeN: 'Tâche attribuée',
        statut_id: defaultStatutN._id,
        user_id: user_id
      });
  
      await newNotification.save();
  
      res.json({ message: 'Tâche ajoutée avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

//Update
exports.updateTache = async (req, res) => {
    const { nomT, descriptionT, dateDebutT, dateFinT, statut_id, user_id } = req.body;
    const { projetId, phaseId } = req.params;
  
    try {
      const tache = await Tache.findById(req.params.id);
      if (!tache) {
        return res.status(404).json({ message: 'Tâche introuvable' });
      }
  
      const defaultStatutN = await Statut.findOne({ etat: 'No lu' });
      const statutEnCours = await Statut.findOne({ etat: 'En cours' });
      const statutTermine = await Statut.findOne({ etat: 'Terminé' });
      const statutAFaire = await Statut.findOne({ etat: 'À faire' });
      const statutEnAttente = await Statut.findOne({ etat: 'En attente' });
  
      const previousUserId = tache.user_id;
      const isUserChanged = previousUserId.toString() !== user_id;
      const updatedTache = {
        nomT,
        descriptionT,
        dateDebutT,
        dateFinT,
        statut_id,
        phase_id: phaseId,
        user_id,
      };
  
      await Tache.findByIdAndUpdate(req.params.id, updatedTache);
  
      const phase = await Phase.findById(phaseId);
      if (!phase) {
        return res.status(404).json({ message: 'Phase introuvable' });
      }
  
      const projet = await Projet.findById(projetId);
      if (!projet) {
        return res.status(404).json({ message: 'Projet introuvable' });
      }
  
      const phaseTaches = await Tache.find({ phase_id: phaseId });
      const toutesTachesTerminees = phaseTaches.every(tache => tache.statut_id.toString() === statutTermine._id.toString());
      const toutesTachesAFaire = phaseTaches.every(tache => tache.statut_id.toString() === statutAFaire._id.toString());
  
      if (statut_id.toString() === statutEnCours._id.toString()) {
        phase.statut_id = statutEnCours._id;
        projet.statut_id = statutEnCours._id;
        await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
      } else if (statut_id.toString() === statutTermine._id.toString() && toutesTachesTerminees) {
        phase.statut_id = statutTermine._id;
        await phase.save();
        const projetPhases = await Phase.find({ projet_id: projetId });
        const toutesPhasesTerminees = projetPhases.every(phase => phase.statut_id.toString() === statutTermine._id.toString());
        if (toutesPhasesTerminees) {
          projet.statut_id = statutTermine._id;
          projet.dateFinP = Date.now();
        } else {
          projet.statut_id = statutEnCours._id;
          await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
        }
      } else if (statut_id.toString() === statutAFaire._id.toString() && toutesTachesAFaire) {
        phase.statut_id = statutAFaire._id;
        await phase.save();
        const projetFaire = await Phase.find({ projet_id: projetId });
        const toutesPhasesAFaire = projetFaire.every(phase => phase.statut_id.toString() === statutAFaire._id.toString());
        if (toutesPhasesAFaire) {
          projet.statut_id = statutAFaire._id;
        } else {
          projet.statut_id = statutEnCours._id;
        }
        await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
      } else if (statut_id.toString() === statutAFaire._id.toString()) {
        phase.statut_id = statutEnCours._id;
        projet.statut_id = statutEnCours._id;
        await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
      } else if (statut_id.toString() === statutTermine._id.toString()) {
        phase.statut_id = statutEnCours._id;
        projet.statut_id = statutEnCours._id;
        await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
      } else if (statut_id.toString() === statutEnAttente._id.toString()) {
        phase.statut_id = statutEnAttente._id;
        projet.statut_id = statutEnAttente._id;
        await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } });
      }
  
      await phase.save();
      await projet.save();
  
      if (isUserChanged) {
         const notificationPreviousUser = new Notification({
          contenuN: `La tâche ${nomT} a été réaffectée à un autre utilisateur.`,
          typeN: 'Tâche réaffectée',
          statut_id: defaultStatutN._id,
          user_id: previousUserId
        });
        await notificationPreviousUser.save();
          const notificationNewUser = new Notification({
          contenuN: 'Une nouvelle tâche vous a été attribuée.',
          typeN: 'Nouvelle tâche',
          statut_id: defaultStatutN._id,
          user_id: user_id
        });
        await notificationNewUser.save();
      } else {
        const newNotification = new Notification({
          contenuN: `La tâche ${nomT} a été modifiée. Consultez dès maintenant pour les détails.`,
          typeN: 'Tâche modifiée',
          statut_id: defaultStatutN._id,
          user_id: user_id
        });
        await newNotification.save();
      }
  
      res.json({ message: 'Mise à jour réussie' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur interne' });
    }
};

exports.updateTacheStatut = async(req,res)=>{
    const {statut_id} = req.body
    const {projetId} = req.params;

    try{
        const tache = await Tache.findById(req.params.id);
        if (!tache) {
            return res.status(404).json({ message: 'Tâche introuvable' });
        }    

        const phaseId = tache.phase_id;

        const statutEnCours = await Statut.findOne({ etat: 'En cours' });
        const statutTermine = await Statut.findOne({ etat: 'Terminé' });
        const statutAFaire = await Statut.findOne({ etat: 'À faire' });
        const statutEnAttente = await Statut.findOne({ etat: 'En attente' });
        const updatedTache = {
            statut_id: statut_id
        };
        await Tache.findByIdAndUpdate(req.params.id, updatedTache);
        const phase = await Phase.findById(phaseId);
        if (!phase) {
            return res.status(404).json({ message: 'Phase introuvable' });
        }
        const projet = await Projet.findById(projetId);
        if (!projet) {
            return res.status(404).json({ message: 'Projet introuvable' });
        }
        const phaseTaches = await Tache.find({ phase_id: phaseId });
        const toutesTachesTerminees = phaseTaches.every(tache => tache.statut_id.toString() === statutTermine._id.toString());
        const toutesTachesAFaire = phaseTaches.every(tache => tache.statut_id.toString() === statutAFaire._id.toString());
        if(statut_id.toString() === statutEnCours._id.toString()) {
            phase.statut_id = statutEnCours._id;
            projet.statut_id = statutEnCours._id;
            await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});
        }else if(statut_id.toString() === statutTermine._id.toString() && toutesTachesTerminees){
            phase.statut_id = statutTermine._id;
            await phase.save();
            projetPhases = await Phase.find({ projet_id: projetId });
            const toutesPhasesTerminees = projetPhases.every(phase => phase.statut_id.toString() === statutTermine._id.toString());
            if (toutesPhasesTerminees) {
                projet.statut_id = statutTermine._id;
                projet.dateFinP = Date.now();
            } else {
                projet.statut_id = statutEnCours._id; 
                await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});
            }
        }else if (statut_id.toString() === statutAFaire._id.toString() && toutesTachesAFaire) {
            phase.statut_id = statutAFaire._id;
            await phase.save();
            projetfaire = await Phase.find({ projet_id: projetId });
            const toutesPhasesAFaire = projetfaire.every(phase => phase.statut_id.toString() === statutAFaire._id.toString());
            if(toutesPhasesAFaire){
                projet.statut_id = statutAFaire._id;
            }else{
                projet.statut_id = statutEnCours._id;    
            }
            await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});
        } else if (statut_id.toString() === statutAFaire._id.toString()) {
            phase.statut_id = statutEnCours._id;
            projet.statut_id = statutEnCours._id;
            await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});
        } else if (statut_id.toString() === statutTermine._id.toString()) {
            phase.statut_id =statutEnCours._id;
            projet.statut_id = statutEnCours._id; 
            await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" }});   
        }else if (statut_id.toString() === statutEnAttente._id.toString()){
            phase.statut_id = statutEnAttente._id;
            projet.statut_id = statutEnAttente._id;
            await Projet.updateOne({ _id: projetId }, { $unset: { dateFinP: "" } }); 
        }
        await phase.save();
        await projet.save();
        res.json({ message: 'Mise à jour réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur interne' });
    }
}

//Delete
exports.deleteTache = async (req, res) => {
    try {
      const deletedTache = await Tache.findByIdAndDelete(req.params.id);
      if (!deletedTache) {
        return res.status(401).json({ message: 'Task not found' });
      }
  
      const phaseId = deletedTache.phase_id;
      const phase = await Phase.findById(phaseId);
  
      if (!phase) {
        return res.status(404).json({ message: 'Phase not found' });
      }
  
      const statutTermine = await Statut.findOne({ etat: 'Terminé' });
      const statutAFaire = await Statut.findOne({ etat: 'À faire' });
      const statutEnCours = await Statut.findOne({ etat: 'En cours' });
  
      const taches = await Tache.find({ phase_id: phaseId });
  
      if (taches.length === 0) {
        await Phase.findByIdAndUpdate(phaseId, { statut_id: statutAFaire._id });
      } else {
        const toutesTachesTerminees = taches.every(tache => tache.statut_id.toString() === statutTermine._id.toString());
        const toutesTachesAFaire = taches.every(tache => tache.statut_id.toString() === statutAFaire._id.toString());
  
        let phaseStatut = null;
        if (toutesTachesTerminees) {
          phaseStatut = statutTermine._id;
        } else if (toutesTachesAFaire) {
          phaseStatut = statutAFaire._id;
        }
  
        if (phaseStatut) {
          await Phase.findByIdAndUpdate(phaseId, { statut_id: phaseStatut });
        }
      }
  
      const phases = await Phase.find({ projet_id: phase.projet_id });
      const toutesPhasesTerminees = phases.every(p => p.statut_id.toString() === statutTermine._id.toString());
      const toutesPhasesAFaire = phases.every(p => p.statut_id.toString() === statutAFaire._id.toString());
  
      let projetStatut = null;
      if (toutesPhasesTerminees) {
        projetStatut = statutTermine._id;
      } else if (toutesPhasesAFaire) {
        projetStatut = statutAFaire._id;
      } else {
        projetStatut = statutEnCours._id;
      }
  
      if (projetStatut) {
        await Projet.findByIdAndUpdate(phase.projet_id, { statut_id: projetStatut });
      }
  
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

//Afficher
exports.getTasksWithNames = async (req, res) => {
    try {
        // Récupérer les tâches en peuplant les champs de référence avec les noms correspondants
        const taches = await (((Tache.find().populate('phase_id', 'libelle')).populate('projet_id', 'nomP')).populate('statut_id', 'etat')).populate('user_id', 'nomU');

        // Formater les données pour inclure les noms des phases, projets, statuts et utilisateurs
        const tachesFormatted = taches.map(tache => ({
            _id: tache._id,
            nomT: tache.nomT,
            descriptionT: tache.descriptionT,
            dateDebutT: tache.dateDebutT,
            dateFinT: tache.dateFinT,
            phase: tache.phase_id.libelle,
            statut: tache.statut_id.etat,
            utilisateur: tache.user_id.nomU
        }));

        res.json(tachesFormatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTasksWithNames2 = async (req, res) => {
    try {
        const { phaseId } = req.params;
        const filter = { phase_id: phaseId };
        const taches = await ((Tache.find(filter).populate('phase_id', 'libelle')).populate('statut_id', 'etat')).populate('user_id', 'nomU');
        const tachesFormatted = taches.map(tache => ({
            _id: tache._id,
            nomT: tache.nomT,
            descriptionT: tache.descriptionT,
            dateDebutT: tache.dateDebutT,
            dateFinT: tache.dateFinT,
            phase: tache.phase_id.libelle,
            statut: tache.statut_id.etat,
            utilisateur: tache.user_id.nomU
        }));
        res.json(tachesFormatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getTasksById = async (req, res) => {
    const taskId = req.params.id;
    try {
        const tache = await ((Tache.findById(taskId).populate('phase_id', 'libelle')).populate('statut_id', 'etat')).populate('user_id', 'nomU');

        if (!tache) {
            return res.status(404).json({ message: 'La tâche spécifiée n\'existe pas' });
        }

        const tachesFormatted = {
            _id: tache._id,
            nomT: tache.nomT,
            descriptionT: tache.descriptionT,
            dateDebutT: tache.dateDebutT,
            dateFinT: tache.dateFinT,
            phase: tache.phase_id.libelle,
            statut: tache.statut_id._id,
            utilisateur: tache.user_id._id
        };

        res.json(tachesFormatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getTasksByUser = async (req, res) => {
    const userId = req.userId; 
    const projetId = req.params.projetId;
    try {
        // Récupérer les phases du projet spécifié
        const phases = await Phase.find({ projet_id: projetId }).select('_id');

        if (!phases || phases.length === 0) {
            return res.status(404).json({ message: 'Aucune phase trouvée pour ce projet' });
        }

        // Récupérer les IDs des phases
        const phaseIds = phases.map(phase => phase._id);

        // Récupérer les tâches associées à l'utilisateur spécifié dans les phases du projet
        const taches = await Tache.find({ user_id: userId, phase_id: { $in: phaseIds } })
            .populate({
                path: 'phase_id',
                select: 'libelle projet_id',
                populate: { path: 'projet_id', select: 'nomP' }
            })
            .populate('statut_id', 'etat')
            .populate('user_id', 'nomU');

        if (!taches || taches.length === 0) {
            return res.status(404).json({ message: 'Aucune tâche trouvée pour cet utilisateur dans ce projet' });
        }

        // Formater les données pour inclure les noms des phases, projets, statuts et utilisateurs
        const tachesFormatted = taches.map(tache => ({
            _id: tache._id,
            nomT: tache.nomT,
            descriptionT: tache.descriptionT,
            dateDebutT: tache.dateDebutT,
            dateFinT: tache.dateFinT,
            phase: tache.phase_id.libelle,
            projet: tache.phase_id.projet_id.nomP,
            statut: tache.statut_id.etat,
            utilisateur: tache.user_id.nomU
        }));
        
        res.json(tachesFormatted);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};


//search
exports.searchTask = async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        const phaseId = req.params.phaseId;
        const projetId = req.params.projetId;

        const tasksTrouvees = await Tache.aggregate([
            {
                $match: {
                    phase_id: new ObjectId(phaseId),
                    $or: [
                        { nomT: { $regex: searchTerm, $options: 'i' } },
                        { descriptionT: { $regex: searchTerm, $options: 'i' } },
                        { dateDebutT: { $regex: searchTerm, $options: 'i' } },
                        { dateFinT: { $regex: searchTerm, $options: 'i' } }
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
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $lookup: {
                    from: 'phases',
                    localField: 'phase_id',
                    foreignField: '_id',
                    as: 'phase'
                }
            },
            {
                $unwind: '$phase'
            },
            {
                $lookup: {
                    from: 'projets',
                    localField: 'phase.projet_id',
                    foreignField: '_id',
                    as: 'projet'
                }
            },
            {
                $unwind: '$projet'
            },
            {
                $project: {
                    _id: 1,
                    nomT: 1,
                    descriptionT: 1,
                    dateDebutT: 1,
                    dateFinT: 1,
                    statut: '$statut.etat',
                    utilisateur: '$user.nomU',
                    phase: '$phase.libelle',
                    projet: '$projet.nomP'
                }
            }
        ]);

        // if (!tasksTrouvees || tasksTrouvees.length === 0) {
        //     return res.status(404).json({ message: 'Aucune tâche trouvée pour cette phase avec ce terme de recherche' });
        // }

        res.json(tasksTrouvees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche des tâches.' });
    }
};

exports.searchTache = async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        const userId = req.userId;
        const projetId = req.params.projetId;

        const phases = await Phase.find({ projet_id: projetId }).select('_id');

        if (!phases || phases.length === 0) {
            return res.status(404).json({ message: 'Aucune phase trouvée pour ce projet' });
        }

        const phaseIds = phases.map(phase => phase._id);

        const tasksTrouvees = await Tache.aggregate([
            {
                $match: {
                    user_id: new ObjectId(userId),
                    phase_id: { $in: phaseIds },
                    $or: [
                        { nomT: { $regex: searchTerm, $options: 'i' } },
                        { descriptionT: { $regex: searchTerm, $options: 'i' } },
                        { dateDebutT: { $regex: searchTerm, $options: 'i' } },
                        { dateFinT: { $regex: searchTerm, $options: 'i' } }
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
            },
            {
                $lookup: {
                    from: 'phases',
                    localField: 'phase_id',
                    foreignField: '_id',
                    as: 'phase'
                }
            },
            {
                $unwind: '$phase'
            },
            {
                $lookup: {
                    from: 'projets',
                    localField: 'phase.projet_id',
                    foreignField: '_id',
                    as: 'projet'
                }
            },
            {
                $unwind: '$projet'
            },
            {
                $project: {
                    _id: 1,
                    nomT: 1,
                    descriptionT: 1,
                    dateDebutT: 1,
                    dateFinT: 1,
                    statut: '$statut.etat',
                    phase: '$phase.libelle',
                    projet: '$projet.nomP'
                }
            }
        ]);

        // if (!tasksTrouvees || tasksTrouvees.length === 0) {
        //     return res.status(404).json({ message: 'Aucune tâche trouvée pour cet utilisateur avec ce terme de recherche' });
        // }

        res.json(tasksTrouvees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la recherche des tâches.' });
    }
};

exports.getStatutIdByLabel = async (req, res) => {
    const { statutLabel } = req.body;
    try {
      const statut = await Statut.findOne({ etat: statutLabel });
      if (!statut) {
        return res.status(404).json({ message: 'Statut non trouvé' });
      }
      res.json({ statutId: statut._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
};

exports.getStatistique = async (req, res) => {
    try {
      const users = await User.find();
      const statistiques = [];
  
      const statutTermine = await Statut.findOne({ etat: 'Terminé' });
  
      if (!statutTermine) {
        return res.status(404).json({ error: "Le statut 'Terminé' n'a pas été trouvé." });
      }
  
      for (const user of users) {
        const taches = await Tache.find({ user_id: user._id });
  
        const tachesTerminees = taches.filter(tache => tache.statut_id.toString() === statutTermine._id.toString()).length;
  
        const pourcentageAvancement = taches.length > 0 ? (tachesTerminees / taches.length) * 100 : 0;
  
        statistiques.push({
          utilisateur: user.cin,
          pourcentageAvancement: pourcentageAvancement.toFixed(2)
        });
      }
  
      res.json({ statistiques });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Une erreur est survenue lors de la récupération des statistiques." });
    }
};
  
exports.getTaskEnRetard = async (req, res) => {
    try {
        const currentDate = new Date();

        const user_id = req.params.id

        const tasksEnRetard = await Tache.find({ user_id: user_id, dateFinT: { $lt: currentDate } }).populate({
            path: 'phase_id',
            select: 'libelle projet_id',
            populate: {
                path: 'projet_id',
                select: 'nomP'
            }
        });

        const tachesFormatted = tasksEnRetard.map(tache => ({
            _id: tache._id,
            nomT: tache.nomT,
            descriptionT: tache.descriptionT,
            projet: tache.phase_id.projet_id.nomP
        }));
        res.status(200).json({ success: true, tasks: tachesFormatted });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des tâches en retard :", error);
        res.status(500).json({ success: false, message: "Une erreur s'est produite lors de la récupération des tâches en retard." });
    }
};
