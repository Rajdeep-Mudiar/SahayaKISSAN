import { useEffect, useRef, useState } from "react";

export default function GlobalVoicePlayer() {
  const audioRef = useRef(null);
  const lastPlayedRef = useRef(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const enableAudio = () => {
    audioRef.current.play().then(() => {
      audioRef.current.pause();
      setAudioEnabled(true);
    });
  };

  useEffect(() => {
    if (!audioEnabled) return;

    const checkForNewVoice = async () => {
      const res = await fetch(
        "http://10.162.49.58:5000/api-voice/voice-status/FIRE_NODE_001"
      );
      const data = await res.json();

      if (data.lastTriggered > lastPlayedRef.current) {
        lastPlayedRef.current = data.lastTriggered;
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    };

    const interval = setInterval(checkForNewVoice, 3000);
    return () => clearInterval(interval);
  }, [audioEnabled]);

  return (
    <>
      {!audioEnabled && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: "10px 14px",
          background: "#2d5a3e",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 9999
        }} onClick={enableAudio}>
          🔊 Enable Voice Assistant
        </div>
      )}

      <audio ref={audioRef} hidden>
        <source
          src={`http://10.162.49.58:5000/audio/FIRE_NODE_001.mp3`}
          type="audio/mpeg"
        />
        
      </audio>
    </>
  );
}
