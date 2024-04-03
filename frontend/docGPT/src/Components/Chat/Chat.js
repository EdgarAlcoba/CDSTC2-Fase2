import React from 'react'
import './Chat.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../3D_Avatar/Avatar';

const Chat = () => {
  const userID = useParams().userID;
  const [refreshConversations, setRefreshConversations] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [blockNew, setBlockNew] = useState(false);

  useEffect(() => {
    getConversations();
  }, [refreshConversations]);

  useEffect(() => {
    if (selectedButton !== null) {
      getMessages();
    }
  }, [selectedButton]);

  function getConversations() {
    axios
      .get(`http://localhost:5000/api/chat/${userID}`, {})
      .then(function (response) {
        setConversations(response.data);
      })
      .catch(function (error) {
        alert(error.response.data);
      });
  }

  function getMessages() {
    console.log(`http://localhost:5000/api/chat/${userID}/${conversations[selectedButton]._id}`);
    axios
      .get(`http://localhost:5000/api/chat/${userID}/${conversations[selectedButton]._id}`, {})
      .then(function (response) {
        setMessages(response.data);
      })
      .catch(function (error) {
        alert(error.response.data);
      });
  };

  const createConversation = (name) => {
    setBlockNew(true);
    axios
      .post(`http://localhost:5000/api/chat/${userID}`, { conversationName: name })
      .then(function (response) {
        setRefreshConversations(!refreshConversations);
      })
      .catch(function (error) {
        alert(error.response.data);
      });
    setTimeout(() => {
      setBlockNew(false);
    }, 300);

  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .put(`http://localhost:5000/api/chat/${userID}/${conversations[selectedButton]._id}`, {
        type: "User",
        message: data.get("messageBox")
      })
      .then(function (response) {
        getMessages();
      })
      .catch(function (error) {
        alert(error.response.data);
      });

  };

  return (
    <div className='chat'>
      <div className='conversation-container'>
        <div className='new-conversation'>
          <button disabled={blockNew} onClick={() => createConversation("Conversation " + (conversations.length + 1))}>
            New chat
          </button>
        </div>
        <div className='conversation-container-overflow'>
          {conversations.map((item, index) => (
            <button key={index} className={selectedButton === index ? 'button-selected' : ''} onClick={() => setSelectedButton(index)}>
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <div className='chat-container'>
        <div className='docChat-container'>
          <div className='Avatar'>

          </div>
          <div className='messages-box'>
            {messages == 0 ? <></> : messages.map((item, index) => (
              <div key={index}>
                <p>
                  {item.type}: {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>
        <form className='chat-box' onSubmit={handleSubmit}>
          <input type='text' name="messageBox" placeholder='Message...' required></input>
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Chat