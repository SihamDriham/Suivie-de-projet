import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const FormsElements = () => {
  const [nomP, setNomP] = useState('');
  const [descriptionP, setDescriptionP] = useState('');
  const [dateDebutP, setDateDebutP] = useState('');
  const [dateFinEst, setDateFinEst] = useState('');
  const [budget, setBudget] = useState('');

  const handleChangeNomP = (event) => {
    setNomP(event.target.value);
  };

  const handleChangeDescriptionP = (event) => {
    setDescriptionP(event.target.value);
  };

  const handleChangeDateDebutP = (event) => {
    setDateDebutP(event.target.value);
  };

  const handleChangeDateFinEst = (event) => {
    setDateFinEst(event.target.value);
  };

  const handleChangeBudget = (event) => {
    setBudget(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page par défaut du formulaire
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
      await axios.post('http://localhost:2023/projets', {
        nomP: nomP,
        descriptionP: descriptionP,
        dateDebutP: dateDebutP,
        dateFinEst: dateFinEst, 
        budget: budget
      },config);
      setNomP('');
      // setShowSpecForm(true); // Cette ligne n'est pas nécessaire car setShowSpecForm n'est pas déclaré
      window.location.href = '/tables/AffichageProjets';
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de projet :", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter un nouveau projet</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formNomP">
                    <Form.Label>Nom Projet</Form.Label>
                    <Form.Control type="text" value={nomP} onChange={handleChangeNomP} /> 
                  </Form.Group>
                  <Form.Group className="mb-3" as={Col} controlId="formNomP">
                    <Form.Label>Budget</Form.Label>
                    <Form.Control type="text" value={budget} onChange={handleChangeBudget} /> 
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formDescriptionP">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" value={descriptionP} onChange={handleChangeDescriptionP} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formDateDebutT">
                    <Form.Label>Date début</Form.Label>
                    <Form.Control type="date" value={dateDebutP} onChange={handleChangeDateDebutP} />
                  </Form.Group>
                  <Form.Group className="mb-3" as={Col} controlId="formDateFinT">
                    <Form.Label>Date fin Estimé</Form.Label>
                    <Form.Control type="date" value={dateFinEst} onChange={handleChangeDateFinEst} />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit">Ajouter Projet</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FormsElements;
