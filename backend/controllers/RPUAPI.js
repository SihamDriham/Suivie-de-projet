const RPU = require('../models/RPU');
const Notification = require('../models/notification');
const Statut = require('../models/statut')
const Phase = require('../models/phase')
const Projet = require('../models/projet')
const Tache = require('../models/tache')
const Role = require('../models/role'); // Importez votre modèle Role


exports.addRPU = async (req, res) => {
  try {
    const defaultStatutN = await Statut.findOne({ etat: 'No lu' });
    const { role_id, user_id, projet_id } = req.body;
    const rpu = new RPU({
      role_id,
      user_id,
      projet_id
    });
    const newRPU = await rpu.save();
    console.log('RPU ajouté avec succès :', newRPU);

    const userIds = Array.isArray(user_id) ? user_id : [user_id];

    const notification = userIds.map(userId => ({
      typeN: 'Projet attribué',
      statut_id: defaultStatutN._id,
      contenuN: 'Vous avez une nouvelle projet assignée. Consultez dès maintenant pour les détails',
      user_id: userId
    }));

    if (notification.length > 0) {
      const insertedNotif = await Notification.insertMany(notification);
      console.log('Notifications ajoutées avec succès :', insertedNotif);
    }

    res.status(201).json({ success: true, data: newRPU });
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'ajout d'un enregistrement RPU :", error);
    res.status(500).json({ success: false, message: "Une erreur s'est produite lors de l'ajout d'un enregistrement RPU. Veuillez réessayer." });
  }
};

exports.getRPUListByProjet = async (req, res) => {
  try {
    const projetId = req.params.projetId;

    const rpuList = await RPU.find({ projet_id: projetId }).populate('role_id').populate('user_id');

    const mappedRPUList = rpuList.map(rpu => ({
      idrpu: rpu._id,
      id: rpu.user_id._id,
      role: rpu.role_id.nomR,
      user: `${rpu.user_id.nomU} ${rpu.user_id.prenom}`,
    }));

    res.json(mappedRPUList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteRPU = async (req, res) => {
  const rpuId = req.params.rpuId;
  try {
    const deletedRPU = await RPU.findByIdAndDelete(rpuId);

    if (!deletedRPU) {
      return res.status(404).json({ message: 'RPU not found' });
    }

    const phases = await Phase.find({ projet_id: deletedRPU.projet_id });

    for (let phase of phases) {
      await Tache.deleteMany({
        user_id: deletedRPU.user_id,
        phase_id: phase._id
      });
    }

    const statutEnCours = await Statut.findOne({ etat: 'En cours' });
    const statutTermine = await Statut.findOne({ etat: 'Terminé' });
    const statutAFaire = await Statut.findOne({ etat: 'À faire' });
    const statutEnAttente = await Statut.findOne({ etat: 'En attente' });

    for (let phase of phases) {
      const tasksInPhase = await Tache.find({ phase_id: phase._id });

      if (tasksInPhase.length === 0) {
        phase.statut_id = statutAFaire._id;
      } else {
        let hasEnAttente = false;
        let allTermine = true;
        let allAFaire = true;

        for (let task of tasksInPhase) {
          if (task.statut_id.equals(statutEnAttente._id)) {
            hasEnAttente = true;
            break;
          }
          if (!task.statut_id.equals(statutTermine._id)) {
            allTermine = false;
          }
          if (!task.statut_id.equals(statutAFaire._id)) {
            allAFaire = false;
          }
        }

        if (hasEnAttente) {
          phase.statut_id = statutEnAttente._id;
        } else if (allTermine) {
          phase.statut_id = statutTermine._id;
        } else if (allAFaire) {
          phase.statut_id = statutAFaire._id;
        } else {
          phase.statut_id = statutEnCours._id;
        }
      }

      await phase.save();
    }

    const projet = await Projet.findById(deletedRPU.projet_id);
    const updatedPhases = await Phase.find({ projet_id: projet._id });

    let projetEnAttente = false;
    let projetTermine = true;
    let projetAFaire = true;

    for (let phase of updatedPhases) {
      if (phase.statut_id.equals(statutEnAttente._id)) {
        projetEnAttente = true;
        break;
      }
      if (!phase.statut_id.equals(statutTermine._id)) {
        projetTermine = false;
      }
      if (!phase.statut_id.equals(statutAFaire._id)) {
        projetAFaire = false;
      }
    }

    if (projetEnAttente) {
      projet.statut_id = statutEnAttente._id;
    } else if (projetTermine) {
      projet.statut_id = statutTermine._id;
    } else if (projetAFaire) {
      projet.statut_id = statutAFaire._id;
    } else {
      projet.statut_id = statutEnCours._id;
    }

    await projet.save();

    res.json({ message: 'RPU and associated tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting RPU and associated tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserAndRole = async (req, res) => {
  try {
    const {userId, roleId } = req.body;
    const {rpuId} = req.params;
    const rpu = await RPU.findById(rpuId);

    if (!rpu) {
      return res.status(404).json({ message: 'RPU introuvable' });
    }
    rpu.user_id = userId;
    rpu.role_id = roleId;
    const updatedRPU = await rpu.save();

    res.json(updatedRPU);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};

//Hadi
exports.getProjetByUser = async (req, res) => {
  try {
    const id = req.userId; 
    const projets = await RPU.find({ user_id: id})
      .populate({
        path: 'projet_id',
        select: 'nomP descriptionP dateDebutP dateFinEst statut_id',
        populate: {
          path: 'statut_id',
          select: 'etat'
        }
      });

    if (!projets || projets.length === 0) {
      return res.status(404).json({ message: 'Aucun projet trouvé pour cet utilisateur' });
    }

    const projetsFormatted = projets.map(participer => ({
      _id: participer.projet_id._id,
      projet_id: participer.projet_id._id,
      projetN: participer.projet_id.nomP, 
      desc: participer.projet_id.descriptionP, 
      dateD: participer.projet_id.dateDebutP, 
      dateF: participer.projet_id.dateFinEst, 
      user_id: id,
      etat: participer.projet_id.statut_id.etat
    }));

    res.json(projetsFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

//Hadi
exports.getUserByProjet = async (req, res) => {
  try {
    const id = req.params.id; 
    const users = await RPU.find({ projet_id: id})
      .populate('user_id','nomU');

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Aucun user trouvé pour cet project' });
    }

    const usersFormatted = users.map(participer => ({
      _id: participer.user_id._id,
      projet_id: id, 
      user_id: participer.nomU
    }));
    res.json(usersFormatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

exports.getRPUById = async (req, res) => {
  const rpuId = req.params.rpuId;
  try {
    const rpu = await RPU.findById(rpuId)

    if (!rpu) {
      return res.status(404).json({ message: 'RPU introuvable' });
    }

    const formattedRPU = {
      role: rpu.role_id,
      user: rpu.user_id,
      projet_id: rpu.projet_id
    };

    res.json(formattedRPU);
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du RPU :", error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};

exports.roleType = async (req, res) => {
  try {
    const projetId = req.params.projetId;
    const userId = req.userId;

    const role = await Role.findOne({ nomR: 'Responsable' });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    const projet = await RPU.findOne({ projet_id: projetId, user_id: userId, role_id: role._id });

    if (projet) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  } catch (error) {
    console.error('Error in roleType:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};