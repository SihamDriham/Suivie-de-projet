import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Switch from 'react-switch'; // Importez le composant de bouton de switch
import { faTrashAlt, faEdit, faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from '../search/userSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const BootstrapTable = () => {
  const [results, setResults] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // Ajoutez un état pour gérer la visibilité des mots de passe

  useEffect(() => {
    // Récupérer les résultats de la recherche depuis localStorage
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    if (searchResults) {
      setResults(searchResults);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2023/users/${id}`);
      setResults(results.filter(user => user._id !== id)); // Mettre à jour l'état après suppression
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de l'utilisateur :", error);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/user/modifier/${id}`;
  };

  const handleToggleUser = async (id, isActive) => {
    try {
      await axios.patch(`http://localhost:2023/activation/${id}`, { activation: !isActive });
      setResults(results.map(user => user._id === id ? { ...user, activation: !isActive } : user)); // Mettre à jour l'état après modification
    } catch (error) {
      console.error("Une erreur s'est produite lors de la mise à jour de l'état de l'utilisateur :", error);
    }
  };

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prevState => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
  };

  return (
    <React.Fragment>
      <Search />
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Liste des utilisateurs</h5>
                <Link to="/forms/form-basic" className="btn btn-primary">
                  Ajouter un utilisateur
                </Link>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>CIN</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Telephone</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    results.map((user, index) => (
                      <tr key={user._id}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <img
                            src={`http://localhost:2023/${user.image}`}
                            alt="user"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        </td>
                        <td>{user.cin}</td>
                        <td>{user.nomU}</td>
                        <td>{user.prenom}</td>
                        <td>{user.telephone}</td>
                        <td>{user.email}</td>
                        <td>
                          {visiblePasswords[user._id] ? (
                            user.password
                          ) : (
                            Array(user.password.length + 1).join('*')
                          )}
                          <FontAwesomeIcon
                            icon={visiblePasswords[user._id] ? faEyeSlash : faEye}
                            onClick={() => togglePasswordVisibility(user._id)}
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                          />
                        </td>
                        <td>{user.__t === 'UserNormal' ? 'Employee normal' : 'Administrateur'}</td>
                        <td>
                          <Switch
                            onChange={() => handleToggleUser(user._id, user.activation)}
                            checked={user.activation}
                            onColor="#86d3ff"
                            offColor="#bbbbbb"
                            checkedIcon={false}
                            uncheckedIcon={false}
                          />
                        </td>
                        <td>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            size="lg"
                            onClick={() => handleDelete(user._id)}
                            style={{ marginRight: '10px', cursor: 'pointer' }}
                          />
                          <FontAwesomeIcon
                            icon={faEdit}
                            size="lg"
                            onClick={() => handleEdit(user._id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10">Chargement des utilisateurs...</td>
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
