import './App.css';
import io from "socket.io-client";
import { useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (userName === "") {

    }
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  }

  return (
    <div className="App">
      <div className="flex justify-center items-center h-screen">
        <div className="card w-96 bg-neutral text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Join a chat!</h2>

            {/* input */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-white">Enter Your Name</span>
              </div>
              <input onChange={(event) => setUserName(event.target.value)} type="text" placeholder="Type here..." className="text-black input input-bordered w-full max-w-xs" />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-white">Enter Room ID</span>
              </div>
              <input onChange={(event) => setRoom(event.target.value)} type="text" placeholder="Type here..." className="text-black input input-bordered w-full max-w-xs" />
            </label>
            {/* input */}

            <div className="card-actions justify-end">
              <button onClick={joinRoom} className="btn btn-outline btn-secondary">Join a room</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
