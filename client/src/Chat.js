import React, { useEffect, useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useQuery } from 'react-query';
import Avatar from './components/Avatar';
import Spinner from './components/Spinner';
import Placeholder from './components/Placeholder';

library.add(fab, faPaperPlane)

const Chat = ({ socket, userName, room }) => {
    const { isLoading, data: users } = useQuery('users', () =>
        fetch(`http://localhost:3001/room/${room}/users`).then(res =>
            res.json()
        )
    )

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
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            //listening event that emitted from backend
            setMessageList((list) => [...list, data]);
        })
    }, [socket]);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <Spinner />
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className='border-2 w-full md:w-1/2 lg:w-1/5 h-full md:h-2/3 lg:h-2/3 flex flex-col rounded-xl'>
                <div className='bg-neutral p-3 rounded-t-xl rounded-b-none relative'>
                    <h2 className='text-white font-bold text-2xl'>Live Chat</h2>
                    <div className='border-2 bg-gray-400 rounded-xl flex justify-between items-center px-2'>
                        {
                            users.length > 3 ? (
                                <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                                    {
                                        users.slice(0, 3).map((user) => <Avatar
                                            key={user.userId}
                                            user={user}
                                            isLoading={isLoading}
                                        // refetch={refetch}
                                        // users={users}
                                        >
                                        </Avatar>)
                                    }

                                    {/* avatar placeholder component */}
                                    <Placeholder length={users.length - 3}></Placeholder>
                                </div>
                            ) : (
                                <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                                    {
                                        users.map((user) => <Avatar
                                            key={user.userId}
                                            user={user}
                                            isLoading={isLoading}
                                        // refetch={refetch}
                                        // users={users}
                                        >
                                        </Avatar>)
                                    }
                                </div>
                            )
                        }
                        <div className="badge badge-warning">room: {room}</div>
                    </div>
                </div>
                <ScrollToBottom className="flex-1 overflow-y-auto">
                    {messageList.map((messageContent, index) => {
                        const isCurrentUser = messageContent.author === userName;
                        const chatClass = isCurrentUser ? "chat chat-end" : "chat chat-start";
                        const bubbleClass = isCurrentUser ? "chat-bubble bg-blue-600 max-w-44 overflow-hidden break-all" : "chat-bubble bg-gray-300 max-w-44 text-black overflow-hidden break-all";

                        return (
                            <div className={chatClass} key={index}>
                                <div className={bubbleClass}>{messageContent.message}</div>
                                <div className="chat-footer font-bold opacity-50">
                                    {messageContent.author}
                                    <time className="text-xs opacity-50 ml-1">{messageContent.time}</time>
                                </div>
                            </div>
                        );
                    })}
                </ScrollToBottom>
                <div>
                    <label className="input input-bordered border-t-2 flex justify-between items-center rounded-t-none">
                        <input
                            onChange={(event) => { setCurrentMessage(event.target.value) }}
                            type="text"
                            value={currentMessage}
                            className="text-black"
                            placeholder="Type Here..."
                            onKeyDown={(event) => {
                                event.key === "Enter" && sendMessage();
                            }}
                        />
                        <button onClick={sendMessage} className="btn btn-square -mr-4 rounded-t-none rounded-bl-none">
                            <FontAwesomeIcon className='text-secondary' icon={faPaperPlane} />
                        </button>
                    </label>
                </div>
            </div>
        </div>

    );
};

export default Chat;