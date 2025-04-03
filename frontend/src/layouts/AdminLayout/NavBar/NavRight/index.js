import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import moment from 'moment';
import PropTypes from 'prop-types';
import io from "socket.io-client";
//import socketIOClient from 'socket.io-client';

import ChatList from './ChatList';


moment.locale('fr');

const ENDPOINT = "http://localhost:2023"; // Remplacez par l'URL de votre serveur
var socket;

// Fonction pour formater la durée écoulée depuis la date de la notification
const formatDuration = (dateHeure) => {
  const now = moment(); // Obtenir la date actuelle
  const duration = moment.duration(now.diff(moment(dateHeure))); // Calculer la différence de temps entre maintenant et la date de notification
  return duration.humanize(); // Formater la durée de façon lisible par l'homme (ex: "Il y a quelques secondes")
};

function NotificationItem({ notification }) {
  return (
    <React.Fragment>
      <ListGroup.Item as="li" bsPrefix=" " className="notification">
        <Card className="d-flex align-items-center shadow-none mb-0 p-0" style={{ flexDirection: 'row', backgroundColor: 'unset' }}>
          <Card.Body className="p-0">
            <p>
              <strong>{notification.contenuN}</strong>
              <span className="n-time text-muted">
                <i className="icon feather icon-clock me-2" />
                {formatDuration(notification.dateHeure)}
              </span>
            </p>
          </Card.Body>
        </Card>
      </ListGroup.Item>
    </React.Fragment>
  );
}

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [notif, setNotif] = useState([]);
  const [nomU, setNomU] = useState('');
  const [prenom, setPrenom] = useState('');
  const [image, setImage] = useState(''); // Ajout de l'état image
  const [unreadCount, setUnreadCount] = useState(0); // State pour le nombre de notifications non lues
  const [unreadCountM, setUnreadCountM] = useState(0);

  useEffect(() => {
    fetchUser();
    fetchNotif();  
    fetchUnreadMessagesCount();

    socket = io(ENDPOINT);
  
    const token = localStorage.getItem('token'); // Récupérer le token du stockage local
  
    if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        axios.get('http://localhost:2023/user', config)
            .then(response => {
                const userId = response.data._id; // Récupérer l'ID de l'utilisateur depuis la réponse
                socket.emit("setup", { _id: userId });
            })
            .catch(error => {
                console.error("Une erreur s'est produite lors de la récupération de l'ID de l'utilisateur :", error);
            });
    } else {
        console.error("Token non trouvé dans le stockage local");
    }

    socket.on("newNotification", () => {
      fetchNotif();  
    });

    socket.on("newMessage", () => {
      fetchUnreadMessagesCount(); 
    });
    
  }, []);
  
  // Fonction pour récupérer les données de l'utilisateur
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token du stockage local
      if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:2023/user', config);
        setPrenom(response.data.prenom);
        setNomU(response.data.nomU);
        setImage(response.data.image); // Mise à jour de l'état image
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données de l'utilisateur :", error);
    }
  };

  // Fonction pour récupérer les notifications non lues
  const fetchNotif = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const responseNotif = await axios.get('http://localhost:2023/notifNon', config);
        if (Array.isArray(responseNotif.data)) {
          setNotif(responseNotif.data);
          setUnreadCount(responseNotif.data.length); // Mettre à jour le nombre de notifications non lues
        } else {
          console.error('Invalid data format received:', responseNotif.data);
        }
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données de l'utilisateur :", error);
    }
  };

  const fetchUnreadMessagesCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const responseM = await axios.get(`http://localhost:2023/conver`,config);

          setUnreadCountM(responseM.data.count);

           }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de messages non lus:', error);
    }
  };

  // Fonction pour marquer les notifications comme lues
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Récupérer le token du stockage local
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:2023/notif', {}, config);
      alert('notifications modifiés avec succès !');
      setNotif([]);
      setUnreadCount(0); // Mettre à jour le nombre de notifications non lues
    } catch (error) {
      console.error("Une erreur s'est produite lors de la modification des notifications :", error);
      alert('Une erreur s\'est produite lors de la modification des notifications. Veuillez réessayer.');
    }
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        {/* Notification */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
              {unreadCount > 0 && ( // Afficher le cercle rouge seulement s'il y a des notifications non lues
                <span className="badge bg-danger rounded-pill">{unreadCount}</span>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" className="me-2" onClick={handleUpdate}>
                    Marquer comme lu
                  </Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">Nouveau</p>
                  </ListGroup.Item>
                  {notif && notif.length > 0 ? (
                    notif.map((notification) => <NotificationItem key={notification._id} notification={notification} />)
                  ) : (
                    <p colSpan="6">Aucune notification</p>
                  )}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="/showAll">Afficher tout</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
              {unreadCountM > 0 && ( 
                <span className="badge bg-danger rounded-pill">{unreadCountM}</span>
              )}
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="start" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
              <img
                  src={`http://localhost:2023/${image}`}
                  alt="Profile"
                  style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                />
                <span>{prenom} {nomU}</span>
                <Link to="/logout" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  {/* <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link> */}
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/profile" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  {/* <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link> */}
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  {/* <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link> */}
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/logout" className="dropdown-item">
                    <i className="feather icon-log-out" /> Déconnexion
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    contenuN: PropTypes.string.isRequired,
    dateHeure: PropTypes.string.isRequired,
  }).isRequired,
};


export default NavRight;