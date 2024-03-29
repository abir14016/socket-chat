import './App.css';
import io from "socket.io-client";
import { useForm } from "react-hook-form";
import { useState } from "react"; // Import useState
import Chat from './Chat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io.connect("http://localhost:3001");

function App() {
  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const [userName, setUserName] = useState(""); // State for userName
  const [room, setRoom] = useState(""); // State for room
  const [showChat, setShowChat] = useState(false);



  const onSubmit = (data) => {
    socket.emit("join_room", data);
    setUserName(data.userName); // Set userName state
    setRoom(data.room); // Set room state
    reset();
    setShowChat(true);
  }


  return (
    <div className="App">
      {!showChat ?
        (<div className="flex justify-center items-center h-screen">
          <div className="card w-96 bg-neutral text-primary-content">
            <div className="card-body">
              <h2 className="card-title">Join a chat!</h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* userName field */}
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text text-white">Enter Your Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name..."
                    className="text-black input input-bordered w-full max-w-xs"
                    {...register("userName", {
                      required: {
                        value: true,
                        message: 'you must provide your name'
                      }
                    })}
                  />
                  <label className="label">
                    {errors.userName?.type === 'required' && <span className="label-text-alt text-error">{errors.userName.message}</span>}
                  </label>
                </div>
                {/* userName field */}

                {/* room field */}
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text text-white">Enter Room ID</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Room ID..."
                    className="text-black input input-bordered w-full max-w-xs"
                    {...register("room", {
                      required: {
                        value: true,
                        message: 'you must provide a room'
                      }
                    })}
                  />
                  <label className="label">
                    {errors.room?.type === 'required' && <span className="label-text-alt text-error">{errors.room.message}</span>}
                  </label>
                </div>
                {/* room field */}

                {/* gender field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-white">Select your gender</span>
                  </label>
                  <div className="flex justify-start items-center">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text text-white">Male</span>
                        <input
                          type="radio"
                          name="gender"
                          className="radio radio-secondary"
                          value="Male"
                          defaultChecked
                          {...register("gender", {
                            required: {
                              value: true,
                              message: "You must select a gender"
                            }
                          })}
                        />
                      </label>
                    </div>
                    <div className="form-control ml-2">
                      <label className="label cursor-pointer">
                        <span className="label-text text-white">Female</span>
                        <input
                          type="radio"
                          name="gender"
                          className="radio radio-secondary"
                          value="Female"
                          {...register("gender", {
                            required: {
                              value: true,
                              message: "You must select a gender"
                            }
                          })}
                        />
                      </label>
                    </div>
                  </div>
                  {/* Display error message if gender field is not filled */}
                  <label className="label">
                    {errors.gender?.type === 'required' && <span className="label-text-alt text-error">{errors.gender.message}</span>}
                  </label>
                </div>
                {/* gender field */}


                <div className="card-actions justify-end">
                  <input className="btn btn-outline btn-secondary" type="submit" value="Join a room" />
                </div>
              </form>

            </div>
          </div>
        </div>)
        :
        (<Chat socket={socket} userName={userName} room={room} />)
      }
      <ToastContainer />
    </div>
  );
}

export default App;
