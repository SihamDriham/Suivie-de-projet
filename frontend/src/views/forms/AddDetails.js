import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

// Définition du composant AddEventForm
const AddEventForm = () => {
  // Déclaration des états
  const [formInputs, setFormInputs] = useState([]);
  const { event_id } = useParams();

  // Effet de chargement initial pour récupérer les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:2023/evenements/${event_id}`);
        const joursEvenement = response.data.joursEvenement;
        const formInputsData = joursEvenement.map(jour => ({
          jourId: jour._id,
          date: new Date(jour.date).toLocaleDateString(),
          details: [
            { _id: '', heureDebut: '', heureFin: '', titre: '' } // Ajout de l'ID pour la suppression
          ]
        }));
        setFormInputs(formInputsData);
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des jours de l'événement :", error);
      }
    };
    fetchData();
  }, [event_id]);

  // Fonction pour gérer les changements dans les champs de formulaire
  const handleChange = (indexJour, indexDetail, field, value) => {
    const updatedFormInputs = [...formInputs];
    updatedFormInputs[indexJour].details[indexDetail][field] = value;
    setFormInputs(updatedFormInputs);
  };

  // Fonction pour ajouter un nouveau détail de jour
  const handleAddDetail = (indexJour) => {
    const updatedFormInputs = [...formInputs];
    updatedFormInputs[indexJour].details.push({ _id: '', heureDebut: '', heureFin: '', titre: '' });
    setFormInputs(updatedFormInputs);
  };

  // Fonction pour supprimer un détail de jour
  const handleRemoveDetail = (indexJour, indexDetail) => {
    const updatedFormInputs = [...formInputs];
    updatedFormInputs[indexJour].details.splice(indexDetail, 1);
    setFormInputs(updatedFormInputs);
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await Promise.all(formInputs.map(async (input) => {
        await Promise.all(input.details.map(async (detail) => {
          await axios.post(`http://localhost:2023/detailsJour`, {
            heureDebut: detail.heureDebut,
            heureFin: detail.heureFin,
            titre: detail.titre,
            jourEvenement: input.jourId
          });
        }));
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
              <Card.Title as="h5">Ajouter des détails pour chaque jour</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {formInputs.map((inputJour, indexJour) => (
                  <div key={indexJour}>
                    <h5 style={{ fontWeight: 'bold' }}>Jour {inputJour.date}</h5>
                    {inputJour.details.map((detail, indexDetail) => (
                      <Row key={indexDetail} className="mb-3">
                        <Col md={3}>
                          <Form.Group controlId={`formHeureDebut${indexJour}${indexDetail}`}>
                            <Form.Label>Heure de début</Form.Label>
                            <Form.Control type="time" value={detail.heureDebut} onChange={(e) => handleChange(indexJour, indexDetail, 'heureDebut', e.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group controlId={`formHeureFin${indexJour}${indexDetail}`}>
                            <Form.Label>Heure de fin</Form.Label>
                            <Form.Control type="time" value={detail.heureFin} onChange={(e) => handleChange(indexJour, indexDetail, 'heureFin', e.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group controlId={`formTitre${indexJour}${indexDetail}`}>
                            <Form.Label>Titre</Form.Label>
                            <Form.Control type="text" value={detail.titre} onChange={(e) => handleChange(indexJour, indexDetail, 'titre', e.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveDetail(indexJour, indexDetail)}
                            style={{ marginTop: '28px', backgroundColor: 'red', borderColor: 'red' }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </Button>
                          {indexDetail === inputJour.details.length - 1 && (
                            <Button
                              variant="primary"
                              onClick={() => handleAddDetail(indexJour)}
                              style={{ marginTop: '28px', marginLeft: '10px' }}
                            >
                              + 
                            </Button>
                          )}
                        </Col>
                      </Row>
                    ))}
                  </div>
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

// Export du composant AddEventForm
export default AddEventForm;