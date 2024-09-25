import {Routes , Route} from "react-router-dom"
import Lobby from "./Screens/lobby.jsx"
import Room from "./Screens/room.jsx"

export default function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Lobby/>} />
      <Route path="/room/:roomId" element={<Room/>}/>
    </Routes>
    </div>
  )
} 