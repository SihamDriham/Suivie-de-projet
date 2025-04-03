 const Statut = require('../models/statut')

 //Afficher
 exports.getStatutProjet = async(req,res)=>{
  const etatsRecherches = ['En cours', 'En attente', 'Terminé', 'Annulé', 'Bloqué', 'À faire']; // Liste des états à rechercher

    try {
        // Rechercher les statuts par leur état
        const statuts = await Statut.find({ etat: { $in: etatsRecherches } });

        if (statuts.length === 0) {
            return res.status(404).json({ message: `Aucun statut trouvé avec les états spécifiés` });
        }

        res.json(statuts);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des statuts :", error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
 }

 exports.getStatutMsg = async(req,res)=>{
  const etatsRecherches = ['Ignoré', 'Lu', 'No lu']; // Liste des états à rechercher

    try {
        // Rechercher les statuts par leur état
        const statuts = await Statut.find({ etat: { $in: etatsRecherches } });

        if (statuts.length === 0) {
            return res.status(404).json({ message: `Aucun statut trouvé avec les états spécifiés` });
        }

        res.json(statuts);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des statuts :", error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
 }

 exports.getStatutById = async(req,res)=>{
    try{
     const statut = await Statut.findOne({ etat: 'Terminé' });
      res.json(statut._id);
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
    }
  }

  exports.getFaire = async(req,res)=>{
    try{
     const statut = await Statut.findOne({ etat: 'À faire' });
      res.json(statut._id);
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
    }
  }

  exports.getCours = async(req,res)=>{
    try{
     const statut = await Statut.findOne({ etat: 'En cours' });
      res.json(statut._id);
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
    }
  }

  exports.getAttente = async(req,res)=>{
    try{
     const statut = await Statut.findOne({ etat: 'En attente' });
      res.json(statut._id);
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Internal server error' });
    }
  }

  exports.getList = async (req, res) => {
    try {
      const statuts = await Statut.find();
      const statutIds = {};
      statuts.forEach(statut => {
        statutIds[statut.etat] = statut._id;
      });
      res.json(statutIds);
    } catch (error) {
      console.error('Erreur lors de la récupération des IDs de statuts :', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //Recuperer id de statut
  exports.getStatutIdByEtat = async (req, res) => {
    try {
      const { etat } = req.body; 
      const statut = await Statut.findOne({ etat: etat });
      res.json(statut._id);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.getStatuts = async (req, res) => {
    try {
        const statuts = await Statut.find({ etat: { $in: ['À faire', 'Terminé', 'En cours', 'En attente'] } });
        res.json(statuts);
    } catch (error) {
        console.error('Error fetching statuts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};