import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FormsElements = () => {
  const [libelle, setLibelle] = useState('');
  const [desc, setDesc] = useState('');
  const { id } = useParams();
  const { projetId } = useParams();

  useEffect(() => {
    const fetchPhase = async () => {
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
        const response = await axios.get(`http://localhost:2023/phase/${id}`,config);
        const { libelle, desc } = response.data; // Récupérer les données de la phase à modifier
        setLibelle(libelle); // Pré-remplir le champ "Libellé"
        setDesc(desc); // Pré-remplir le champ "Description"
      } catch (error) {
        console.error('Error fetching phase:', error);
        if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
          window.location.href = '/login';
        }
      }
    };

    fetchPhase();
  }, [id]);

  const handleChangeLibelle = (event) => {
    setLibelle(event.target.value);
  };

  const handleChangeDesc = (event) => {
    setDesc(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:2023/phase/${id}`, {
        libelle: libelle,
        desc: desc
      });
      window.location.href = `/tables/phases/${projetId}`;
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour de la phase :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Modifier la phase</Card.Title>
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
                <Button variant="primary" type="submit">Modifier Phase</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default FormsElements;
