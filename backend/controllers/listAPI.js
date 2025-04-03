const List = require('../models/list')
const Statut = require('../models/statut')
const { Types: { ObjectId } } = require('mongoose');

//Add
exports.addList = async (req, res) => {
  try {
    const user_id = req.userId; 
    const { contenuL } = req.body;
    console.log(req.userId)
    const defaultStatut = await Statut.findOne({ etat: 'À faire' });
    if (!defaultStatut) {
      throw new Error("Statut par défaut introuvable");
    }
    const list = new List({
      contenuL: contenuL,
      statut_id: defaultStatut._id,
      user_id: user_id
    });
    const newList = await list.save();
    res.status(201).json({ success: true, data: newList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

//Update
exports.updateStatutById = async (req, res) => {
  try {
    const id = req.params.id;
    const statut = await Statut.findOne({ etat: 'À faire' });

    if (!statut) {
      throw new Error("Statut par défaut introuvable");
    }

    const updatedList = await List.findByIdAndUpdate(
      id,
      { statut_id: statut._id },
      { new: true }
    );

    res.json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

exports.updateList = async (req, res) => {
  try {
    const id = req.params.id;
    const statut = await Statut.findOne({ etat: 'Terminé' });

    if (!statut) {
      throw new Error("Statut par défaut introuvable");
    }

    const updatedList = await List.findByIdAndUpdate(
      id,
      { statut_id: statut._id },
      { new: true }
    );

    res.json(updatedList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

exports.updateListContenu = async (req, res) => {
 try {
   const id = req.params.id;
   const { contenuL } = req.body
   await List.findByIdAndUpdate(
     id,
     {contenuL: contenuL}
   )
   res.json({ message: 'Updated successfully'});
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Erreur interne du serveur' });
 }
}

//Delete
exports.deleteList = async(req,res)=>{
 try{
  const list = await List.findByIdAndDelete(req.params.id)
  if(!list){
   return res.status(401).json({message: 'message not found'})
  }
  res.json({ message: 'deleted successful' })
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//Afficher
exports.getList = async(req,res)=>{
 const id = req.userId; 
 try{
  const list = await List.find({ user_id: id})
  const lists = list.map(Lists=>({
   _id: Lists._id,
   contenuL: Lists.contenuL,
   statut_id: Lists.statut_id
  }))
  res.json(lists)
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

exports.searchList = async (req, res) => {
  try {
      const searchTerm = req.params.searchTerm;
      const userId = req.userId; 

      const listsTrouvees = await List.aggregate([
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
                      { contenuL: { $regex: searchTerm, $options: 'i' } }                  ]
              }
          }
      ]);

      const listsFormatted = listsTrouvees.map(list => ({
        _id: list._id,
        contenuL: list.contenuL,
        statut_id: list.statut_id
      }));

      res.json(listsFormatted);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur lors de la recherche des lists.' });
  }
};