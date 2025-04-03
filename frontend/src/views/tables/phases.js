import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import Search from '../search/phaseSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';

const BootstrapTable = () => {
  const [phaseList, setPhaseList] = useState([]);
  const { projetId } = useParams();
  const [isAdmin, setIsAdmin] = useState(false); // Nouvel état pour vérifier si l'utilisateur est Admin

  useEffect(() => {
    fetchPhaseList();
  }, [projetId]);

  const fetchPhaseList = async () => {
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

      if (userType === 'Admin') {
        setIsAdmin(true);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token comme en-tête d'autorisation
        },
      };

      const role = await axios.get(`http://localhost:2023/roleType/${projetId}`,config);
      if(userType === "Admin" || role.data){
        const response = await axios.get(`http://localhost:2023/phases/${projetId}`,config);
        setPhaseList(response.data);
      }else{
        window.location.href = '/login';
        return
      }
     
    } catch (error) {
      console.error('Error fetching phase list:', error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const handleEdit = (phaseId,projetId) => {
    window.location.href = `/forms/ModifierPhase/${phaseId}/${projetId}`;
  };

  const handleDelete = async (phaseId) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette phase ?");
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:2023/phase/${phaseId}`);
      fetchPhaseList();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de la phase :", error);
    }
  }
  };

  const handleTache = (phaseId,projetId) => {
    window.location.href = `/tables/AffichageTaches/${phaseId}/${projetId}`;
  };
  

  return (
    <React.Fragment>
      <Search />
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Liste des Phases</h5>
                {isAdmin && (
                  <Link to={`/forms/phase/${projetId}`} className="btn btn-primary">Ajouter une phase</Link>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Libellé</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {phaseList.map((phase, index) => (
                    <tr key={phase._id}>
                      <td>{index + 1}</td>
                      <td>{phase.libelle}</td>
                      <td>{phase.desc}</td>
                      <td>{phase.statut}</td>
                      <td>
                        {isAdmin && (
                          <>
                            <FaEdit size={24} color="DodgerBlue" onClick={() => handleEdit(phase._id, projetId)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                            <FaRegTrashAlt size={24} color="red" onClick={() => handleDelete(phase._id)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                          </>
                        )}
                        <CgDetailsMore size={24} color="DarkSlateGray" onClick={() => handleTache(phase._id, projetId)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
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
