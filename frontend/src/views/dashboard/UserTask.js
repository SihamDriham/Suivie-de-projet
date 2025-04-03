import React, { useState, useEffect } from 'react';
import { Row, Table, Modal, Button } from 'react-bootstrap';
import axios from 'axios'; // Assurez-vous d'importer axios
import { TbListDetails } from "react-icons/tb";

const UserTask = () => {
  const [users, setUsers] = useState([]);
  const [userStatistics, setUserStatistics] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tasksEnRetard, setTasksEnRetard] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchUserStatistics();
  }, []);

  const fetchUsers = async () => {
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
      const response = await axios.get('http://localhost:2023/usersNormal', config);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des utilisateurs :", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const fetchUserStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:2023/statistiqueTask');
      const userStats = response.data.statistiques;
      setUserStatistics(userStats);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des statistiques des utilisateurs :", error);
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const handleOpenModal = async (user) => {
    setSelectedUser(user);
    try {
      const response = await axios.get(`http://localhost:2023/retard/${user._id}`);
      setTasksEnRetard(response.data.tasks);
      setShowModal(true);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des tâches en retard :", error);
    }
  };

  return (
    <React.Fragment>
      <Row>
       <Table responsive hover>
         <thead>
           <tr>
             <th>Utilisateur</th>
             <th>Nom et Prénom</th>
             <th>Statuts</th>
             <th>Tâches</th>
           </tr>
         </thead>
         <tbody>
           {users.length > 0 ? (
             users.map((user) => {
               const userStat = userStatistics.find(stat => stat.utilisateur === user.cin);
               return (
                 <tr key={user._id}>
                   <td>
                     <img
                       src={`http://localhost:2023/${user.image}`}
                       alt=""
                       style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                     />
                   </td>
                   <td>
                     <h6 className="mb-1">
                       {user.nomU} {user.prenom}
                     </h6>
                   </td>
                   <td>
                     <h6 className="m-0">{userStat ? `${userStat.pourcentageAvancement}%` : 'N/A'}</h6>
                   </td>
                   <td>
                    <TbListDetails size={24} color="Red" style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(user)} />
                   </td>
                 </tr>
               );
             })
           ) : (
             <tr>
               <td colSpan="10">Chargement des utilisateurs...</td>
             </tr>
           )}
         </tbody>
       </Table>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tâches de {selectedUser && `${selectedUser.nomU} ${selectedUser.prenom}`} en retard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tasksEnRetard.length > 0 ? (
            tasksEnRetard.map(task => (
              <div key={task._id}>

                <li>{task.nomT}: {task.projet}</li>
              </div>
            ))
          ) : (
            <p>Aucune tâche en retard pour cet utilisateur.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default UserTask;
