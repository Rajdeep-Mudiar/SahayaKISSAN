import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./ChatPage.css";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function ChatPage() {
  const { roomId } = useParams();
  const chatBoxRef = useRef(null);
  const typingTimeout = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [listing, setListing] = useState(null); // ✅ Product details

  // 🔹 Get logged in user
  useEffect(() => {
    axios.get("http://localhost:5000/auth/me", { withCredentials: true })
      .then(res => setUser(res.data.user));
  }, []);

  // 🔹 Fetch chat room → Get listing (FIXED for your schema)
  useEffect(() => {
    if (!roomId) return;
    
    // ✅ Get chat room first (has your 'listing' field)
    axios.get(`http://localhost:5000/api/chat/room-by-id/${roomId}`, {
      withCredentials: true
    })
    .then(res => {
      setListing(res.data.listing);  // already full object
    });

  }, [roomId]);

  // 🔹 Join room + load history
  useEffect(() => {
    if (!roomId || !user) return;

    socket.emit("joinRoom", { roomId, userId: user._id });

    axios.get(`http://localhost:5000/api/chat/messages/${roomId}`, {
      withCredentials: true
    }).then(res => setMessages(res.data));

  }, [roomId, user]);

  // 🔹 Receive messages + typing
  useEffect(() => {
    const messageHandler = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const typingHandler = (name) => setTypingUser(name);
    const stopTypingHandler = () => setTypingUser(null);

    socket.on("receiveMessage", messageHandler);
    socket.on("showTyping", typingHandler);
    socket.on("hideTyping", stopTypingHandler);

    return () => {
      socket.off("receiveMessage", messageHandler);
      socket.off("showTyping", typingHandler);
      socket.off("hideTyping", stopTypingHandler);
    };
  }, []);

  // 🔹 Scroll chat box only
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, typingUser]);

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!user) return;

    socket.emit("typing", { roomId, userName: user.name });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId });
    }, 1200);
  };

  const sendMessage = () => {
    if (!text.trim() || !user) return;

    socket.emit("sendMessage", {
      roomId,
      senderId: user._id,
      text
    });

    socket.emit("stopTyping", { roomId });
    setText("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="header-content">
          <h1 className="chat-title"> SahayaKISSAN Chat</h1>
          {/* ✅ SELLER VIEW PRODUCT BUTTON */}
          {listing ? (
            <Link 
              to={`/listing/${listing._id}`} 
              className="view-product-btn"
              target="_blank"
            >
              🛒 View Product
              <div className="product-info">
                <span className="crop-name">{listing.cropName}</span>
                <span className="product-meta">
                  {listing.price} ₹/{listing.unit} • {listing.state}, {listing.city}
                </span>
              </div>
            </Link>
          ) : (
            <div className="no-product">📦 Loading product details...</div>
          )}
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="chat-messages" ref={chatBoxRef}>
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="empty-chat-icon">💬</div>
            <p>Waiting for buyer messages...</p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`chat-message ${m.sender?._id === user?._id ? 'message-sent' : 'message-received'}`}
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

      {/* 🔥 TYPING BAR */}
      {typingUser && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>{typingUser} is typing...</span>
        </div>
      )}

      {/* INPUT */}
      <div className="chat-input-wrapper">
        <input
          value={text}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="message-input"
          placeholder="Respond to buyer inquiry..."
          disabled={!user}
        />
        <button
          onClick={sendMessage}
          className="send-btn"
          disabled={!text.trim() || !user}
        >
          Send
        </button>
      </div>
    </div>
  );
}
