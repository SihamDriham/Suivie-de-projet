const conver = require('../models/conversation')

//Add
exports.addConver = async(req,res)=>{
 try{
  const {nomC} = req.body
  const projet_id = req.params.projet_id
  const Conver = new conver({
   nomC : nomC,
   projet_id: projet_id
  })
  await Conver.save()
  res.json({ message: 'Ajout réussi' });
 }catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Erreur interne du serveur' });
 }
}

//Update
exports.updateConver = async (req, res) => {
 try {
   const id = req.params.id;
   const { nomC,projet_id } = req.body;

   await conver.findByIdAndUpdate(
     id,
     { nomC: nomC, projet_id: projet_id },
     { new: true, omitUndefined: true }
   ).select('-dateCreation');

   res.json({ message: 'Updated successfully'});
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Erreur interne du serveur' });
 }
}

//Delete
exports.deleteConver = async(req,res)=>{
 try{
  const Conver = await conver.findByIdAndDelete(req.params.id)
  if(!Conver){
   return res.status(401).json({message: 'conversation not found'})
  }
  res.json({ message: 'deleted successful' })
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//Afficher
exports.getConvers = async(req,res)=>{
 try{
  const Conver = await conver.find().populate('projet_id','nomP')
  const convers = Conver.map(conversation=>({
   _id: conversation._id,
   nomC: conversation.nomC,
   dateCreation: conversation.dateCreation,
   projet: conversation.projet_id.nomP 
  }))
  res.json(convers)
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

exports.getConverById = async(req,res)=>{
 try{
  const id = req.params.id
  const conversation = await conver.findById(id).populate('projet_id','nomP')
  const convers = {
   _id: conversation._id,
   nomC: conversation.nomC,
   dateCreation: conversation.dateCreation,
   projet: conversation.projet_id.nomP 
  }
  res.json(convers)
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

exports.getConverByPrjt = async(req,res)=>{
 try{
  const prjtId = req.params.prjtId
  const conversation = await conver.find({projet_id: prjtId}).populate('projet_id','nomP')
  const convers = {
   _id: conversation._id,
   nomC: conversation.nomC,
   dateCreation: conversation.dateCreation,
   projet: conversation.projet_id.nomP 
  }
  res.json(convers)
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//search
exports.searchConver = async (req, res) => {

 const search = req.body.search
 const regex = new RegExp(search, 'i');

 try{
     const Conver = await conver.aggregate([
         {
             $lookup: {
                 from: "projet",
                 localField: "projet_id",
                 foreignField: "_id",
                 as: "projet"
             }
         },
         {
             $unwind: "$projet"
         },
         {
             $addFields: {
                 concatField: {
                     $concat: ["$nomC","$dateCreation", "$projet.nomP"]
                 }
             }
         },
         {
             $match: {
                 concatField: { $regex: regex }
             }
         }
     ])
     res.json(Conver); 
 } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Erreur lors de la recherche de conversation." });
 }
} 