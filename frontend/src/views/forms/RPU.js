import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios'; 
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:2023";

var socket;

const FormsElements = () => {
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
      socket = io(ENDPOINT);
      socket.on("connected", () => setSocketConnected(true));

    const fetchData = async () => {
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
        const [usersResponse, rolesResponse] = await Promise.all([
          axios.get('http://localhost:2023/usersNormal',config),
          axios.get('http://localhost:2023/roles',config)
        ]);         
        setUserList(usersResponse.data);
        setRoleList(rolesResponse.data);
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données :', error);
        if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
          window.location.href = '/login';
        }
      }
    };

    fetchData();
  }, []);

  const handleAddRow = () => {
    setSelectedUsers([...selectedUsers, '']);
    setSelectedRoles([...selectedRoles, '']);
  };

  const handleRemoveRow = (index) => {
    const updatedUsers = [...selectedUsers];
    const updatedRoles = [...selectedRoles];
    updatedUsers.splice(index, 1);
    updatedRoles.splice(index, 1);
    setSelectedUsers(updatedUsers);
    setSelectedRoles(updatedRoles);
  };


  const handleSubmit = async () => {
    try {
      await Promise.all(selectedUsers.map((userId, index) => {
        const roleId = selectedRoles[index];
        return axios.post('http://localhost:2023/rpu', {
          user_id: userId,
          role_id: roleId,
          projet_id: id
        });
      }));
  
      if (socket) {
        socket.emit("sendNotification"); // Émettre une notification vers le serveur avec les utilisateurs sélectionnés et le contenu
    }
      window.location.href = `/tables/AffichageRPU/${id}`;
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout des RPUs :", error);
    }
  };
  

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Ajouter de nouveaux utilisateurs</Card.Title>
            </Card.Header>
            <Card.Body>
              {selectedUsers.map((_, index) => (
                <Row key={index} className="mb-3">
                  <Col md={5}>
                  <label htmlFor={`user-${index}`}>Utilisateur:</label>
                  <Select
                    value={selectedUsers[index] ? { value: selectedUsers[index], label: `${userList.find(user => user._id === selectedUsers[index])?.nomU} ${userList.find(user => user._id === selectedUsers[index])?.prenom}` } : null}
                    onChange={(selectedOption) => {
                      const updatedUsers = [...selectedUsers];
                      updatedUsers[index] = selectedOption ? selectedOption.value : '';
                      setSelectedUsers(updatedUsers);
                    }}
                    options={userList.map(user => ({ value: user._id, label: `${user.nomU} ${user.prenom}` }))}
                    placeholder="Sélectionnez un utilisateur"
                    isSearchable={true}
                  />
                  </Col>
                  <Col md={5}>
                  <label htmlFor={`role-${index}`}>Rôle :</label>
                  <Select
                    value={selectedRoles[index] ? { value: selectedRoles[index], label: roleList.find(role => role._id === selectedRoles[index])?.nomR } : null}
                    onChange={(selectedOption) => {
                      const updatedRoles = [...selectedRoles];
                      updatedRoles[index] = selectedOption ? selectedOption.value : '';
                      setSelectedRoles(updatedRoles);
                    }}
                    options={roleList.map(role => ({ value: role._id, label: role.nomR }))}
                    placeholder="Sélectionnez un rôle"
                    isSearchable={true}
                  />
                  </Col>
                  <Col md={2}>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveRow(index)}
                    style={{
                      margin: '21% 0 0 0',
                      height: '58%',
                      width: '30%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="primary" onClick={handleAddRow}><FontAwesomeIcon icon={faPlus} /></Button>
              <Button variant="primary" onClick={handleSubmit}>Ajouter</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default FormsElements;
