import { useEffect, useRef } from "react";
import { useAudio } from "../context/AudioContext";

export default function GlobalVoicePlayer() {
  const { audioEnabled, enableAudio, voiceRef } = useAudio();
  const lastPlayedRef = useRef(0);

  useEffect(() => {
    if (!audioEnabled) return;

    const checkForNewVoice = async () => {
      try {
        const res = await fetch(
          "http://10.162.49.58:5000/api-voice/voice-status/FIRE_NODE_001"
        );
        const data = await res.json();

        if (data.lastTriggered > lastPlayedRef.current) {
          lastPlayedRef.current = data.lastTriggered;
          voiceRef.current.load();
          voiceRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Voice fetch failed", err);
      }
    };

    const interval = setInterval(checkForNewVoice, 3000);
    return () => clearInterval(interval);
  }, [audioEnabled]);

  return (
    <>
      {!audioEnabled && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            padding: "10px 14px",
            background: "#2d5a3e",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            zIndex: 9999
          }}
          onClick={enableAudio}
        >
          🔊 Enable Audio
        </div>
      )}

      <audio ref={voiceRef} hidden>
        <source
          src={`http://10.162.49.58:5000/audio/FIRE_NODE_001.mp3?ts=${Date.now()}`}
          type="audio/mpeg"
        />
      </audio>
    </>
  );
}
