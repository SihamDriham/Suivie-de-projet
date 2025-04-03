const event = require('../models/evenement')
const JourEvenement = require('../models/jourEvent');
const DetailJour = require('../models/jourDetails');
const RPU = require('../models/RPU');
const Notification = require('../models/notification');
const Statut = require('../models/statut')
//Add
exports.addEvent = async (req, res) => {
  try {
    const { projetId } = req.params;
    const { titre, description, lieu, typeE, dateDebut, dateFin } = req.body;
    
    const Event = new event({
      titre: titre,
      description: description,
      lieu: lieu,
      typeE: typeE,
      dateDebut: dateDebut,
      dateFin: dateFin,
      projet_id: projetId
    });
    
    const savedEvent = await Event.save();

    const dates = getDatesBetween(new Date(dateDebut), new Date(dateFin));

    const jourEvenements = dates.map(date => ({
      date: date,
      evenement: savedEvent._id
    }));

    await JourEvenement.insertMany(jourEvenements);

    const defaultStatutN = await Statut.findOne({ etat: 'No lu' });

     const userProjects = await RPU.find({ projet_id: projetId }).select('user_id');

     const userIds = userProjects.map(rpu => rpu.user_id);

     const notificationsUser = userIds.map(user_id => ({
      user_id: user_id,
      contenuN: `Vous avez une nouvelle evenement : ${titre}. Consultez dès maintenant pour les détails`,
      typeN: 'Evenement',
      statut_id: defaultStatutN._id
    }));

    await Notification.insertMany(notificationsUser);

  res.json({ message: 'Ajout réussi' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const getDatesBetween = (startDate, endDate) => {
const dates = [];
let currentDate = new Date(startDate);
while (currentDate <= endDate) {
  dates.push(new Date(currentDate));
  currentDate.setDate(currentDate.getDate() + 1);
}
return dates;
};

exports.updateEvent = async (req, res) => {
  try {
    const { evenementId } = req.params;
    const { titre, description, lieu, typeE, dateDebut, dateFin } = req.body;

    const existingEvent = await event.findById(evenementId);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    const isDateModified = dateDebut !== existingEvent.dateDebut.toISOString() || dateFin !== existingEvent.dateFin.toISOString();

    existingEvent.titre = titre;
    existingEvent.description = description;
    existingEvent.lieu = lieu;
    existingEvent.typeE = typeE;
    if (isDateModified) {
      existingEvent.dateDebut = dateDebut;
      existingEvent.dateFin = dateFin;
    }

    const updatedEvent = await existingEvent.save();

    if (isDateModified) {
      // Fetch existing event days
      const existingEventDays = await JourEvenement.find({ evenement: evenementId });
      // Calculate new dates between the new start and end dates
      const newDatesBetween = getDatesBetween(new Date(dateDebut), new Date(dateFin));

      const deletedEventDays = existingEventDays.filter(
        eventDay => !newDatesBetween.some(newDate => newDate.toISOString() === eventDay.date.toISOString())
      );

      await DetailJour.deleteMany({ jourEvenement: { $in: deletedEventDays.map(day => day._id) } });

      await JourEvenement.deleteMany({ _id: { $in: deletedEventDays.map(day => day._id) } });

      const newEventDays = newDatesBetween
        .filter(date => !existingEventDays.some( eventDay => eventDay.date.toISOString() === date.toISOString()))
        .map(date => ({
          date: date,
          evenement: updatedEvent._id
        }));

      await JourEvenement.insertMany(newEventDays);
    }

    res.json({ message: 'Événement mis à jour avec succès', updatedEvent });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement :", error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

//Delete
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const joursEvenements = await JourEvenement.find({ evenement: req.params.id });
    const jourIds = joursEvenements.map(jour => jour._id);
    await JourEvenement.deleteMany({ evenement: req.params.id });
    if (jourIds.length > 0) {
    await DetailJour.deleteMany({ jourEvenement: { $in: jourIds } });
    }
    res.json({ message: 'Event and associated days and details deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEventsByUser = async (req, res) => {
  try {
    const userId = req.userId;

    console.log("userId")

     const userProjects = await RPU.find({ user_id: userId }).select('projet_id');

    if (userProjects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user' });
    }

    // Extraire les IDs des projets
    const projectIds = userProjects.map(rpu => rpu.projet_id);

    // Trouver tous les événements associés à ces projets
    const events = await event.find({ projet_id: { $in: projectIds } });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//Afficher
exports.getEvents = async(req,res)=>{
 try{
  const Event = await event.find().populate('projet_id','nomP')
  const events = Event.map(Events=>({
   _id: Events._id,
   titre : Events.titre,
    description: Events.description,
    lieu: Events.lieu,
    typeE: Events.typeE,
    dateDebut: Events.dateDebut,
    dateFin: Events.dateFin,
    projet: Events.projet_id.nomP 
  }))
  res.json(events)
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

exports.getEventById = async(req,res)=>{
 try{
  const id = req.params.id
  const Events = await event.findById(id).populate('projet_id','nomP')
  const events = {
   _id: Events._id,
   titre : Events.titre,
    description: Events.description,
    lieu: Events.lieu,
    typeE: Events.typeE,
    dateDebut: Events.dateDebut,
    dateFin: Events.dateFin,
    projet: Events.projet_id.nomP 
  }
  res.json(events)
 }catch(error){
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
 }
}

//search
exports.searchEvent = async (req, res) => {

 const search = req.body.search
 const regex = new RegExp(search, 'i');

 try{
     const Event = await event.aggregate([
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
                     $concat: ["$titre","$description","$lieu","$typeE","$dateDebut","$dateFin", "$projet.nomP"]
                 }
             }
         },
         {
             $match: {
                 concatField: { $regex: regex }
             }
         }
     ])
     res.json(Event); 
 } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Erreur lors de la recherche d'evenement." });
 }
} 