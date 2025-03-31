import { useEffect, useRef, useState } from "react";
import DailyIframe from "@daily-co/daily-js";

const VideoCall = ({ onLeave, socket }) => {
  const videoCallRef = useRef(null);
  const callFrame = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    const startVideoCall = async (roomUrl) => {
      try {
        callFrame.current = DailyIframe.createFrame(videoCallRef.current, {
          url: roomUrl,
          iframeStyle: { width: "100%", height: "100%", border: "0" },
          showLeaveButton: true,
        });

        callFrame.current.on("left-meeting", () => {
          onLeave();
        });

        await callFrame.current.join();
      } catch (error) {
        console.error("Error starting video call:", error);
      }
    };

    if (socket) {
      socket.emit("requestMatch");

      const handleMatchFound = ({ roomUrl }) => {
        startVideoCall(roomUrl);
      };

      socket.on("matchFound", handleMatchFound);

      return () => {
        socket.off("matchFound", handleMatchFound);
      };
    }
  }, [onLeave, socket]);

  const toggleMic = () => {
    if (callFrame.current) {
      const newMicState = !isMicOn;
      callFrame.current.setLocalAudio(newMicState);
      setIsMicOn(newMicState);
    }
  };

  const toggleCam = () => {
    if (callFrame.current) {
      const newCamState = !isCamOn;
      callFrame.current.setLocalVideo(newCamState);
      setIsCamOn(newCamState);
    }
  };

  useEffect(() => {
    return () => {
      if (callFrame.current) {
        callFrame.current.destroy();
        callFrame.current = null;
      }
    };
  }, []);

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
