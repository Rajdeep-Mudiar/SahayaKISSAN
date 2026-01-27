import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SellerChats() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/chat/rooms", { withCredentials: true })
      .then((res) => setRooms(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Chats</h2>

      {rooms.length === 0 && <p>No conversations yet.</p>}

      <div style={{ marginTop: 20 }}>
        {rooms.map((room) => {
          // find the other person (not seller)
          const otherUser = room.participants.find(
            (p) => p._id !== room.listing.user
          );

          return (
            <div
              key={room._id}
              onClick={() => navigate(`/seller/chat/${room._id}`)}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: 6,
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={otherUser?.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%", marginRight: 10 }}
                />
                <div>
                  <b>{otherUser?.name}</b>
                  <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
                    {room.lastMessage || "Start conversation"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
