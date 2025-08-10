"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <div>
      <h1>Welcome to the Chat Room</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button
        onClick={async () => {
          router.push(`/room/${roomName}`);
        }}
      >
        {loading ? "Creating room..." : "Join Room"}
      </button>
      {roomName && <p>Current Room name: {roomName}</p>}
      {/* Additional components or features can be added here */}
    </div>
  );
}
