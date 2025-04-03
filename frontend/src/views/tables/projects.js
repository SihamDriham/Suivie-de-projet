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
import SearchProjects from '../search/projectSearch'; // Import de SearchProjects
import 'bootstrap-icons/font/bootstrap-icons.css';

const BasicTypography = () => {
  const [projets, setProjets] = useState([]);
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
    fetchProjets();
  }, []); 

  const fetchProjets = async () => {
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
      const response = await axios.get(`http://localhost:2023/projets`,config);
      if (Array.isArray(response.data)) {
        setProjets(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des projets :", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const handleProjectClick = (projet) => {
    setSelectedProject(projet);
  };

  const handleDeleteAndClose = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:2023/projets/${id}`);
      fetchProjets(); // Actualiser la liste des projets
      setSelectedProject(null); // Fermer le modal
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de projet :", error);
    }
  }
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
        {projets ? (
          projets.map((projet) => (
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
        <ProjectDetailsModal 
          projet={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onDelete={handleDeleteAndClose}
        />
      )}
    </React.Fragment>
  );  
};

const handleEdit = async (id) => {
  window.location.href = `/forms/ModifierProjet/${id}`;
};

const handlePhase = async (projetId) => {
  window.location.href = `/tables/phases/${projetId}`;
};

const handleUsers = async (projetId) => {
  window.location.href = `/tables/AffichageRPU/${projetId}`;
};

const handleEvents = async (projetId) => {
  window.location.href = `/AddEvent/${projetId}`;
};

function ProjectDetailsModal({ projet, onClose, onDelete }) {
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
        <p>Date Fin {formatDate(projet.dateFinEst)}</p>
        <p>{projet.statut}</p> 
      </Modal.Body>
      <Modal.Footer>
        <FaRegEdit size={24} color="DodgerBlue" onClick={() => handleEdit(projet._id)} style={{ marginRight: '10px' }} />
        <FaRegTrashCan size={24} color="red" onClick={() => onDelete(projet._id)} style={{ marginRight: '10px' }} />
        <TbListDetails size={24} color="SeaGreen" onClick={() => handlePhase(projet._id)} style={{ marginRight: '10px' }} />
        <MdPersonAddAlt size={24} color="Peru" onClick={() => handleUsers(projet._id)} style={{ marginRight: '10px' }}/>        
        <BsCalendar size={22} color="#2196F3" onClick={() => handleEvents(projet._id)} style={{ marginRight: '10px' }} />
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
  onDelete: PropTypes.func.isRequired, // Ajoutez PropTypes pour onDelete
};

export default BasicTypography;
