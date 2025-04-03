import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:2023";

var socket;

const AddTaskForm = () => {
  const [nomT, setNomT] = useState('');
  const [descriptionT, setDescriptionT] = useState('');
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [dateDebutT, setDateDebutT] = useState('');
  const [dateFinT, setDateFinT] = useState('');
  const { phaseId, projetId } = useParams();

  useEffect(() => {

    socket = io(ENDPOINT);

    const fetchUserList = async (projetId) => {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token du stockage local
        if (!token) {
          window.location.href = '/login';
          return
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token comme en-tête d'autorisation
          },
        };
        const response = await axios.get(`http://localhost:2023/rpu/${projetId}`,config);
        setUserList(response.data);
      } catch (error) {
        console.error('Error fetching user list:', error);
        if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
          window.location.href = '/login';
        }
      }
    };

    fetchUserList(projetId);
  }, [projetId]);

  const handleChangeNomT = (event) => {
    setNomT(event.target.value);
  };

  const handleChangeDescriptionT = (event) => {
    setDescriptionT(event.target.value);
  };

  const handleChangeDateDebutT = (event) => {
    setDateDebutT(event.target.value);
  };

  const handleChangeDateFinT = (event) => {
    setDateFinT(event.target.value);
  };

  const handleChangeUser = (event) => {
    setSelectedUserId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:2023/tache/${phaseId}/${projetId}`, {
        nomT: nomT,
        descriptionT: descriptionT,
        dateDebutT: dateDebutT,
        dateFinT: dateFinT,
        phase_id: phaseId,
        user_id: selectedUserId,
        projet_id: projetId
      });
      setNomT('');
      setDescriptionT('');
      setDateDebutT('');
      setDateFinT('');
      setSelectedUserId('');
      socket.emit("sendNotification"); 
      window.location.href = `/tables/AffichageTaches/${phaseId}/${projetId}`;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de tâche :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter une nouvelle tâche</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formNomT">
                    <Form.Label>Nom de la tâche</Form.Label>
                    <Form.Control type="text" value={nomT} onChange={handleChangeNomT} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formUser">
                    <Form.Label>Utilisateur</Form.Label>
                    <Form.Control as="select" value={selectedUserId} onChange={handleChangeUser}>
                      <option value="">Choisir...</option>
                      {userList.map((user) => (
                        <option key={user.id} value={user.id}>{user.user}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formDescriptionT">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" value={descriptionT} onChange={handleChangeDescriptionT} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formDateDebutT">
                    <Form.Label>Date début</Form.Label>
                    <Form.Control type="date" value={dateDebutT} onChange={handleChangeDateDebutT} />
                  </Form.Group>
                  <Form.Group className="mb-3" as={Col} controlId="formDateFinT">
                    <Form.Label>Date fin</Form.Label>
                    <Form.Control type="date" value={dateFinT} onChange={handleChangeDateFinT} />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit">Ajouter Tâche</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AddTaskForm;
