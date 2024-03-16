import React, { useEffect } from 'react';
import { useState } from 'react';

const Chat = ({ socket, userName, room }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            //message sent to the backend
            await socket.emit("send_message", messageData);
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            //listening event that emitted from backend
            setMessageList((list) => [...list, data]);
        })
    }, [socket])

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-primary text-primary-content">
                <div className="card-body">
                    <h2 className="card-title">Live Chat</h2>
                    {
                        messageList.map((messageContent) => {
                            return <p>{messageContent.message}</p>
                        })
                    }
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
        </div>
    );
};

export default Chat;