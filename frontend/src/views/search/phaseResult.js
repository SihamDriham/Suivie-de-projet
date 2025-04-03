import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FaRegTrashAlt, FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import axios from 'axios';
import Search from '../search/phaseSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const BootstrapTable = () => {
 const [results, setResults] = useState([]);
 const { projetId } = useParams();

 useEffect(() => {
  const searchResults = JSON.parse(localStorage.getItem('searchResults'));
  if (searchResults) {
    setResults(searchResults);
  }
 }, []);


  const handleEdit = (phaseId,projetId) => {
    window.location.href = `/forms/ModifierPhase/${phaseId}/${projetId}`;
  };

  const handleDelete = async (phaseId) => {
    try {
      await axios.delete(`http://localhost:2023/phase/${phaseId}`);
      fetchPhaseList();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de la phase :", error);
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
                <Link to={`/forms/phase/${projetId}`} className="btn btn-primary">Ajouter une phase</Link>
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
                  {results.map((phase, index) => (
                    <tr key={phase._id}>
                      <td>{index + 1}</td>
                      <td>{phase.libelle}</td>
                      <td>{phase.desc}</td>
                      <td>{phase.statut}</td>
                      <td>
                        <FaEdit size={24} color="DodgerBlue" onClick={() => handleEdit(phase._id,projetId)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                        <FaRegTrashAlt size={24} color="red" onClick={() => handleDelete(phase._id)} style={{ marginRight: '10px', cursor: 'pointer' }}  />
                        <CgDetailsMore size={24} color="DarkSlateGray" onClick={() => handleTache(phase._id,projetId)} style={{ marginRight: '10px', cursor: 'pointer' }} />
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
