import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Breadcrumb, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import Search from '../search/tacheSearch'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const BasicTypography = () => {
  const { projetId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks()
   
  }, []);

  const fetchTasks = async () =>{
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    if (searchResults) {
     setTasks(searchResults);
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const isTaskLate = (dateFinT) => {
    const today = new Date();
    const endDate = new Date(dateFinT);
    return endDate < today;
  };
  
  const renderTaskList = (status) => {
    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {tasks
              .filter(task => task.statut === status)
              .map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <p
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card onClick={() => handleTaskClick(task)}>
                        <Card.Body>
                          <Card.Title>{task.nomT}</Card.Title>
                          <Card.Text
                            className={isTaskLate(task.dateFinT) ? 'text-danger' : ''}
                          >
                            {formatDate(task.dateDebutT)}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </p>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    );
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
  
    const taskId = tasks.find(task => task._id === result.draggableId)._id; // Obtenez l'ID de la tâche déplacée
    const etat = destination.droppableId; // Obtenez le nouvel état de la tâche déplacée

    try {
      const listString = localStorage.getItem('searchResults');
      
      let list = [];

      if (listString) {
        list = JSON.parse(listString);
      }
      const taskIndex = list.findIndex(task => task._id === taskId);
      if (taskIndex === -1) {
        console.error("Tâche non trouvée");
        return;
      }
      
      const statutResponse = await axios.post('http://localhost:2023/statuts', {
        etat: etat
      });

      const statutId = statutResponse.data;
      list[taskIndex].statut = etat;
      localStorage.setItem('searchResults', JSON.stringify(list));

      await axios.put(`http://localhost:2023/tacheStatut/${taskId}/${projetId}`, { statut_id: statutId });
  
      fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
    }
  };
  

  return (
    <React.Fragment>
      <Search />
      <Breadcrumb>
        <Breadcrumb.Item active>Tâches</Breadcrumb.Item>
      </Breadcrumb>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          <Col>
            <Card style={{ backgroundColor: 'SkyBlue' }}>
              <Card.Header>
                <Card.Title as="h5">À faire</Card.Title>
              </Card.Header>
              <Card.Body >
                {renderTaskList('À faire')}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ backgroundColor: 'LightSteelBlue' }}>
              <Card.Header>
                <Card.Title as="h5">En cours</Card.Title>
              </Card.Header>
              <Card.Body>
                {renderTaskList('En cours')}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ backgroundColor: 'LightSalmon' }}>
              <Card.Header>
                <Card.Title as="h5">En attente</Card.Title>
              </Card.Header>
              <Card.Body>
                {renderTaskList('En attente')}
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ backgroundColor: 'LightGreen' }}>
              <Card.Header>
                <Card.Title as="h5">Terminé</Card.Title>
              </Card.Header>
              <Card.Body>
                {renderTaskList('Terminé')}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </DragDropContext>
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </React.Fragment>
  );
};

function TaskDetailsModal({ task, onClose }) {
  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Détails de la tâche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{task.nomT}</h4>
        <p>{task.descriptionT}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// PropTypes pour valider les props
TaskDetailsModal.propTypes = {
  task: PropTypes.shape({
    nomT: PropTypes.string.isRequired,
    descriptionT: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default BasicTypography;
