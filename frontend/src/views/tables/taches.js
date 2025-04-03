import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from '../search/taskSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';

const BootstrapTable = () => {
  const [taches, setTaches] = useState([]);
  const { phaseId } = useParams();
  const { projetId } = useParams();

  useEffect(() => {
    fetchTaches();
  }, []);

  const fetchTaches = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token du stockage local
      if (!token) {
        window.location.href = '/login';
        return
      }

            // Décoder le token pour obtenir le payload
            const decodedToken = jwtDecode(token);

            // Assurez-vous que userId est la clé correcte
            const userType = decodedToken.type
      
            const config = {
              headers: {
                Authorization: `Bearer ${token}`, // Ajouter le token comme en-tête d'autorisation
              },
            };
      
            const role = await axios.get(`http://localhost:2023/roleType/${projetId}`,config);

            if(userType === "Admin" || role.data){
              const response = await axios.get(`http://localhost:2023/taches/${phaseId}/${projetId}`,config);
              if (Array.isArray(response.data)) {
                setTaches(response.data);
               } else {
                 console.error('Invalid data format received:', data);
               }
            }else{
              window.location.href = '/login';
              return
            }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des taces :", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?");
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:2023/tache/${id}`);
      fetchTaches();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de tache :", error);
    }
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
                    <th>Nom de l employé</th>
                    <th>Date début</th>
                    <th>Date fin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {taches ? (
                    taches.map((tache, index) => (
                      <tr key={tache._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{tache.nomT}</td>
                        <td>{tache.descriptionT}</td>
                        <td>{tache.statut}</td>
                        <td>{tache.utilisateur}</td>
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
