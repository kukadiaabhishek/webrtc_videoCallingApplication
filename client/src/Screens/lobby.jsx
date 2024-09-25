import React, { useState, useCallback, useEffect } from 'react';

import { useSocket } from '../Context/SocketProvider';
import { useNavigate } from 'react-router-dom';
// src/index.js
// import './index.css';  // Or './tailwind.css' if that's what you're using

const Lobby = () => {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');

  const socket = useSocket()
  const navigate = useNavigate()
  // console.log(socket)
  
  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    socket.emit('room:join' , {email , room})
    // console.log(email, room);
  }, [email, room , socket]);

  const handleJoinRoom = useCallback((data)=>{
    const { email , room } = data
    navigate(`/room/${room}`)
    console.log(email , room)
  }, [navigate])

  useEffect(()=>{
    socket.on('room:join', handleJoinRoom)
    return ()=>{
      socket.off('room:join' , handleJoinRoom)
    }
  } , [socket , handleJoinRoom])


  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Join a Room
        </h1>
        <form
          className="w-full max-w-sm bg-white p-8 rounded shadow-md"
          onSubmit={handleSubmitForm}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email ID
            </label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="roomNo" className="block text-gray-700 font-semibold mb-2">
              Room Number
            </label>
            <input 
              type="text" 
              id="roomNo" 
              value={room} 
              onChange={(e) => setRoom(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter the room number"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Join
          </button>
        </form>
      </div>
    </>
  );
};

export default Lobby;
