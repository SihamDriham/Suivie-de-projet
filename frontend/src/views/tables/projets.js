import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BootstrapTable = () => {
  const [projets, setProjets] = useState([]);

  useEffect(() => {
    fetchProjets();
  }, []);
  
  const fetchProjets = async () => {
    try {
      const response = await axios.get('http://localhost:2023/projets');
      if (Array.isArray(response.data)) {
        setProjets(response.data);
      } else {
        console.error('Invalid data format received:', data);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des projets :", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:2023/projets/${id}`);
      try {
        const response = await axios.get('http://localhost:2023/projets');
        if (Array.isArray(response.data)) {
          setProjets(response.data);
        } else {
          console.error('Invalid data format received:', data);
        }
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des projets :", error);
      }
        } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de projet :", error);
    }
  }
  };

  const handleEdit = async (id) => {
        window.location.href = `/forms/ModifierProjet/${id}`;
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Liste des Projets</h5>
                <Link to="/forms/AddProject" className="btn btn-primary">
                  Ajouter un Projet
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Projet</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projets ? (
                    projets.map((projet, index) => (
                      <tr key={projet._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{projet.nomP}</td>
                        <td>{projet.statut}</td>
                        <td>
                          <FontAwesomeIcon icon={faTrashAlt} size="lg" onClick={() => handleDelete(projet._id)} style={{ marginRight: '10px' }} />
                          <FontAwesomeIcon icon={faEdit} size="lg" onClick={() => handleEdit(projet._id)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">Chargement des projets...</td>
                    </tr>
                  )}
                </tbody>

              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BootstrapTable;
