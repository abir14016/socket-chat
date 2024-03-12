import './App.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");
console.log(socket)

function App() {
  return (
    <div className="App">
      <h2>Socket Chat Application</h2>
    </div>
  );
}

export default App;
