import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Breadcrumb, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import Search from '../search/projetSearch';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';

const BasicTypography = () => {
  const [projets, setProjets] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userType, setUserType] = useState('');
  const [userRole, setUserRole] = useState('');

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
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const decoded = jwtDecode(token);
      setUserType(decoded.type);

      const response = await axios.get('http://localhost:2023/projetUser', config);
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
    fetchUserRole(projet._id); // Fetch user role when a project is clicked
    setSelectedProject(projet);
  };

  const fetchUserRole = async (projetId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`http://localhost:2023/roleType/${projetId}`, config);
      if (response.data === true) {
        setUserRole("Responsable");
      } else {
        setUserRole("Membre");      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération du rôle de l'utilisateur :", error);
    }
  };

  return (
    <React.Fragment>
      <Search />
      <Breadcrumb>
        <Breadcrumb.Item active>Projets</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        {projets.length > 0 ? (
          projets.map((projet) => (
            <Col key={projet._id} lg={6} xl={4}>
              <Card onClick={() => handleProjectClick(projet)}>
                <Card.Header>
                  <Card.Title as="h5">{projet.projetN}</Card.Title>
                </Card.Header>
                <Card.Body className={`text-white bg-${colorsByEtat[projet.etat]} text-center`}>
                  {projet.etat}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Chargement des projets...</p>
        )}
      </Row>
      {selectedProject && (
        <ProjectDetailsModal
          projet={selectedProject}
          onClose={() => setSelectedProject(null)}
          userType={userType}
          userRole={userRole}
        />
      )}
    </React.Fragment>
  );
};

const ProjectDetailsModal = ({ projet, onClose, userType, userRole }) => {
  const handleTask = () => {
    window.location.href = `/basic/typography/projects/${projet.projet_id}/tasks`;
  };

  const handleDetail = () => {
    window.location.href = `/tables/phases/${projet.projet_id}`;
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
        <h4>{projet.projetN}</h4>
        <p>{projet.desc}</p>
        <p>Date début : {formatDate(projet.dateD)}</p>
        <p>Date Fin : {formatDate(projet.dateF)}</p>
        <p>{projet.etat}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onClose}>
          Fermer
        </Button>
        <Button variant="success" onClick={handleTask}>
          Tâches
        </Button>
        {(userType === 'Admin' || userRole === 'Responsable') && (
          <Button variant="danger" onClick={handleDetail}>
            Détails
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

ProjectDetailsModal.propTypes = {
  projet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    projetN: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    dateD: PropTypes.string.isRequired,
    dateF: PropTypes.string.isRequired,
    etat: PropTypes.string.isRequired,
    projet_id: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default BasicTypography;
