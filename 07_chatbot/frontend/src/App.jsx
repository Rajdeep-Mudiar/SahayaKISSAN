import { ChatProvider } from "./context/ChatContext";
import Chat from "./pages/Chat";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <ChatProvider>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <Chat />
      </div>
    </ChatProvider>
  );
}

export default App;
