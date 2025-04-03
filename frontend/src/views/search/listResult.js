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
   const searchResults = JSON.parse(localStorage.getItem('searchResults'));
   if (searchResults) {
    setLists(searchResults);
   }
  };

  const handleDelete = async (id) => {
    try {
      const listString = localStorage.getItem('searchResults');

      let list = [];
  
      if (listString) {
        list = JSON.parse(listString);
      }

      // Filtrer la liste pour supprimer l'élément avec l'ID spécifié
      const updatedList = list.filter(item => item._id !== id);

  
      // Enregistrer la liste mise à jour dans localStorage
      localStorage.setItem('searchResults', JSON.stringify(updatedList));
  
      console.log("Liste mise à jour dans localStorage:", JSON.parse(localStorage.getItem('searchResults')));
  
      // Optionnel : Si vous avez besoin de faire une suppression côté serveur aussi
      await axios.delete(`http://localhost:2023/list/${id}`);
  
      // Recharger ou mettre à jour l'affichage des listes
      fetchLists();
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de l'élément :", error);
    }
  };  
  
  const handleAddTask = async () => {
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
  
      // Effectuer la requête POST pour ajouter une tâche
      const response = await axios.post(`http://localhost:2023/list`, {
        contenuL: newTask
      }, config);
  
      // Récupérer l'ID généré par MongoDB depuis la réponse
  
      // Mettre à jour les données dans localStorage
    const listString = localStorage.getItem('searchResults');
    let list = [];

    if (listString) {
      list = JSON.parse(listString);
    }

    list.push(response.data.data);
    localStorage.setItem('searchResults', JSON.stringify(list));

      // Actualiser l'affichage des listes
      fetchLists();
      setNewTask('');
    } catch (error) {
      console.error("Une erreur s'est produite lors de l'ajout de la tâche :", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };
  

  const handleChangeContent = async (id, newContent) => {
    try {
      // Récupérer la liste actuelle des tâches depuis localStorage
      const listString = localStorage.getItem('searchResults');
      let list = [];

      if (listString) {
        list = JSON.parse(listString);
      }

      // Trouver l'index de la tâche à mettre à jour
      const taskIndex = list.findIndex(task => task._id === id);
      if (taskIndex === -1) {
        console.error("Tâche non trouvée");
        return;
      }

      // Mettre à jour le contenu de la tâche localement
      list[taskIndex].contenuL = newContent;

      // Enregistrer la liste mise à jour dans localStorage
      localStorage.setItem('searchResults', JSON.stringify(list));

      // Envoyer la mise à jour au serveur
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
      
      const endpoint = isTaskChecked ? `http://localhost:2023/statutList/${id}` : `http://localhost:2023/list/${id}`;
      const response = await axios.put(endpoint);
      
      let searchResults = JSON.parse(localStorage.getItem('searchResults')) || [];
      searchResults = Array.isArray(searchResults) ? searchResults : [searchResults];
      
      const updatedTaskIndex = searchResults.findIndex(task => task._id === id);
      if (updatedTaskIndex !== -1) {
        searchResults[updatedTaskIndex] = response.data;
      } else {
        searchResults.push(response.data);
      }
      
      localStorage.setItem('searchResults', JSON.stringify(searchResults));
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
                  <Button variant="primary" type="button" onClick={handleAddTask}  style={{ marginLeft: '60%' }}>Ajouter</Button>
                </Col>
            </Row>
          </Form>
          <ListGroup>
            {lists.length === 0 ? (
              <p>Aucune tâche à afficher</p>
            ) : (
              lists.map(task => (
                <ListGroup.Item key={task._id}>
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
                      readOnly={false} // Assurez-vous que l'input n'est pas en lecture seule
                    />

                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(task._id)}>Supprimer</Button>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default TodoList;
