const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = process.env;

const { activeTokens } = require('../controllers/userAPI');

// const requireAuth = (requiredType) => {
//   return (req, res, next) => {
//     const token = req.cookies.jwt;
//     console.log(`token auth: ${token}`);

//     // Vérifier si le token existe
//     if (token) {
//       jwt.verify(token, '2+P@BpXq3t6w9z$C&F)J@NcRfUjXn2r5', (err, decodedToken) => {
//         if (err) {
//           console.log(err.message);
//           console.log('1'); // Retourner un statut 403 si l'utilisateur n'est pas du type requis
//           //res.redirect('/login'); // Rediriger vers la page de connexion si le token est invalide
//         } else {
//           console.log(decodedToken);
//           if (decodedToken.type === requiredType) {
//             next(); // Passer à la prochaine fonction middleware si le type d'utilisateur est correct
//           } else {
//             console.log('2');
//             res.status(403).json({ message: 'Accès interdit' }); // Retourner un statut 403 si l'utilisateur n'est pas du type requis
//           }
//         }
//       });
//     } else {
//       console.log('3');
//       res.status(403).json({ message: 'Non' }); // Retourner un statut 403 si l'utilisateur n'est pas du type requis
//       //res.redirect('/login'); // Rediriger vers la page de connexion si aucun token n'est trouvé
//     }
//   };
//  };

const protect = (requiredType) => {
  return async (req, res, next) => { // Ajoutez "return async" ici
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        console.log(`token auth: ${token}`)
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userType = decoded.type;
        if (decoded.type === requiredType) {
          req.user = await User.findById(decoded.id).select('-password');

          next(); // Passer à la prochaine fonction middleware si le type d'utilisateur est correct
        } else {
          res.status(403).json({ message: 'Accès interdit' }); // Retourner un statut 403 si l'utilisateur n'est pas du type requis
        }
      } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Not authorized' }); // Retourner un statut 403 si l'utilisateur n'est pas du type requis
      }
    }
    if (!token) {
      res.status(403).json({ message: 'Not authorized, no token' });
    }
  }
}

const menu = async(req, res, next) => { // Ajoutez "return async" ici
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userType = decoded.type;
          req.user = await User.findById(decoded.id).select('-password');

          next(); // Passer à la prochaine fonction middleware si le type d'utilisateur est correct

      } catch (error) {
        console.log(error);
        res.status(403).json({ message: 'Not authorized' }); // Retourner un statut 403 si l'utilisateur n'est pas du type requis
      }
    }
    if (!token) {
      res.status(403).json({ message: 'Not authorized, no token' });
    }
}

// const logout = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.userId = decoded.id;
//       req.userType = decoded.type;
//       req.user = await User.findById(decoded.id).select('-password');

//       activeTokens[token] = req.user;

//       next();
//     } catch (error) {
//       console.log(error);
//       res.status(403).json({ message: 'Not authorized' });
//     }
//   } else {
//     res.status(403).json({ message: 'Not authorized, no token' });
//   }
// };


 module.exports = { protect, menu };
