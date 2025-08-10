import { useEffect, useState } from "react";
import { WEBSOCKET_URL } from "../config";

const useSocket = () => {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYmNhZDBkMC1lODdiLTQ2NTMtYjgxNS1hMWM1MDY4NWI3YTgiLCJpYXQiOjE3NTQ4MzQ4MDF9.BsUaQGMEppszcgrtNlfGUx_MLG0AcNXcMp6ROGoKU98`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, [socket, loading]);

  return {
    socket,
    loading,
  };
};

export default useSocket;
