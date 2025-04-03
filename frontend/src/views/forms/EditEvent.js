import React, { useState,useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const AddEventForm = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [lieu, setLieu] = useState('');
  const [typeE, setTypeE] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const { idEvent } = useParams();

  useEffect(() => {
    fetchEvent();
  }, []);  
  
  const fetchEvent = async () => {
    try {
      const response = await axios.get(`http://localhost:2023/events/${idEvent}`);
      const event = response.data;
      setTitre(event.titre);
      setDescription(event.description);
      setLieu(event.lieu)
      setDateDebut(moment(event.dateDebut).format('YYYY-MM-DDTHH:mm'));
      setDateFin(moment(event.dateFin).format('YYYY-MM-DDTHH:mm')); 
      setTypeE(event.typeE);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des données du projet :", error);
    }
  };
  const handleChangeTitre = (event) => {
    setTitre(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleChangeDateDebut = (event) => {
    setDateDebut(event.target.value);
  };

  const handleChangeDateFin = (event) => {
    setDateFin(event.target.value);
  };

  const handleChangeLieu = (event) => {
    setLieu(event.target.value);
  };

  const handleChangeTypeE = (event) => {
    setTypeE(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    try {
      await axios.put(`http://localhost:2023/events/${idEvent}`, {
        titre: titre,
        description: description,
        dateDebut: dateDebut,
        dateFin: dateFin,
        typeE: typeE,
        lieu: lieu,
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
              <Card.Title as="h5">Ajouter une nouvelle tâche</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formTitre">
                    <Form.Label>Titre Evenement</Form.Label>
                    <Form.Control type="text" value={titre} onChange={handleChangeTitre} />
                  </Form.Group>
                  <Form.Group className="mb-3" as={Col} controlId="formLieu">
                    <Form.Label>Lieu</Form.Label>
                    <Form.Control type="text" value={lieu} onChange={handleChangeLieu} />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formTypeE">
                    <Form.Label>Type Evenement</Form.Label>
                    <Form.Control as="select" value={typeE} onChange={handleChangeTypeE}>
                      <option value="">Choisir...</option>
                      <option value="Réunion" selected={typeE === "Réunion"}>Réunion</option>
                      <option value="Formation" selected={typeE === "Formation"}>Formation</option>
                      <option value="Conférences" selected={typeE === "Conférences"}>Conférences</option>
                    </Form.Control>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group className="mb-3" as={Col} controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="3" value={description} onChange={handleChangeDescription} />
                  </Form.Group>
                </Row>
                <Row>
                <Form.Group className="mb-3" as={Col} controlId="formDateDebut">
                  <Form.Label>Date début</Form.Label>
                  <Form.Control type="datetime-local" value={dateDebut} onChange={handleChangeDateDebut} />
                </Form.Group>
                <Form.Group className="mb-3" as={Col} controlId="formDateFin">
                  <Form.Label>Date fin</Form.Label>
                  <Form.Control type="datetime-local" value={dateFin} onChange={handleChangeDateFin} />
                </Form.Group>
                </Row>
                <Button variant="primary" type="submit">Modifier Evenement</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AddEventForm;
