import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";

const VideoCall = ({ onLeave, socket }) => {
  const videoCallRef = useRef(null);
  const [callFrame, setCallFrame] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    const startVideoCall = async (roomUrl) => {
      try {
        const newCallFrame = DailyIframe.createFrame(videoCallRef.current, {
          url: roomUrl,
          iframeStyle: { width: "100%", height: "100%", border: "0" },
          showLeaveButton: true,
        });

        newCallFrame.on("left-meeting", () => {
          onLeave();
        });

        await newCallFrame.join();
        setCallFrame(newCallFrame);
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    };

    // Matchmaking event integration
    if (socket) {
      socket.emit("requestMatch");

      socket.on("matchFound", ({ roomUrl }) => {
        startVideoCall(roomUrl);
      });
    }

    return () => {
      if (callFrame) {
        callFrame.destroy();
        setCallFrame(null);
      }
      if (socket) {
        socket.off("matchFound");
      }
    };
  }, [callFrame, onLeave, socket]);

  const toggleMic = () => {
    if (callFrame) {
      callFrame.setLocalAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCam = () => {
    if (callFrame) {
      callFrame.setLocalVideo(!isCamOn);
      setIsCamOn(!isCamOn);
    }
  };

  return (
    <div className="video-container relative">
      <div ref={videoCallRef} className="w-full h-full"></div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button onClick={toggleMic} className="bg-gray-700 px-4 py-2 text-white rounded">
          {isMicOn ? "Mute" : "Unmute"}
        </button>
        <button onClick={toggleCam} className="bg-gray-700 px-4 py-2 text-white rounded">
          {isCamOn ? "Turn Off Camera" : "Turn On Camera"}
        </button>
        <button onClick={onLeave} className="bg-red-600 px-4 py-2 text-white rounded">
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
