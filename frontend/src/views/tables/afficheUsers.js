import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom'; // Import de Link
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';

const BootstrapTable = () => {
  const [userList, setUserList] = useState([]);
  const { projetId } = useParams();

  useEffect(() => {
    fetchUserList();
  }, [projetId]); // Ajout de projetId comme dépendance de useEffect

  const fetchUserList = async () => {
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
      const response = await fetch(`http://localhost:2023/rpu/${projetId}`,config);
      const data = await response.json();
      setUserList(data);
    } catch (error) {
      console.error('Error fetching user list:', error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const handleDelete = async (idRPU) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ?");
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:2023/rpu/${idRPU}`);
      fetchUserList();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de RPU :", error);
    }
  }
  };
  
  
  const handleEdit = async (id) => {
    window.location.href = `/forms/ModifierRPU/${id}/${projetId}`;
  };
  
  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Liste des Utilisateurs</h5>
                <Link to={`/forms/RPU/${projetId}`} className="btn btn-primary">Ajouter un utilisateur</Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Utilisateurs</th>
                    <th>Rôle</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.user}</td>
                      <td>{user.role}</td>
                      <td>
                        <FaRegEdit size={24} color="DodgerBlue" onClick={() => handleEdit(user.idrpu)} style={{ marginRight: '10px', cursor: 'pointer'}} />
                        <FaRegTrashCan size={24} color="red" onClick={() => handleDelete(user.idrpu)} style={{ marginRight: '10px', cursor: 'pointer' }} />
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
