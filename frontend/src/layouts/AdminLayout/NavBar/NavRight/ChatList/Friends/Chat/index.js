// Chat.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FormControl, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Messages from './Messages';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:2023";

var socket;

const Chat = ({ user, chatOpen, listOpen, closed, conversationId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connected", () => setSocketConnected(true));


    if (conversationId) {
      fetchMessages();

      socket.on("newMessage", () => {
        fetchMessages();
      });

    }

  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`http://localhost:2023/messages/${conversationId}`, config);
      
      // Récupérer les messages lus
      const luResponse = await axios.get(`http://localhost:2023/messages-lu`, config);
      const messagesLuIds = luResponse.data.map(msg => msg._id);
      socket.emit("sendMessage"); // Émettre une notification vers le serveur avec les utilisateurs sélectionnés et le contenu

      // Ajouter une propriété 'lu' aux messages pour indiquer s'ils sont lus
      const messagesWithLu = response.data.map(msg => ({
        ...msg,
        lu: messagesLuIds.includes(msg._id),
      }));
  
      setMessages(messagesWithLu);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post('http://localhost:2023/massages', {
        conversation: conversationId,
        contenuM: newMessage,
      }, config); 

      socket.emit("sendMessage"); // Émettre une notification vers le serveur avec les utilisateurs sélectionnés et le contenu
      // Rafraîchir les messages après l'envoi
      //const response = await axios.get(`http://localhost:2023/messages/${conversationId}`, config);
      // setMessages(response.data);
      fetchMessages();
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const chatClass = ['header-chat'];
  if (chatOpen && listOpen) {
    chatClass.push('open');
  }
  

  return (
    <React.Fragment>
      <div className={chatClass.join(' ')}>
        <div className="h-list-header">
          <h6>{user.name}</h6>
          <Link to="#" className="h-back-user-list" onClick={closed}>
            <i className="feather icon-chevron-left text-muted" />
          </Link>
        </div>
        <div className="h-list-body">
        <div className="main-chat-cont">
          <PerfectScrollbar>
            <div className="main-friend-chat">
                {messages.map((msg) => (
                  <Messages
                    key={msg._id}
                    message={msg}
                    createdAt={msg.createdAt} // Utilisation de createdAt pour le temps de création du message
                    lu={msg.lu}
                  />
                ))}
            </div>
          </PerfectScrollbar>
        </div>
        </div>
        <div className="h-list-footer">
          <form onSubmit={handleSendMessage}>
            <InputGroup>
              <Button variant="success" className="btn-attach">
                <i className="feather icon-paperclip" />
              </Button>
              <FormControl
                type="text"
                name="h-chat-text"
                className="h-send-chat"
                placeholder="Write here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button type="submit" className="input-group-append btn-send">
                <i className="feather icon-message-circle" />
              </Button>
            </InputGroup>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

Chat.propTypes = {
  user: PropTypes.object.isRequired,
  chatOpen: PropTypes.bool,
  listOpen: PropTypes.bool,
  closed: PropTypes.func.isRequired,
  conversationId: PropTypes.string.isRequired,
};

export default Chat;
