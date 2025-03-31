import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Omegle Clone</h1>
      <Link to="/video-call">Video Call</Link>
      <Link to="/voice-call">Voice Call</Link>
      <Link to="/text-chat">Text Chat</Link>
    </div>
  );
};

export default Home;
