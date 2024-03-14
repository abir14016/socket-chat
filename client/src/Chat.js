import React from 'react';
import { useState } from 'react';

const Chat = ({ socket, userName, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            await socket.emit("send_message", messageData);
        }
    }
    return (
        <div className="card w-96 bg-primary text-primary-content">
            <div className="card-body">
                <h2 className="card-title">Live Chat</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div className="card-actions justify-center">
                    <label className="input input-bordered flex justify-between items-center gap-2">
                        <input
                            onChange={(event) => { setCurrentMessage(event.target.value) }}
                            type="text"
                            className="grow text-black"
                            placeholder="Type Here..." />
                        <button
                            onClick={sendMessage}
                            className="btn">&#9658;</button>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Chat;