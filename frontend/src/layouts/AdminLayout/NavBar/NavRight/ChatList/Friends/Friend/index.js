import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importer axios pour les requêtes HTTP
import io from "socket.io-client";

const ENDPOINT = "http://localhost:2023"; // Remplacez par l'URL de votre serveur
var socket;

const Friend = ({ data, activeId, clicked }) => {
  const [unreadMessages, setUnreadMessages] = useState([]);

  // Utiliser l'URL complète de l'image
  const photo = `http://localhost:2023/${data.image}`;

  // Déterminer les classes CSS pour l'état de l'utilisateur (en ligne ou hors ligne)
  let timeClass = ['d-block f-w-400'];
  if (data.status) {
    timeClass = [...timeClass, 'text-c-green'];
  } else {
    timeClass = [...timeClass, 'text-muted'];
  }

  // Afficher l'heure ou l'état de l'utilisateur
  let time = '';
  if (data.time) {
    time = <small className={timeClass.join(' ')}>{data.time}</small>;
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    const fetchUnreadMessages = async () => {
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
        const response = await axios.get('http://localhost:2023/unread-messages', config);
        setUnreadMessages(response.data);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    socket.on("newMessage", () => {
      fetchUnreadMessages();
    });
  }, []);

  const getUnreadMessagesCount = (otherUserId) => {
    const conversation = unreadMessages.find(conv => conv.otherUserId === otherUserId);
    return conversation ? conversation.unreadMessagesCount : 0;
  };

  return (
    <React.Fragment>
      <Card
        className={activeId === data._id ? 'userlist-box mb-0 shadow-none active' : 'userlist-box mb-0 shadow-none'}
        style={{ flexDirection: 'row', backgroundColor: 'unset' }}
        onClick={clicked}
        onKeyDown={clicked}
        tabIndex="0"
        role="button"
      >
        <Link to="#" className="media-left">
          <img
            className="media-object img-radius"
            src={photo}
            alt={data.nomU}
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
          {getUnreadMessagesCount(data._id) > 0 && (
            <div className="live-status">
              {getUnreadMessagesCount(data._id)}
            </div>
          )}
        </Link>
        <Card.Body className="p-0">
          <h6 className="chat-header">
            {data.prenom} {data.nomU} 
            {time}
          </h6>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

Friend.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    nomU: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    status: PropTypes.number,
    time: PropTypes.string,
  }).isRequired,
  activeId: PropTypes.string,
  clicked: PropTypes.func.isRequired,
};

export default Friend;
