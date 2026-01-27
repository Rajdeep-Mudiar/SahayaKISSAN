import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./BuyerChatPage.css";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function ChatPage() {
  const { listingId } = useParams();
  const chatBoxRef = useRef(null);

  const [room, setRoom] = useState(null);
  const [listing, setListing] = useState(null); // ✅ Listing with mobile
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  // 🔹 Get logged-in user
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => {});
  }, []);

  // 🔹 Fetch listing data using buyerRoutes /product/:id ✅
  useEffect(() => {
    if (!listingId) return;
    // ✅ Uses YOUR buyerRoutes: GET /buyer/product/:id
    axios
      .get(`http://localhost:5000/api/buy/product/${listingId}`, { withCredentials: true })
      .then((res) => setListing(res.data))
      .catch(() => {});
  }, [listingId]);

  // 🔹 Create or get chat room
  useEffect(() => {
    if (!user) return;

    axios
      .post(
        `http://localhost:5000/api/chat/room/${listingId}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        setRoom(res.data);
        socket.emit("joinRoom", { roomId: res.data._id, userId: user._id });
      });
  }, [user, listingId]);

  // 🔹 Load old messages
  useEffect(() => {
    if (!room) return;

    axios
      .get(`http://localhost:5000/api/chat/messages/${room._id}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data));
  }, [room]);

  // 🔹 Receive realtime messages (prevent duplicates)
  useEffect(() => {
    const handler = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, []);

  // 🔹 Auto-scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // ✅ CALL FUNCTION - Opens phone dialer
  const handleCall = (mobile) => {
    window.open(`tel:${mobile}`, '_self');
  };

  const sendMessage = () => {
    if (!text.trim() || !room || !user) return;

    socket.emit("sendMessage", {
      roomId: room._id,
      senderId: user._id,
      text,
    });

    setText("");
  };

  return (
    <div className="buyer-chat-wrapper">
      <div className="buyer-chat-header">
        <div className="header-content">
          <h1 className="buyer-chat-title">
            {listing?.cropName && (
              <span className="crop-name"><u>{listing.cropName}</u></span>
            )}
          </h1>
          
          <div className="listing-details">
            {listing?.state && (
              <div className="listing-location">
                 {listing.state}, {listing.city}
              </div>
            )}
          </div>

          {/* ✅ CALL BUTTON - Shows if mobile exists */}
          {listing?.mobile ? (
            <button 
              className="call-button" 
              onClick={() => handleCall(listing.mobile)}
              title={`Call ${listing.mobile}`}
            >
              📞 Call Farmer
              <span className="mobile-number">+91 {listing.mobile}</span>
            </button>
          ) : (
            <div className="no-mobile">
              📵 Phone number not provided
              <br />
              <small>Use chat to ask for contact details</small>
            </div>
          )}
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="buyer-chat-messages" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="empty-chat-icon">💬</div>
            <p>Start conversation with the farmer</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`buyer-chat-message ${m.sender?._id === user?._id ? 'message-sent' : 'message-received'}`}
            >
              <div className="message-sender">{m.sender?.name}</div>
              <div className="message-bubble">
                <div className="message-text">{m.text}</div>
                <div className="message-time">
                  {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* INPUT */}
      <div className="buyer-chat-input-wrapper">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="buyer-message-input"
          placeholder="Ask about crop quality, price, delivery..."
          disabled={!room || !user}
        />
        <button
          onClick={sendMessage}
          className="buyer-send-btn"
          disabled={!text.trim() || !room || !user}
        >
          Send
        </button>
      </div>
    </div>
  );
}
