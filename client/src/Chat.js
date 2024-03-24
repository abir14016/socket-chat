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
import Modal from './components/Modal';
import { toast } from 'react-toastify';
import notificationSound from './assets/audios/notification.mp3';
import chatSound from './assets/audios/chat.mp3';
import bubbleSound from './assets/audios/bubble.wav';

library.add(fab, faPaperPlane)

const Chat = ({ socket, userName, room }) => {
    const { isLoading, data: users } = useQuery('users', () =>
        fetch(`http://localhost:3001/room/${room}/users`).then(res =>
            res.json()
        )
    )

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [typingUsers, setTypingUsers] = useState([]);


    const handleFocus = () => {
        socket.emit("start_typing", { userName, room });
    };

    const handleBlur = () => {
        socket.emit("stop_typing", { userName, room });
    };


    useEffect(() => {
        const handleStartTyping = (data) => {
            const isUserTyping = typingUsers.some(user => user.userName === data.userName && user.room === data.room);
            if (!isUserTyping) {
                setTypingUsers((list) => [...list, data]);
            }
        };

        socket.on("display_start_typing", handleStartTyping);

        return () => {
            socket.off("display_start_typing", handleStartTyping);
        };
    }, [socket, typingUsers]);

    useEffect(() => {
        const handleStopTyping = (data) => {
            const currentTypingUsers = typingUsers.filter(user => !(user.userName === data.userName && user.room === data.room));
            setTypingUsers(currentTypingUsers);
        };

        socket.on("display_stop_typing", handleStopTyping);

        return () => {
            socket.off("display_stop_typing", handleStopTyping);
        };
    }, [socket, typingUsers]);


    useEffect(() => {
        socket.on("user_join_message", (data) => {
            setMessageList((list) => [...list, data]);
            // Show a toast when a new user joins
            toast(`${data.message}`, {
                type: "info",
            });

            const audio = new Audio(notificationSound);
            audio.play();
        });
    }, [socket]);



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
            const audio = new Audio(bubbleSound);
            audio.play();
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            //listening event that emitted from backend
            setMessageList((list) => [...list, data]);
            const audio = new Audio(chatSound);
            audio.play();
        })
    }, [socket]);


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
            handleBlur();
        } else {
            handleFocus();
        }
    }

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
                                <div className="overflow-auto avatar-group -space-x-3 rtl:space-x-reverse">
                                    {
                                        users.slice(0, 3).map((user) => <Avatar
                                            key={user.userId}
                                            user={user}
                                            isLoading={isLoading}
                                        >
                                        </Avatar>)
                                    }

                                    {/* avatar placeholder component */}
                                    <Placeholder users={users} length={users.length - 3}></Placeholder>
                                </div>
                            ) : (
                                <div className="avatar-group -space-x-3 rtl:space-x-reverse">
                                    {
                                        users.map((user) => <Avatar
                                            key={user.userId}
                                            user={user}
                                            isLoading={isLoading}
                                        >
                                        </Avatar>)
                                    }
                                </div>
                            )
                        }
                        <div
                            onClick={() => document.getElementById('all_Users_modal').showModal()}
                            className="badge badge-secondary hover:badge-neutral cursor-pointer w-20">room: {room}
                        </div>
                    </div>
                </div>
                <ScrollToBottom className="flex-1 overflow-y-auto">
                    {messageList.map((messageContent, index) => {
                        const isSystemMessage = messageContent.author === "system";
                        const isCurrentUser = messageContent.author === userName;
                        const chatClass = isCurrentUser ? "chat chat-end" : "chat chat-start";
                        const bubbleClass = isCurrentUser ? "chat-bubble bg-blue-600 max-w-44 overflow-hidden break-all" : "chat-bubble bg-gray-300 max-w-44 text-black overflow-hidden break-all";

                        return (
                            <div>
                                {
                                    !isSystemMessage ? (
                                        <div className={chatClass} key={index}>
                                            <div className={bubbleClass}>{messageContent.message}</div>
                                            <div className="chat-footer font-bold opacity-50">
                                                {messageContent.author}
                                                <time className="text-xs opacity-50 ml-1">{messageContent.time}</time>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={index}>
                                            <div className='flex justify-center items-center'>
                                                <p className='text-sm text-gray-500'>{messageContent.message}</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <p className='text-xs text-center text-gray-700 font semibond'>{messageContent.time}</p>
                                        </div>
                                    )
                                }
                            </div>
                        );
                    })}
                </ScrollToBottom>
                {
                    typingUsers.length > 0 && (
                        <div>
                            {
                                typingUsers.map((user) => <p>{user.userName} is typing...</p>)
                            }
                        </div>
                    )
                }
                <div>
                    <label className="input input-bordered border-t-2 flex justify-between items-center rounded-t-none">
                        <input
                            onChange={(event) => { setCurrentMessage(event.target.value) }}
                            type="text"
                            value={currentMessage}
                            className="text-black"
                            placeholder="Type Here..."
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={sendMessage} className="btn btn-square -mr-4 rounded-t-none rounded-bl-none">
                            <FontAwesomeIcon className='text-secondary rotate-45' icon={faPaperPlane} />
                        </button>
                    </label>
                </div>
            </div>
            <Modal users={users} room={room}></Modal>
        </div>

    );
};

export default Chat;