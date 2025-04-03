import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const AddEventForm = () => {
  const [details, setDetails] = useState([{ heureDebut: '', heureFin: '', titre: '' }]);
  const [jour, setJour] = useState('');
  const { jourId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:2023/jours/${jourId}`);
        const jourData = response.data;
        setJour(new Date(jourData.date).toLocaleDateString());
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération du jour de l'événement :", error);
      }
    };
    fetchData();
  }, [jourId]);

  const handleChange = (index, field, value) => {
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;
    setDetails(updatedDetails);
  };

  const handleAddDetail = () => {
    setDetails([...details, { heureDebut: '', heureFin: '', titre: '' }]);
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = [...details];
    updatedDetails.splice(index, 1);
    setDetails(updatedDetails);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Promise.all(details.map(async (detail) => {
        await axios.post(`http://localhost:2023/detailsJour`, {
          heureDebut: detail.heureDebut,
          heureFin: detail.heureFin,
          titre: detail.titre,
          jourEvenement: jourId
        });
      }));
      window.location.href = `/calendar`;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout des détails :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter des détails pour le jour {jour}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {details.map((detail, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={3}>
                      <Form.Group controlId={`formHeureDebut${index}`}>
                        <Form.Label>Heure de début</Form.Label>
                        <Form.Control
                          type="time"
                          value={detail.heureDebut}
                          onChange={(e) => handleChange(index, 'heureDebut', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId={`formHeureFin${index}`}>
                        <Form.Label>Heure de fin</Form.Label>
                        <Form.Control
                          type="time"
                          value={detail.heureFin}
                          onChange={(e) => handleChange(index, 'heureFin', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId={`formTitre${index}`}>
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                          type="text"
                          value={detail.titre}
                          onChange={(e) => handleChange(index, 'titre', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveDetail(index)}
                        style={{ marginTop: '28px', backgroundColor: 'red', borderColor: 'red' }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                      {index === details.length - 1 && (
                        <Button
                          variant="primary"
                          onClick={handleAddDetail}
                          style={{ marginTop: '28px', marginLeft: '10px' }}
                        >
                          +
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
                <Button variant="primary" type="submit">Ajouter Détails</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AddEventForm;
