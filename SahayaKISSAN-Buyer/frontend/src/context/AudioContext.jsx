import { createContext, useContext, useRef, useState } from "react";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const voiceRef = useRef(null);
  const alarmRef = useRef(new Audio("/alarm.mp3"));

  const [audioEnabled, setAudioEnabled] = useState(false);

  // configure alarm once
  alarmRef.current.loop = true;
  alarmRef.current.volume = 1.0;

  // 🔓 unlock BOTH audios with user gesture
const enableAudio = async () => {
  try {
    // 🔓 unlock ANY audio (enough for browser)
    await alarmRef.current.play();
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;

    setAudioEnabled(true);
    console.log("🔓 Global audio unlocked");
  } catch (err) {
    console.warn("Audio unlock failed", err);
  }
};


  const playAlarm = () => {
    if (!audioEnabled) return;
    alarmRef.current.currentTime = 0;
    alarmRef.current.play().catch(() => {});
  };

  const stopAlarm = () => {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  };

  return (
    <AudioContext.Provider value={{
      audioEnabled,
      enableAudio,
      playAlarm,
      stopAlarm,
      voiceRef
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
