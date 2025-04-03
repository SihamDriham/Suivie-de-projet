import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FormsElements = () => {
  const [libelle, setLibelle] = useState('');
  const [desc, setDesc] = useState('');
  const { projetId } = useParams();

  const handleChangeLibelle = (event) => {
    setLibelle(event.target.value);
  };

  const handleChangeDesc = (event) => {
    setDesc(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page par défaut du formulaire
    try {
      await axios.post(`http://localhost:2023/phase/${projetId}`, {
        libelle: libelle,
        desc: desc
      });
      setLibelle('');
      setDesc('');
      window.location.href = `/tables/phases/${projetId}`;
      // Vous pouvez ajouter une logique supplémentaire ici, comme rediriger l'utilisateur vers une autre page
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de la phase :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter une nouvelle phase</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formLibelle">
                    <Form.Label>Libellé</Form.Label>
                    <Form.Control type="text" value={libelle} onChange={handleChangeLibelle} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" value={desc} onChange={handleChangeDesc} />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit">Ajouter Phase</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FormsElements;
