const projetPhase = require('../models/projetPhase')

//Add
exports.addprojetPhase = async(req,res)=>{
 try{
  const {projet_id,phase_id} = req.body
  const Pr = new projetPhase({
   projet_id: projet_id,
   phase_id: phase_id
  })
  await Pr.save()
  res.json({ message: 'Ajout réussi' });
 }catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Erreur interne du serveur' });
 }
}

//Update
exports.updateprojetPhase = async (req, res) => {
 try {
   const id = req.params.id;
   const {projet_id,phase_id} = req.body;

   await projetPhase.findByIdAndUpdate(id,{
    projet_id: projet_id,
    phase_id: phase_id
   })

   res.json({ message: 'Updated successfully'});
 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Erreur interne du serveur' });
 }
}

//Delete
exports.deleteprojetPhase = async(req,res)=>{
 try{
  const pr = await projetPhase.findByIdAndDelete(req.params.id)
  if(!pr){
   return res.status(401).json({message: 'pr not found'})
  }
  res.json({ message: 'deleted successful' })
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//Afficher
exports.getprojetPhase = async(req,res)=>{
 try{
  const pr = await projetPhase.find().populate('projet_id','nomP').populate('phase_id','libelle')
  const prs = pr.map(Pr=>({
   _id: Pr._id,
   projet: Pr.projet_id.nomP,
   phase: Pr.phase_id.libelle
  }))
  res.json(prs)
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

exports.getprojetPhaseById = async(req,res)=>{
 try{
  const id = req.params.id
  const Pr = await projetPhase.findById(id).populate('projet_id','nomP').populate('phase_id','libelle')
  const pr = {
   _id: Pr._id,
   projet: Pr.projet_id.nomP,
   phase: Pr.phase_id.libelle
  }
  res.json(pr)
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}
