import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 70%;
    margin: 1.75rem auto;
  }
  .modal-content {
    border: none;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .modal-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
  }
  .section-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.6rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #555;
  }
  .event-details-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }
  .event-details-header,
  .event-details-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .event-detail {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 1.1rem;
    color: #444;
  }
  .detail-label {
    font-weight: bold;
    margin-right: 0.5rem;
    color: #666;
  }
  .detail-value {
    flex-grow: 1;
    color: #333;
  }
  .event-day-details {
    border-top: 1px solid #ccc;
    padding-top: 2rem;
  }
  .day-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #555;
  }
  .event-detail-item {
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .detail-title {
    font-family: 'Arial', sans-serif;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #444;
  }
  .modal-footer {
    border-top: none;
    padding-top: 1rem;
  }
  .modal-footer button {
    font-size: 1rem;
    border-radius: 5px;
    padding: 0.75rem 2rem;
    background: linear-gradient(-135deg, #1de9b6 0%, #1dc4e9 100%);
    border: none;
  }
  .modal-footer button:hover {
    opacity: 0.8;
  }
  .icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .edit-icon {
    color: #28a745;
  }
  .delete-icon {
    color: #dc3545;
  }
  .add-icon {
    color: #007bff;
    margin-left: 10px;
    cursor: pointer;
  }
`;

function Calendar() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    event: {},
    joursEvenement: []
  });

  const [userType, setUserType] = useState(''); // Ajouter un état pour le type d'utilisateur

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
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
      // Décoder le token pour obtenir le type d'utilisateur
    const decoded = jwtDecode(token);

      setUserType(decoded.type); // Définir le type d'utilisateur

    // Déterminer la route en fonction du type d'utilisateur
    let response;
    if (decoded.type === 'Admin') {
      response = await axios.get("http://localhost:2023/events", config);
    } else {
      response = await axios.get("http://localhost:2023/events/user/id", config);
    }
      const data = response.data;
      const formattedEvents = data.map((event) => ({
        id: event._id,
        title: event.titre,
        description: event.description,
        start: event.dateDebut,
        end: event.dateFin,
        location: event.lieu,
        type: event.typeE,
        project: event.projet,
        details: []
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erreur lors de la récupération des événements", error);
      if (error.response && error.response.status === 403 && error.response.data && error.response.data.message === 'Accès interdit') {
        window.location.href = '/login';
      }
    }
  };

  const handleEventClick = async (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    try {
      const response = await axios.get(`http://localhost:2023/events/${clickInfo.event.id}/details`);
      const data = response.data;
      setEventDetails(data);
      setShowModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'événement", error);
    }
  };

  const handleClose = () => setShowModal(false);

  const renderEventContent = (eventInfo) => (
    <div>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </div>
  );

  const handleEditClick = () => {
    if (selectedEvent) {
      window.location.href = `/edit-event/${selectedEvent.id}`;
    }
  };

  const handleEditDetail = (detailId) => {
    window.location.href = `/edit-detail/${detailId}`;
  };

  const handleDeleteDetail = async (detailId) => {
    try {
      await axios.delete(`http://localhost:2023/detailsJour/${detailId}`);
      const updatedEventDetails = { ...eventDetails };
      updatedEventDetails.joursEvenement = updatedEventDetails.joursEvenement.map((jour) => {
        jour.details = jour.details.filter((detail) => detail._id !== detailId);
        return jour;
      });
      setEventDetails(updatedEventDetails);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la suppression de detail :", error);
    }
  };

  const handleAddDetail = (jourId) => {
    window.location.href = `/add-detail/${jourId}`;
  };

  const handleDeleteClick = async () => {
    if (selectedEvent) {
      try {
        const token = localStorage.getItem('token'); // Récupérer le token du stockage local
        if (!token) {
          window.location.href = '/login';
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token comme en-tête d'autorisation
          },
        };
        await axios.delete(`http://localhost:2023/events/${selectedEvent.id}`, config);
        setEvents(events.filter(event => event.id !== selectedEvent.id));
        setShowModal(false);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement", error);
      }
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"90vh"}
        events={events}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: true
        }}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />

      <StyledModal show={showModal} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">
            {selectedEvent ? selectedEvent.title : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="event-details-container">
            <div className="event-details-header">
              <h2 className="section-title">Event Details</h2>
              {selectedEvent && (
                <>
                  <div className="event-detail">
                    <i className="icon fas fa-calendar-alt" style={{ color: '#6CB2EB' }}></i>
                    <div>
                      <span className="detail-label">Start:</span>
                      <span className="detail-value">
                        {selectedEvent.start ? new Date(selectedEvent.start).toLocaleString() : ''}
                      </span>
                    </div>
                  </div>
                  <div className="event-detail">
                    <i className="icon fas fa-calendar-alt" style={{ color: '#6CB2EB' }}></i>
                    <div>
                      <span className="detail-label">End:</span>
                      <span className="detail-value">
                        {selectedEvent.end ? new Date(selectedEvent.end).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="event-details-content">
              {selectedEvent && (
                <>
                  <div className="event-detail">
                    <i className="icon fas fa-map-marker-alt" style={{ color: '#6CB2EB' }}></i>
                    <div>
                      <span className="detail-label">Location:</span>
                      <span className="detail-value">
                        {selectedEvent.extendedProps.location}
                      </span>
                    </div>
                  </div>
                  <div className="event-detail">
                    <i className="icon fas fa-tag" style={{ color: '#6CB2EB' }}></i>
                    <div>
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">
                        {selectedEvent.extendedProps.type}
                      </span>
                    </div>
                  </div>
                  <div className="event-detail">
                    <i className="icon fas fa-project-diagram" style={{ color: '#6CB2EB' }}></i>
                    <div>
                      <span className="detail-label">Project:</span>
                      <span className="detail-value">
                        {selectedEvent.extendedProps.project}
                      </span>
                    </div>
                  </div>
                  <div className="event-detail">
                    <i className="icon fas fa-align-left" style={{ color: '#6CB2EB' }}></i>
                    <div>
                      <span className="detail-label">Description:</span>
                      <p className="detail-value">
                        {selectedEvent.extendedProps.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {eventDetails.joursEvenement && eventDetails.joursEvenement.map((jour, index) => (
              <div key={jour.jour._id} className="event-day-details">
                <h3 className="day-title">
                  Day {index + 1}: {new Date(jour.jour.date).toLocaleDateString()}
                  {userType === 'Admin' && ( // Afficher le bouton d'ajout uniquement pour les Admins
                    <FontAwesomeIcon icon={faPlus} className="icon add-icon" onClick={() => handleAddDetail(jour.jour._id)} />
                  )}
                </h3>
                {jour.details && jour.details.map((detail) => (
                  <div key={detail._id} className="event-detail-item">
                    <h4 className="detail-title">{detail.titre} ({detail.heureDebut} - {detail.heureFin})</h4>
                    {userType === 'Admin' && (
                      <>
                        <FontAwesomeIcon icon={faEdit} className="icon edit-icon" onClick={() => handleEditDetail(detail._id)} />
                        <FontAwesomeIcon icon={faTrash} className="icon delete-icon" onClick={() => handleDeleteDetail(detail._id)} />
                      </>
                    )}

                    </div>
                ))}
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {userType === 'Admin' && (
            <Button variant="secondary" onClick={handleEditClick}>
              Modifier
            </Button>
          )}
          {userType === 'Admin' && (
            <Button variant="danger" onClick={handleDeleteClick}> Supprimer </Button>
          )}
        </Modal.Footer>

      </StyledModal>
    </div>
  );
}

export default Calendar;
