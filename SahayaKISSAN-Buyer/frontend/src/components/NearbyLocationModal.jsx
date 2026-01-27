import { useState } from "react";
import "./NearbyModal.css";

export default function NearbyLocationModal({ onClose, onConfirm }) {
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleConfirm = () => {
    if (!stateName || !district || !city) {
      alert("Please select full location");
      return;
    }

    const locationData = {
      state: stateName,
      district,
      city,
      source: "manual"
    };

    // Save to localStorage
    localStorage.setItem("nearbyLocation", JSON.stringify(locationData));

    onConfirm(locationData);
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const address = data.address;

          setCity(address.city || address.town || address.village || "");
          setDistrict(address.county || "");
          setStateName(address.state || "");

        } catch (err) {
          alert("Failed to detect location");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>📍 Choose Your Location</h2>

        <button className="gps-btn" onClick={useCurrentLocation}>
          {loadingLocation ? "Detecting..." : "Use Current Location"}
        </button>

        <select value={stateName} onChange={(e) => setStateName(e.target.value)}>
          <option value="">Select State</option>
          <option value="Assam">Assam</option>
        </select>

        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">Select District</option>
          <option value="Jorhat">Jorhat</option>
          <option value="Dibrugarh">Dibrugarh</option>
          <option value="Guwahati">Guwahati</option>
        </select>

        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          <option value="Jorhat">Jorhat</option>
          <option value="Titabor">Titabor</option>
          <option value="Guwahati">Guwahati</option>
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm}>Confirm Location</button>
        </div>
      </div>
    </div>
  );
}
