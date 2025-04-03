import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Breadcrumb, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import de PropTypes
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { MdPersonAddAlt } from "react-icons/md";
import { BsCalendar } from 'react-icons/bs'; // Importer l'icône de calendrier de Bootstrap
import SearchProjects from './projectSearch'; // Import de SearchProjects
import 'bootstrap-icons/font/bootstrap-icons.css';

const BasicTypography = () => {
  const [results, setResults] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const colorsByEtat = {
    "En cours": "secondary",
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
      <SearchProjects />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Breadcrumb>
          <Breadcrumb.Item active>Projets</Breadcrumb.Item>
        </Breadcrumb>
        <Link to="/forms/AddProject" className="btn btn-primary">+</Link>
      </div>
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

const handleEdit = async (id) => {
    window.location.href = `/forms/ModifierProjet/${id}`;
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2023/projets/${id}`);
      fetchProjets();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de projet :", error);
    }
  };

  const handlePhase = async (projetId) => {
    window.location.href = `/tables/phases/${projetId}`;
  };

  const handleUsers = async (projetId) => {
    window.location.href = `/tables/AffichageRPU/${projetId}`;
  };
function ProjectDetailsModal({ projet, onClose }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const handleEvents = async (projetId) => {
    window.location.href = `/AddEvent/${projetId}`;
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
        <p>Date Fin {formatDate(projet.dateFinEst)}</p>
        <p>{projet.statut}</p> 
      </Modal.Body>
      <Modal.Footer>
        <FaRegEdit size={24} color="DodgerBlue" onClick={() => handleEdit(projet._id)} style={{ marginRight: '10px' }} />
        <FaRegTrashCan size={24} color="red" onClick={() => handleDelete(projet._id)} style={{ marginRight: '10px' }} />
        <TbListDetails size={24} color="SeaGreen" onClick={() => handlePhase(projet._id)} style={{ marginRight: '10px' }} />
        <MdPersonAddAlt size={24} color="Peru" onClick={() => handleUsers(projet._id)} style={{ marginRight: '10px' }}/>
        <BsCalendar size={24} color="#2196F3" onClick={() => handleEvents(projet._id)} style={{ marginRight: '10px' }} />
      </Modal.Footer>
    </Modal>
  );
}

ProjectDetailsModal.propTypes = {
    projet: PropTypes.shape({
      _id: PropTypes.string.isRequired, // Ajoutez cette ligne pour spécifier le type de projet._id
      nomP: PropTypes.string.isRequired,
      descriptionP: PropTypes.string.isRequired,
      dateDebutP: PropTypes.string.isRequired,
      dateFinEst: PropTypes.string.isRequired,
      statut: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default BasicTypography;
