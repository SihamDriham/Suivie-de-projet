import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Importez axios pour envoyer des requêtes HTTP
import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';
import NavLogo from './NavLogo';
import NavContent from './NavContent';
import navigationAdmin from '../../../menu-Admin'; // Importez le menu admin
import navigationUser from '../../../menu-user'; // Importez le menu utilisateur

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { layoutType, collapseMenu } = configContext.state;
  const windowSize = useWindowSize();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const getTokenAndFetchUserType = async () => {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token du stockage local
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`, // Ajouter le token comme en-tête d'autorisation
            },
          };
          const response = await axios.get('http://localhost:2023/menu', config);
          setUserType(response.data); // Définir le type d'utilisateur extrait de la réponse
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du type d\'utilisateur:', error);
      }
    };

    getTokenAndFetchUserType();
  }, []); // Utilisez une dépendance vide pour que cela ne se déclenche qu'une seule fois

  let navClass = ['pcoded-navbar'];
  navClass = [...navClass, layoutType];

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

  let navBarClass = ['navbar-wrapper'];

  // Utilisez le type d'utilisateur pour déterminer quel menu charger
  const navigation = userType === 'Admin' ? navigationAdmin : navigationUser;
  // const type = 'Admin'; // Extrayez le type d'utilisateur du JWT
  //   const navigation = type === 'Admin' ? navigationAdmin : navigationUser;

  let navContent = (
    <div className={navBarClass.join(' ')} style={{ backgroundColor: '#186a6a' }}>
      <NavLogo />
      <NavContent navigation={navigation.items} />
    </div>
  );

  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavLogo />
        <NavContent navigation={navigation.items} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;

