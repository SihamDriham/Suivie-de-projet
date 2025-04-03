import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import Card from '../../components/Card/MainCard';
import axios from 'axios';
import Search from '../search/listSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const TodoList = () => {
  const [lists, setLists] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [statutIdTerminé, setStatutIdTerminé] = useState(''); // Mettre le type de statutIdTerminé à string

  useEffect(() => {
    fetchLists();
    fetchStatutIdTerminé();
  }, []);

  const fetchLists = async () => {
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
      const response = await axios.get(`http://localhost:2023/list`,config);
      setLists(response.data); // Assurez-vous que votre endpoint renvoie directement les données de la liste
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération des tâches :", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ?");
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:2023/list/${id}`);
      fetchLists();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de la tâche :", error);
    }
  }
  };

  const handleAddTask = async () => {
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
      await axios.post(`http://localhost:2023/list`, {
      contenuL: newTask
    },config);
    fetchLists();
    setNewTask('');
  } catch (error) {
    if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
      window.location.href = '/login';
    }
  }
};

  const handleChangeContent = async (id, newContent) => {
    try {
      await axios.put(`http://localhost:2023/lists/${id}`, {
        contenuL: newContent
      });
      fetchLists();
    } catch (error) {
      console.error("Une erreur s'est produite lors du changement de contenu de la tâche :", error);
    }
  };

  const handleChangeStatus = async (id) => {
    try {
      const taskToUpdate = lists.find(task => task._id === id);
      const isTaskChecked = taskToUpdate.statut_id === statutIdTerminé;
      if(isTaskChecked){
        await axios.put(`http://localhost:2023/statutList/${id}`);
      }else{
        await axios.put(`http://localhost:2023/list/${id}`);
      }  
      fetchLists();
    } catch (error) {
      console.error("Une erreur s'est produite lors du changement de statut de la tâche :", error);
    }
  };
  

  const fetchStatutIdTerminé = async () => {
    try {
      const response = await axios.get(`http://localhost:2023/statut`);
      setStatutIdTerminé(response.data); // Stocker l'ID du statut "Terminé"
    } catch (error) {
      console.error("Une erreur s'est produite lors de la récupération de l'ID du statut 'Terminé' :", error);
    }
  };

  return (
    <Row>
      <Search />
      <Col>
      <Col>
        <Card title="Liste de tâches">
          <Form className="mt-3">
            <Row className="mb-3">
            <Form.Label>Ajouter une tâche</Form.Label>
              <Col xs={9}>
                <Form.Control
                  type="text"
                  placeholder="Entrez une nouvelle tâche"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  style={{ width: '120%' }}
                />
              </Col>
              <Col xs={3}>
                <Button variant="primary" type="button" onClick={handleAddTask} style={{ marginLeft: '60%' }}>
                  Ajouter
                </Button>
              </Col>
            </Row>
          </Form>
          <ListGroup>
            {lists.length === 0 ? (
              <p>Aucune tâche à afficher</p>
            ) : (
              lists.map(task => (
                <ListGroup.Item key={task._id} className="mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Check
                      type="checkbox"
                      id={`task-${task._id}`}
                      checked={task.statut_id === statutIdTerminé}
                      onChange={() => handleChangeStatus(task._id)}
                    />
                    <Form.Control
                      type="text"
                      value={task.contenuL}
                      onChange={(e) => handleChangeContent(task._id, e.target.value)}
                      style={{ width: '300px', textDecoration: task.statut_id === statutIdTerminé ? 'line-through' : 'none' }}
                      readOnly={false}
                    />
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(task._id)}>Supprimer</Button>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      </Col>
      </Col>
    </Row>
  );
};

export default TodoList;
