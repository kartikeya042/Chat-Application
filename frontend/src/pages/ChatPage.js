import React, { useEffect, useState } from "react";
import axios from 'axios';

const ChatPage = () => {
    const [chats, setChats] = useState([])

    useEffect(() => {
        axios.get('/api/chats')
            .then(response => {
                setChats(response.data)
            })
            .catch((error) => {
                console.error(`Could not fetch data from the backend: ${error}`);
            })
    }, []);


    return (
        <div>
            {chats.length === 0 ? (<p>No chats yet.</p>)
                :
                (chats.map((chat) => (
                    <div key={chat._id}>
                        <strong>{chat.chatName ?? 'unknown'}</strong>
                    </div>
                ))
                )}
        </div>
    );

}

export default ChatPage;