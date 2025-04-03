const User = require('../models/user');
const Admin = require('../models/admin');

exports.insererAdmin = async (req, res) => {
  const userId = req.body.userId;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    const adminData = {
      _id: existingUser._id,
      cin: existingUser.cin,
      nomU: existingUser.nomU,
      prenom: existingUser.prenom,
      email: existingUser.email,
      telephone:existingUser.telephone,
      password: existingUser.password,
      image: existingUser.image,
      __t: 'Admin'
    };
    
    const admin = new Admin(adminData);

    await User.findByIdAndDelete(userId);
    
    const savedAdmin = await admin.save();

    return res.status(200).json({ success: true, message: 'Utilisateur converti en utilisateur normal avec succès', admin: savedAdmin });
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'utilisateur en utilisateur normal :', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la conversion de l\'utilisateur', error: error.message });
  }
}

exports.AdminNombre = async (req, res) => {
  try {
    const count = await User.countDocuments({ __t: 'Admin' });
    res.json({ count: count });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande" });
  }
}
