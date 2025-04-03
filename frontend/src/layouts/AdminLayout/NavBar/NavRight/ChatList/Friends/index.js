import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Friend from './Friend';
import Chat from './Chat';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:2023"; // Remplacez par l'URL de votre serveur
var socket;

const Friends = ({ listOpen }) => {
  const [chatOpen, setChatOpen] = useState(listOpen);
  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  // const [neew,setNeew] = useState()
  useEffect(() => {
    setChatOpen(false);
  }, [listOpen]);

  useEffect(() => {
    socket = io(ENDPOINT);
    const fetchFriends = async () => {
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
        const response = await axios.get('http://localhost:2023/usersChat', config); // Assurez-vous que l'URL correspond à votre endpoint API
        setFriends(response.data);
        // const responseNew = await axios.get('http://localhost:2023/unread-messages', config);
        // setNeew(responseNew.data.unreadMessagesCount)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchFriends();

    socket.on("newMessage", () => {
      fetchFriends();
    });

  }, [listOpen]);

  const accessChat = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://localhost:2023/chat', { user_Id: friendId }, config);
      setConversationId(response.data._id);
    } catch (error) {
      console.error('Error accessing chat:', error);
    }
  };

  const handleClickFriend = async (friend) => {
    setChatOpen(true);
    setUser(friend);
    await accessChat(friend._id);
  };

  const friendList = friends.map((f) => (
    <Friend
      key={f._id}
      data={f}
      activeId={user._id}
      clicked={() => handleClickFriend(f)}
      // unreadMessagesCount={f.neew}
    />
  ));

  return (
    <React.Fragment>
      {friendList}
      <Chat
        user={user}
        chatOpen={chatOpen}
        listOpen={listOpen}
        conversationId={conversationId}
        closed={() => {
          setChatOpen(false);
          setUser({});
          setConversationId(null);
        }}
      />
    </React.Fragment>
  );
};

Friends.propTypes = {
  listOpen: PropTypes.bool
};

export default Friends;
