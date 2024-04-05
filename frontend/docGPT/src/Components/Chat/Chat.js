import React from 'react'
import './Chat.css'
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../3D_Avatar/Experience";
import { Leva } from "leva";
import { useChat } from './useChat';

const Chat = () => {
  const userID = useParams().userID;
  const [refreshConversations, setRefreshConversations] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [blockNew, setBlockNew] = useState(false);
  const { chat, loading } = useChat();

  const getConversations = useCallback(() => {
    axios
      .get(`http://localhost:5000/api/chat/${userID}`, {})
      .then(function (response) {
        setConversations(response.data);
      })
      .catch(function (error) {
        alert(error.response.data);
      });
  }, [userID]);

  const getMessages = useCallback(() => {
    if (selectedButton !== null && conversations[selectedButton]) {
      axios
        .get(`http://localhost:5000/api/chat/${userID}/${conversations[selectedButton]._id}`, {})
        .then(function (response) {
          setMessages(response.data);
        })
        .catch(function (error) {
          alert(error.response.data);
        });
    }
  }, [userID, selectedButton, conversations]);

  useEffect(() => {
    getConversations();
  }, [getConversations, refreshConversations]);

  useEffect(() => {
    if (selectedButton !== null && conversations[selectedButton]) {
      getMessages();
    }
  }, [selectedButton, conversations, getMessages]);

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
    const packetMessage = data.get("messageBox");
    axios
      .put(`http://localhost:5000/api/chat/${userID}/${conversations[selectedButton]._id}`, {
        type: "User",
        message: packetMessage
      })
      .then(async function (response) {
        getMessages();
        await chat({
          message:packetMessage,
          userID:userID,
          conversationID:conversations[selectedButton]._id
        });
        getMessages();
        /*axios
          .put(`http://localhost:5000/api/chat/${userID}/${conversations[selectedButton]._id}/messageAI`, {
            message: packetMessage
          })
          .then(function (response) {
            getMessages();
          })
          .catch(function (error) {
            alert(error.response.data);
          });*/
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
            <Loader />
            <Leva />
            <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
              <Experience />
            </Canvas>
          </div>
          <div className='messages-box'>
            {messages === 0 ? <></> : messages.map((item, index) => (
              <div key={index}>
                <p>
                  {item.type}: {item.message}
                </p>
              </div>
            ))}
          </div>
        </div>
        {selectedButton?<form className='chat-box' onSubmit={handleSubmit}>
          <input type='text' name="messageBox" placeholder='Message...' required></input>
          <button type='submit' disabled={loading}>Send</button>
        </form>:<></>}
      </div>
    </div>
  )
}

export default Chat