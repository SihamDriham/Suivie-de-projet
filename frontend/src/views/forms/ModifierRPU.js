import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

const ModifierTache = () => {
    const [userList, setUserList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [selectedRolesId, setSelectedRolesId] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState([]);
    const { id } = useParams();
    const { projetId } = useParams();
  
    useEffect(() => {
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
            axios.get(`http://localhost:2023/rpu/${projetId}`,config),
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

      const fetchUser = async () => {
        try {
          const response = await axios.get(`http://localhost:2023/userRPU/${id}`);
          const user = response.data;
          setSelectedRolesId(user.role);
          setSelectedUserId(user.user);
        } catch (error) {
          console.error("Une erreur s'est produite lors de la récupération des données de l'utilisateur :", error);
        }
      };
      fetchUser();
  
      fetchData();
    }, []);

    // const fetchRPU = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:2023/tasks/${id}`);
    //     const tache = response.data;
    //     setNomT(tache.nomT)
    //     setDescriptionT(tache.descriptionT);
    //     setDateDebutT(moment(tache.dateDebutT).format('YYYY-MM-DD'));
    //     setDateFinT(moment(tache.dateFinT).format('YYYY-MM-DD'));
    //   } catch (error) {
    //     console.error("Une erreur s'est produite lors de la récupération des données du tache :", error);
    //   }
    // };

 
   const handleChangeRoles = (event) => {
    setSelectedRolesId(event.target.value);
   };
 
   const handleChangeUser = (event) => {
     setSelectedUserId(event.target.value);
   }; 

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        try {
          await axios.put(`http://localhost:2023/rpu/${id}`, {
            roleId: selectedRolesId,
            userId: selectedUserId,
          });
          window.location.href = `/tables/AffichageRPU/${projetId}`;
        } catch (error) {
          console.error("Une erreur s'est produite lors de la modification du rpu :", error);
        }
      };
      return (
       <React.Fragment>
         <Row>
           <Col sm={12}>
             <Card>
               <Card.Header>
                 <Card.Title as="h5">Modifier une nouvelle tâche</Card.Title>
               </Card.Header>
               <Card.Body>
                 <Form onSubmit={handleSubmit}>
                 <Row>
                    <Form.Group className="mb-3" as={Col} controlId="formUser">
                      <Form.Label>Utilisateur</Form.Label>
                      <Form.Control as="select" value={selectedUserId} onChange={handleChangeUser}>
                        <option value="">Choisir...</option>
                        {userList.map((user) => (
                          <option key={user.id} value={user.id} selected={selectedUserId === user.id}>{user.user}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Col} controlId="formProjet">
                      <Form.Label>Role</Form.Label>
                      <Form.Control as="select" value={selectedRolesId} onChange={handleChangeRoles}>
                        <option value="">Choisir...</option>
                        {roleList.map((role) => (
                          <option key={role._id} value={role._id} selected={selectedRolesId === role._id}>{role.nomR}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Row>
                   <Button variant="primary" type="submit">Ajouter Tâche</Button>
                 </Form>
               </Card.Body>
             </Card>
           </Col>
         </Row>
       </React.Fragment>
     );
  };
  
  export default ModifierTache;
