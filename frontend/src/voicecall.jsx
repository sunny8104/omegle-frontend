import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const BACKEND_URL = "https://omegle-backend-e1ud.onrender.com";
const socket = io(BACKEND_URL);
 // Change to your server URL

const VoiceCall = () => {
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    });

    peer.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", event.candidate);
      }
    };

    setPeerConnection(peer);

    return () => {
      peer.close();
    };
  }, []);

  socket.on("offer", async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer", answer);
  });

  socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on("candidate", async (candidate) => {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });

  const startCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  return (
    <div>
      <h2>Real-Time Voice Call</h2>
      <button onClick={startCall}>Start Voice Call</button>
      <audio ref={localAudioRef} autoPlay muted></audio>
      <audio ref={remoteAudioRef} autoPlay></audio>
    </div>
  );
};

export default VoiceCall;
