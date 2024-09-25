import React, { useCallback, useState } from 'react'
import ReactPlayer from "react-player"
import { useSocket } from '../Context/SocketProvider'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import peer from '../services/peer';

const room = () => {
    const socket = useSocket();
    const navigate = useNavigate();

    const [remoteSocketId , setRemoteSocketId] = useState(null)
    const [myStream , setMyStream] = useState(null)
    const [remoteStream , setRemoteStream] = useState(null)
console.log(remoteSocketId , "remoteSocketId")
    const handleUserJoin = useCallback(({email , id})=>{    
        console.log("joined this room" , email , id)
        setRemoteSocketId(id)
    } ,[])

    const handleCallUser = useCallback(async () => {
        console.log("zero")
        try {
            console.log("one")
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        console.log(stream, "two");
            const offer = await peer.getOffers()
            socket.email('user:call' , { to : remoteSocketId , offer })
            setMyStream(stream);
        } catch (error) {
            console.error("Error accessing media devices.", error);
            // You can handle the error or notify the user here
        }
    }, []);

    const handleIncomingCall = useCallback(async({from , offer})=>{
        setRemoteSocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setMyStream(stream)
        const ans = await peer.getAnswer(offer)
        socket.emit('call:accepted' , {to : from , ans})
        console.log("incomming call" , from , offer)

    } ,[]);


    const sendStreams = useCallback(()=>{
        for(const track of myStream.getTracks()){
            peer.peer.addTrack(track , myStream)

        }
    }, [myStream] )

    const handleCallAccepted = useCallback(({from , ans})=>{
        peer.setLocalDescription(ans)
        console.log('call Accepted')
        sendStreams()
        // for(const track of myStream.getTracks()){
        //     peer.peer.addTrack(track , myStream)

        // }
    } , [sendStreams])

    const handleNegoNeeded = useCallback(async ()=>{
        const offer = await peer.getOffers()
        socket.emit('peer:nego:needed' , {offer , to : remoteSocketId})
    } ,[])

    const handleNegoNeededIncoming = useCallback(async ({from , offer})=>{
        const ans = await peer.getAnswer(offer)
        socket.emit('peer:nego:done' , {to : from , ans})
    } , [socket])

    const handleNegoNeedFinal = useCallback(async({ans})=>{
         await peer.setLocalDescription(ans)
    } ,[])

 

    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded' ,handleNegoNeeded)
        return ()=>{
            peer.peer.removeEventListener('negotiationneeded' ,handleNegoNeeded) 
        }
    } , [handleNegoNeeded])

    useEffect(()=>{
        peer.peer.addEventListener('track' , async ev =>{
            const remoteStream = ev.streams
            setRemoteStream(remoteStream[0])
        })
    } , [])


    useEffect(()=>{
        socket.on('user:joined' ,handleUserJoin )
        socket.on('incoming:call' , handleIncomingCall)
        socket.on('call:accepted' ,handleCallAccepted)
        socket.on('peer:nego:needed' ,handleNegoNeededIncoming)
        socket.on('peer:nego:final' ,handleNegoNeedFinal)
        return () => {
            socket.off('user:joined' , handleUserJoin)
            socket.off('incoming:call' , handleIncomingCall)
            socket.off('call:accepted' , handleCallAccepted)
            socket.off('peer:nego:needed' ,handleNegoNeededIncoming)
            socket.off('peer:nego:final' ,handleNegoNeedFinal)
        }
    } , [socket , handleUserJoin , handleIncomingCall , handleCallAccepted , handleNegoNeededIncoming , handleNegoNeedFinal])
  return (
<>
<div>room</div>
    <h4>{remoteSocketId ? "connected" : "no one i room"}</h4>
    {myStream && <button onClick={sendStreams}>Send Stream</button>}
    {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
    {
        myStream && (
            <>
            <h1>My Stream</h1>
            <ReactPlayer playing muted height="200px" width="300px" url={myStream}/>
            </>
        )
    }
    {
        remoteStream && (
            <>
            <h1>Remote Stream</h1>
            <ReactPlayer playing muted height="200px" width="300px" url={remoteStream}/>
            </>
        )
    }
</>
  )
}

export default room