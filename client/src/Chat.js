import React, { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(fab, faPaperPlane)

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
            <div className='border-2 w-1/4 h-2/3 flex flex-col rounded-xl'>
                <div className='bg-neutral p-3 rounded-t-xl rounded-b-none'>
                    <h2 className='text-white font-bold text-2xl'>Live Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {
                        messageList.map((messageContent, index) => {
                            return <div className="chat chat-start">
                                <div className="chat-bubble chat-bubble-primary">{messageContent.message}</div>
                            </div>
                        })
                    }
                </div>
                <div>
                    <label className="input input-bordered border-t-2 flex justify-between items-center rounded-t-none">
                        <input
                            onChange={(event) => { setCurrentMessage(event.target.value) }}
                            type="text"
                            className="text-black"
                            placeholder="Type Here..." />
                        <button onClick={sendMessage} className="btn btn-square -mr-4 rounded-t-none rounded-bl-none">
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </label>
                </div>
            </div>
        </div>

    );
};

export default Chat;