import React, { useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import { Row, Col, Card, Breadcrumb, Modal, Button } from 'react-bootstrap';
//import axios from 'axios';
import PropTypes from 'prop-types'; // Import de PropTypes
import Search from '../search/projetSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const BasicTypography = () => {
  //const { id } = useParams();
  const [results, setResults] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const colorsByEtat = {
    "En cours": "primary",
    "À faire": "primary",
    "Bloqué": "danger",
    "Annulé": "dark",
    "Terminé": "success",
    "En attente": "warning"
  };

  useEffect(() => {
   // Récupérer les résultats de la recherche depuis localStorage
   const searchResults = JSON.parse(localStorage.getItem('searchResults'));
   if (searchResults) {
     setResults(searchResults);
   }
  }, []);

  const handleProjectClick = (projet) => {
    setSelectedProject(projet);
  };

  return (
    <React.Fragment>
            <Search />
      <Breadcrumb>
        <Breadcrumb.Item active>Projets</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {results ? (
          results.map((projet) => (
            <Col key={projet._id} lg={6} xl={4}>
              <Card onClick={() => handleProjectClick(projet)}>
                <Card.Header>
                  <Card.Title as="h5">{projet.nomP}</Card.Title>
                </Card.Header>
                <Card.Body className={`text-white bg-${colorsByEtat[projet.statut]} text-center`}>
                  {projet.statut}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p colSpan="6">Chargement des projets...</p>
        )}
      </Row>
      {selectedProject && (
        <ProjectDetailsModal projet={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </React.Fragment>
  );
};

function ProjectDetailsModal({ projet, onClose }) {
  const handleTask = () => {
    window.location.href = `/basic/typography/projects/${projet._id}/tasks`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Détails du projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{projet.nomP}</h4>
        <p>{projet.descriptionP}</p>
        <p>Date début {formatDate(projet.dateDebutP)}</p>
        <p>Date Fin {formatDate(projet.dateFinP)}</p>
        <p>{projet.statut}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          Fermer
        </Button>
        <Button variant="success" onClick={handleTask}>
          Taches
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ProjectDetailsModal.propTypes = {
  projet: PropTypes.shape({
    nomP: PropTypes.string.isRequired,
    descriptionP: PropTypes.string.isRequired,
    dateDebutP: PropTypes.string.isRequired,
    dateFinP: PropTypes.string.isRequired,
    statut: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    _id: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default BasicTypography;
