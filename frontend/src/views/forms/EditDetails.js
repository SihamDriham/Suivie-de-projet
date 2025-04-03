import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const EditDetailsForm = () => {
    const [heureDebut, setHeureDebut] = useState('');
    const [heureFin, setHeureFin] = useState('');
    const [titre, setTitre] = useState('');
    const [jour, setJour] = useState('');
    const { detailId } = useParams();

    useEffect(() => {
        fetchDetails();
    }, []);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:2023/detailsJour/${detailId}`);
            const detail = response.data;
            setTitre(detail.titre);
            setHeureDebut(moment(detail.heureDebut, 'HH:mm').format('HH:mm'));
            setHeureFin(moment(detail.heureFin, 'HH:mm').format('HH:mm'));
            setJour(detail.dateJourEvenement); // Assurez-vous que la clé est correcte
        } catch (error) {
            console.error("Une erreur s'est produite lors de la récupération des données du projet :", error);
        }
    };

    const handleChangeTitre = (event) => {
        setTitre(event.target.value);
    };

    const handleChangeHeureDebut = (event) => {
        setHeureDebut(event.target.value);
    };

    const handleChangeHeureFin = (event) => {
        setHeureFin(event.target.value);
    };

    const handleSubmit = async (event) => {
      event.preventDefault(); 
      try {
        await axios.put(`http://localhost:2023/detailsJour/${detailId}`, {
          titre: titre,
          heureDebut: heureDebut,
          heureFin: heureFin,
        });
        window.location.href = `/calendar`;
      } catch (error) {
        console.error("Une erreur s'est produite lors de la modification d'evenement :", error);
      }
    };
    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Modifier les détails du jour</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h5 style={{ fontWeight: 'bold' }}>{jour}</h5>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Form.Group controlId="formHeureDebut">
                                            <Form.Label>Heure de début</Form.Label>
                                            <Form.Control type="time" value={heureDebut} onChange={handleChangeHeureDebut} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formHeureFin">
                                            <Form.Label>Heure de fin</Form.Label>
                                            <Form.Control type="time" value={heureFin} onChange={handleChangeHeureFin} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formTitre">
                                            <Form.Label>Titre</Form.Label>
                                            <Form.Control type="text" value={titre} onChange={handleChangeTitre} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">Modifier Detail</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default EditDetailsForm;
