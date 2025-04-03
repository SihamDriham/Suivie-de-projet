import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; // Ensure axios is imported
import { Card } from 'react-bootstrap';
import { FaCheckDouble } from 'react-icons/fa'; // Import the double check icon from FontAwesome

const Messages = ({ message, createdAt, lu }) => {
  const [userId, setUserId] = useState('');
  const formattedCreatedAt = new Date(createdAt).toLocaleString();

  let msgClass = [];
  useEffect(() => {
    const getTokenAndFetchUserId = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token as an authorization header
            },
          };
          const response = await axios.get('http://localhost:2023/friend', config);
          setUserId(response.data); // Set the user ID from the response data  
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    getTokenAndFetchUserId();
  }, []);

  if (message.user._id === userId) {
    msgClass = [...msgClass, 'chat-menu-reply text-muted'];
  } else {
    msgClass = [...msgClass, 'chat-menu-content'];
  }

  return (
    <Card className="d-flex align-items-start shadow-none mb-0 p-0 chat-messages"
    style={{ flexDirection: 'row', backgroundColor: 'unset' }}>
      <Card.Body className={msgClass.join(' ')} style={{ padding: 0 }} >
        <div className="">
          <p className="chat-cont">{message.contenuM}</p>
        </div>
        <div className="d-flex align-items-center">
          <p className="chat-time mb-0">{formattedCreatedAt}</p>
          {lu && <FaCheckDouble className="ml-2 text-primary" />} {/* Affiche l'icône de lu en bleu */}
        </div>
      </Card.Body>
    </Card>
  );
};

Messages.propTypes = {
  message: PropTypes.object.isRequired,
  createdAt: PropTypes.string.isRequired,
  lu: PropTypes.bool.isRequired,
};

export default Messages;
