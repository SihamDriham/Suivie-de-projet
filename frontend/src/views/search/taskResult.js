import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from '../search/taskSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const BootstrapTable = () => {
  const [results, setResults] = useState([]);
  const { phaseId } = useParams();
  const { projetId } = useParams();

  useEffect(() => {
   const searchResults = JSON.parse(localStorage.getItem('searchResults'));
   if (searchResults) {
     setResults(searchResults);
   }
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2023/tache/${id}`);
      fetchTaches();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de tache :", error);
    }
  };

  const handleEdit = async (id,phaseId,projetId) => {
    window.location.href = `/forms/ModifierTache/${id}/${phaseId}/${projetId}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <React.Fragment>
            <Search />
      <Row>
        <Col>
          <Card>
            <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Liste des taches</h5>
                <Link to={`/forms/AddTask/${phaseId}/${projetId}`} className="btn btn-primary">
                  Ajouter une tache
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nom de tache</th>
                    <th>Description</th>
                    <th>Statut</th>
                    <th>Nom d utilisateur</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results ? (
                    results.map((tache, index) => (
                      <tr key={tache._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{tache.nomT}</td>
                        <td>{tache.descriptionT}</td>
                        <td>{tache.statut}</td>
                        <td>{tache.user}</td>
                        <td>{formatDate(tache.dateDebutT)}</td>
                        <td>{formatDate(tache.dateFinT)}</td>
                        <td>
                          <FontAwesomeIcon icon={faTrashAlt} size="lg" onClick={() => handleDelete(tache._id)} style={{ marginRight: '10px' }} />
                          <FontAwesomeIcon icon={faEdit} size="lg" onClick={() => handleEdit(tache._id,phaseId,projetId)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">Chargement des taches...</td>
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
