import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

import navigationAdmin from '../../../menu-Admin';
import navigationUser from '../../../menu-user';
import { BASE_TITLE } from '../../../config/constant';

const Breadcrumb = () => {
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
  }, []); 
  const location = useLocation();

  const [main, setMain] = useState([]);
  const [item, setItem] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const menu = userType === 'Admin' ? navigationAdmin : navigationUser;
    setMenuItems(menu);
  
    // Mettre en place le mapping après avoir défini menuItems
    menu.items.map((item, index) => {
      if (item.type && item.type === 'group') {
        getCollapse(item, index);
      }
      return false;
    });
  }, [menuItems]); // Passer menuItems comme dépendance
  

  const getCollapse = (item, index) => {
    if (item.children) {
      item.children.filter((collapse) => {
        if (collapse.type && collapse.type === 'collapse') {
          getCollapse(collapse, index);
        } else if (collapse.type && collapse.type === 'item') {
          if (location.pathname === collapse.url) {
            setMain(item);
            setItem(collapse);
          }
        }
        return false;
      });
    }
  };

  let mainContent, itemContent;
  let breadcrumbContent = '';
  let title = '';

  if (main && main.type === 'collapse') {
    mainContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{main.title}</Link>
      </ListGroup.Item>
    );
  }

  if (item && item.type === 'item') {
    title = item.title;
    itemContent = (
      <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
        <Link to="#">{title}</Link>
      </ListGroup.Item>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header">
          <div className="page-block">
            <div className="row align-items-center">
              <div className="col-md-12">
                <div className="page-header-title">
                  <h5 className="m-b-10">{title}</h5>
                </div>
                <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
                  <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                    <Link to="/">
                      <i className="feather icon-home" />
                    </Link>
                  </ListGroup.Item>
                  {mainContent}
                  {itemContent}
                </ListGroup>
              </div>
            </div>
          </div>
        </div>
      );
    }

    document.title = title + BASE_TITLE;
  }

  return <React.Fragment>{breadcrumbContent}</React.Fragment>;
};

export default Breadcrumb;
