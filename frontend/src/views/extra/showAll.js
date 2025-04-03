import React, { useEffect, useState } from 'react';
import { Row, Col, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import Card from '../../components/Card/MainCard';
import moment from 'moment';
import 'moment/locale/fr'; // Importez la langue française pour Moment.js
import io from "socket.io-client";

moment.locale('fr'); // Définir la langue de Moment.js sur le français

const ENDPOINT = "http://localhost:2023"; // Remplacez par l'URL de votre serveur
var socket;

const ShowAll = () => {
  const [notif, setNotif] = useState([]);

  useEffect(() => {
    fetchNotif();
    socket = io(ENDPOINT);
    socket.on("newNotification", () => {
      fetchNotif();  
    });
  }, []);

  const fetchNotif = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const responseNotif = await axios.get('http://localhost:2023/notif', config);
      if (Array.isArray(responseNotif.data)) {
        setNotif(responseNotif.data);
      } else {
        console.error('Invalid data format received:', responseNotif.data);
      }
    } catch (error) {
      console.error("An error occurred while fetching notifications:", error);
    }
  };

  const handleDelete = async (event) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les notifications ?");
    if (confirmDelete) {
    try {
      event.preventDefault();
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:2023/notif`, config);
      setNotif([]);
    } catch (error) {
      console.error("An error occurred while deleting notification:", error);
    }
  }
  };

  return (
    <Row>
      <Col>
        <Card title="Notifications">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Notifications</h5>
            <Button variant="danger" size="sm" onClick={handleDelete}>Tout effacer</Button>
          </div>
          <ListGroup>
            {notif.length === 0 ? (
              <p className="text-muted">Aucune notification à afficher</p>
            ) : (
              notif.map(notification => (
                <ListGroup.Item key={notification._id}>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-0">{notification.contenuN}</p>
                    <small className="text-muted">{moment(notification.dateHeure).fromNow()}</small>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default ShowAll;
