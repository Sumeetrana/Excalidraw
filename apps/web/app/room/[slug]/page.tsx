import axios from "axios";
import { BACKEND_URL } from "../../config";
import ChatRoom from "../../components/ChatRoom";

async function getRoomId(slug: string) {
  const response = await axios.post(
    `${BACKEND_URL}/room`,
    {
      name: slug,
    },
    {
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYmNhZDBkMC1lODdiLTQ2NTMtYjgxNS1hMWM1MDY4NWI3YTgiLCJpYXQiOjE3NTQ4MzQ4MDF9.BsUaQGMEppszcgrtNlfGUx_MLG0AcNXcMp6ROGoKU98",
      },
    }
  );
  return response.data.roomId;
}

export default async function Room({ params }: { params: { slug: string } }) {
  const slug = (await params).slug;
  const roomId = await getRoomId(slug);

  console.log("RoomID:", roomId);

  return <ChatRoom roomId={roomId} />;
}
