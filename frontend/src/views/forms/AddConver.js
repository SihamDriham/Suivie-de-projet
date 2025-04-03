import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddConverForm = () => {
  const [nomC, setNomC] = useState('');
  const { projet_id } = useParams();

  const handleChangeNomC = (event) => {
    setNomC(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:5000/conversations/${projet_id}`, {
        nomC: nomC,
        projet_id: projet_id
      });
      setNomC('');
      //window.location.href = `/tables/AffichageTaches/${phaseId}/${projetId}`;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de conversation :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter une nouvelle conversation</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formNomT">
                    <Form.Label>Nom de la conversation</Form.Label>
                    <Form.Control type="text" value={nomC} onChange={handleChangeNomC} />
                  </Form.Group>
                </Row>
                <Button variant="primary" type="submit">Ajouter Conversation</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AddConverForm;
