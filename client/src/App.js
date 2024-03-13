import './App.css';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  return (
    <div className="App">
      <h2 className='text-2xl text-red-600'>Socket Chat Application</h2>
      <button className="btn">Button</button>
    </div>
  );
}

export default App;
