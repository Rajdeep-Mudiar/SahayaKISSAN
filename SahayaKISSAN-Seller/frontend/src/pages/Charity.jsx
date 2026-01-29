import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import "./Charity.css";

export default function Charity() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    price: "",
    state: "",
    city: "",
    sellTo: "",
    mobile: "",
  });

  const handleSubmit = async () => {
    // Validation
    if (
      !formData.cropName ||
      !formData.quantity ||
      !formData.price ||
      !formData.state ||
      !formData.city ||
      !formData.sellTo ||
      !formData.mobile
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      // 🔥 SEND DATA TO BACKEND
      await api.post("http://localhost:5000/charity", formData);

      // ✅ Navigate AFTER successful save
      navigate("/charity/list", {
        state: {
          state: formData.state,
          city: formData.city,
          sellTo: formData.sellTo,
        },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit charity offer. Please try again.");
    }
  };

  return (
    <div className="charity-page">
      <section className="offer-section">
        <div className="offer-left">
          <h1>Offer Produce in Bulk</h1>
          <p>
            Do you have surplus agricultural produce? Help feed thousands by
            offering your harvest at low or zero cost to charitable institutions.
          </p>

          <form className="offer-form" onSubmit={(e) => e.preventDefault()}>
            <label>Crop Name *</label>
            <input
              type="text"
              placeholder="e.g., Rice, Wheat, Vegetables"
              onChange={(e) =>
                setFormData({ ...formData, cropName: e.target.value })
              }
            />

            <div className="form-row">
              <div>
                <label>Quantity *</label>
                <input
                  type="text"
                  placeholder="e.g., 500 kg"
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Price *</label>
                <input
                  type="text"
                  placeholder="e.g., Free or ₹5/kg"
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>State *</label>
                <input
                  type="text"
                  placeholder="e.g., Assam"
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>

              <div>
                <label>City *</label>
                <input
                  type="text"
                  placeholder="e.g., Guwahati"
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
            </div>

            <label>Mobile Number *</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              maxLength="10"
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />

            <label>Where do you want to sell? *</label>
            <select
              onChange={(e) =>
                setFormData({ ...formData, sellTo: e.target.value })
              }
            >
              <option value="">Select option</option>
              <option value="ashram">Ashram</option>
              <option value="temple">Temple</option>
              <option value="ngo">NGO</option>
              <option value="community_kitchen">
                Community Kitchen
              </option>
            </select>

            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
            >
              🌱 List My Produce
            </button>
          </form>
        </div>

        <div className="offer-right">
          <img
            src="https://media.istockphoto.com/id/604366764/photo/women-are-standing-in-their-eggplant-field.jpg?s=612x612&w=0&k=20&c=lRNbudl0KN0RA8tq8vrw8mL-gdG4MqIM0VsUFjRJnMs="
            alt="Farmer"
          />
        </div>
      </section>
    </div>
  );
}
 
