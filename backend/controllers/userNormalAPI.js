const UserNormal = require('../models/userNormal');
const User = require('../models/user');

exports.insererUserNormal = async (req, res) => {
  const userId = req.body.userId;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Création d'un nouvel objet UserNormal à partir des données de l'utilisateur existant
    const userNormalData = {
      _id: existingUser._id,
      cin: existingUser.cin,
      nomU: existingUser.nomU,
      prenom: existingUser.prenom,
      telephone:existingUser.telephone,
      email: existingUser.email,
      password: existingUser.password,
      image: existingUser.image,
      __t: 'UserNormal' // Assurez-vous de définir le type correctement
    };
    
    const userNormal = new UserNormal(userNormalData);

    await User.findByIdAndDelete(userId);
    
    const savedUserNormal = await userNormal.save();

    return res.status(200).json({ success: true, message: 'Utilisateur converti en utilisateur normal avec succès', userNormal: savedUserNormal });
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'utilisateur en utilisateur normal :', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la conversion de l\'utilisateur', error: error.message });
  }

}

exports.getUsersOfTypeUserNormal = async (req, res) => {
  try {
    const users = await User.find({ __t: 'UserNormal' }, { _id: 1, nomU: 1, prenom: 1, image: 1, cin:1 }); // Spécifiez les champs à récupérer
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs de type UserNormal :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs de type UserNormal" });
  }
};

exports.UserNormalNombre = async (req, res) => {
  try {
    const count = await User.countDocuments({ __t: 'UserNormal' });
    res.json({ count: count });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande" });
  }
}