const Role = require('../models/role'); // Importez votre modèle Role

// Méthode pour récupérer tous les rôles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find(); // Requête pour trouver tous les rôles
    res.status(200).json(roles); // Renvoyer les rôles trouvés
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des rôles" });
  }
};

module.exports = {
  getAllRoles,
};
