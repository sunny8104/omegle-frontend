import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signInWithGoogle, logOut } from "./auth";
import Chat from "./Chat";
import { auth } from "./firebase-config";
import VideoCall from "./videocall";
import VoiceCall from "./voicecall";
import io from "socket.io-client";

const socket = io("https://your-backend-url.com");

function App() {
  const [user, setUser] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [roomUrl, setRoomUrl] = useState("");
  const [gender, setGender] = useState("any");
  const [region, setRegion] = useState("any");
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        socket.emit("userConnected", { userId: currentUser.uid, gender, region });
      }
    });
    return () => unsubscribe();
  }, [gender, region]);

  const handleLogin = async () => {
    const userData = await signInWithGoogle();
    if (userData) {
      setUser(userData);
      socket.emit("userConnected", { userId: userData.uid, gender, region });
    }
  };

  const handleLogout = async () => {
    await logOut();
    socket.emit("userDisconnected", { userId: user?.uid });
    setUser(null);
  };

  const startVideoCall = () => {
    socket.emit("requestMatch", { gender, region }, (match) => {
      if (match) {
        setRoomUrl(`https://omegle-clone.daily.co/${match.roomId}`);
        setIsVideoCall(true);
        setIsVoiceCall(false);
      }
    });
  };

  const startVoiceCall = () => {
    setIsVoiceCall(true);
    setIsVideoCall(false);
  };

  const handleBlockUser = (blockedUserId) => {
    setBlockedUsers([...blockedUsers, blockedUserId]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 text-white">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-white shadow-lg mb-6"
      >
        Omegle Clone - Chat, Voice & Video
      </motion.h1>

      {!user ? (
        <motion.button 
          initial={{ scale: 0.9 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 0.2 }}
          onClick={handleLogin} 
          className="bg-blue-500 px-6 py-3 rounded-full text-white text-lg font-semibold shadow-md hover:bg-blue-600 transition duration-300"
        >
          Sign in with Google
        </motion.button>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="mb-6 flex items-center gap-4 bg-white/20 p-4 rounded-lg shadow-lg"
          >
            <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white" />
            <span className="text-lg font-semibold">{user.displayName}</span>
          </motion.div>

          {!isVideoCall && !isVoiceCall ? (
            <>
              <div className="mb-4 flex gap-4">
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="p-2 bg-white text-black rounded">
                  <option value="any">Any Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="p-2 bg-white text-black rounded">
                  <option value="any">Any Region</option>
                  <option value="us">USA</option>
                  <option value="uk">UK</option>
                  <option value="in">India</option>
                </select>
              </div>

              <Chat user={user} onBlockUser={handleBlockUser} blockedUsers={blockedUsers} />
              
              <div className="flex gap-6 mt-6">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={startVideoCall} 
                  className="bg-green-500 px-6 py-3 rounded-full text-white text-lg font-semibold shadow-lg hover:bg-green-600 transition duration-300"
                >
                  Start Video Call
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={startVoiceCall} 
                  className="bg-yellow-500 px-6 py-3 rounded-full text-white text-lg font-semibold shadow-lg hover:bg-yellow-600 transition duration-300"
                >
                  Start Voice Call
                </motion.button>
              </div>
            </>
          ) : isVideoCall ? (
            <VideoCall roomUrl={roomUrl} onLeave={() => setIsVideoCall(false)} />
          ) : (
            <VoiceCall onLeave={() => setIsVoiceCall(false)} />
          )}

          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={handleLogout} 
            className="mt-6 bg-red-500 px-6 py-3 rounded-full text-white text-lg font-semibold shadow-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </motion.button>
        </>
      )}
    </div>
  );
}

export default App;
