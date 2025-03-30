import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = "https://omegle-backend-e1ud.onrender.com";
const socket = io(BACKEND_URL);

function Chat({ user, onBlockUser, blockedUsers }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [room, setRoom] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("publicMessage", (data) => {
      if (!blockedUsers.includes(data.userId)) {
        setMessages((prev) => [...prev, data]);
      }
    });

    socket.on("privateMessage", (data) => {
      if (!blockedUsers.includes(data.userId)) {
        setRoomMessages((prev) => [...prev, data]);
      }
    });

    socket.on("typing", ({ userId, isTyping }) => {
      if (userId !== user.uid) {
        setTyping(isTyping);
      }
    });

    socket.on("updateUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("matchFound", ({ roomId }) => {
      setRoom(roomId);
      setIsPrivate(true);
    });

    return () => {
      socket.off("publicMessage");
      socket.off("privateMessage");
      socket.off("typing");
      socket.off("updateUsers");
      socket.off("matchFound");
    };
  }, [blockedUsers, user.uid]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const msgData = {
      userId: user.uid,
      user: user.displayName,
      text: message,
      avatar: user.photoURL,
    };

    if (isPrivate && room) {
      socket.emit("privateMessage", { room, message: msgData });
      setRoomMessages((prev) => [...prev, msgData]);
    } else {
      socket.emit("publicMessage", msgData);
      setMessages((prev) => [...prev, msgData]);
    }

    setMessage("");
    socket.emit("typing", { userId: user.uid, isTyping: false });
  };

  const requestMatch = () => {
    socket.emit("requestMatch", { userId: user.uid });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { userId: user.uid, isTyping: e.target.value.length > 0 });
  };

  return (
    <div className="p-4 w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsPrivate(false)}
          className={`px-4 py-2 rounded ${!isPrivate ? "bg-blue-500" : "bg-gray-600"}`}
        >
          Public Chat
        </button>
        <button
          onClick={requestMatch}
          className="px-4 py-2 rounded bg-green-500"
        >
          Find Match
        </button>
      </div>

      <div className="h-64 overflow-y-auto border border-gray-600 p-2 rounded">
        {typing && <p className="text-gray-400 italic">Someone is typing...</p>}
        {(isPrivate ? roomMessages : messages).map((msg, index) => (
          <div key={index} className="flex items-center gap-2 p-2">
            <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            <p>
              <strong>{msg.user}:</strong> {msg.text}
            </p>
            <button onClick={() => onBlockUser(msg.userId)} className="text-red-500 text-xs">
              Block
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          className="px-3 py-2 rounded text-black w-full"
        />
        <button onClick={sendMessage} className="bg-blue-500 px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
