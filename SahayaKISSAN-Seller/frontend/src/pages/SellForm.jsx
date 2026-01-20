import { useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./SellForm.css";
import api from "../api/axios";


const API = "http://localhost:5000/api/listings"; 

export default function SellForm() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    cropName: "",
    category: "",
    variety: "",
    description: "",
    quantity: "",
    unit: "kg",
    price: "",
    minOrder: "",
    state: "",
    city: "",
    harvestDate: "",
    organic: "",
    mobile: ""
  });
  
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPopup, setShowPopup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.filter((file, index) => 
      index < 6 - images.length && 
      file.type.startsWith('image/') && 
      file.size < 5 * 1024 * 1024
    );
    
    setImages(prev => [...prev, ...newImages]);
    setShowImageModal(false);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setShowPopup(null);

      if (!form.cropName || !form.category || !form.quantity || !form.price) {
        setShowPopup('error');
        return;
      }

      if (images.length === 0) {
        setShowPopup('error');
        return;
      }

      const formData = new FormData();
      
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      const res = await api.post(
        `${API}`, // POST /api/listings (CREATE)
        formData, // ✅ FORM DATA AS BODY
        // {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     Authorization: `Bearer ${localStorage.getItem("token")}`
        //   }
        // }
      );

      console.log("✅ Listing created:", res.data);
      
      setForm({
        cropName: "", category: "", variety: "", description: "",
        quantity: "", unit: "kg", price: "", minOrder: "",
        state: "", city: "", harvestDate: "", organic: "", mobile: ""
      });
      setImages([]);
      setShowPopup('success');

    } catch (error) {
      console.error("❌ Submit error:", error.response?.data || error.message);
      setShowPopup('error');
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  return (
    <div className="agri-page pt-20">
      <div className="agri-form">
        <h1>{t("sell.title")}</h1>
        <p className="subtitle">{t("sell.subtitle")}</p>

       
        <div className="section">
          <h3>{t("sell.cropDetails")}</h3>
          <div className="row">
            <div className="field">
              <label>{t("sell.cropName")} <span className="required">*</span></label>
              <input
                name="cropName"
                value={form.cropName}
                onChange={handleChange}
                placeholder={t("sell.cropNamePlaceholder")}
                required
              />
            </div>

            <div className="field">
              <label>{t("sell.category")} <span className="required">*</span></label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">{t("common.select")}</option>
                <option value="seeds">{t("categories.seeds")}</option>
                <option value="tea">{t("categories.tea")}</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>{t("sell.variety")}</label>
              <input
                name="variety"
                value={form.variety}
                onChange={handleChange}
                placeholder={t("sell.varietyPlaceholder")}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>{t("sell.description")}</label>
              <textarea
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
                placeholder={t("sell.descriptionPlaceholder")}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <h3>{t("sell.pricing")}</h3>
          <div className="row">
            <div className="field small">
              <label>{t("sell.quantity")} <span className="required">*</span></label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="field small">
              <label>{t("sell.unit")}</label>
              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="kg">{t("units.kg")}</option>
                <option value="quintal">{t("units.quintal")}</option>
                <option value="ton">{t("units.ton")}</option>
                <option value="piece">{t("units.piece")}</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field small">
              <label>{t("sell.price")} <span className="required">*</span></label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="field small">
              <label>{t("sell.minOrder")}</label>
              <input
                type="number"
                name="minOrder"
                value={form.minOrder}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>
         <div className="section image-upload-section">
          <h3>{t("sell.images")} <span className="required">*</span></h3>
          <p className="image-hint">{t("sell.imageHint")}</p>
          
          <div className="image-grid">
            {images.map((image, index) => (
              <div key={index} className="image-slot filled">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt={`Preview ${index + 1}`}
                  loading="lazy"
                />
                <button 
                  className="remove-image"
                  onClick={() => removeImage(index)}
                  type="button"
                  title={t("sell.removeImage")}
                >
                  ❌
                </button>
                <span className="image-count">{index + 1}</span>
              </div>
            ))}
            
            {images.length < 6 && (
              <div 
                className="image-slot add-slot"
                onClick={() => setShowImageModal(true)}
                title={t("sell.addImages")}
              >
                <div className="add-icon">+</div>
                <span>{t("sell.addImages")}</span>
              </div>
            )}
          </div>
          
          {images.length > 0 && (
            <p className="image-limit">
              {t("sell.imageLimit", { count: 6 - images.length })}
            </p>
          )}
        </div>

        <div className="section">
          <h3>{t("sell.location")}</h3>
          <div className="row">
            <div className="field">
              <label>{t("sell.state")}</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g. Assam"
              />
            </div>

            <div className="field">
              <label>{t("sell.city")}</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Jorhat"
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>{t("sell.harvestDate")}</label>
              <input
                type="date"
                name="harvestDate"
                value={form.harvestDate}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>{t("sell.organic")}</label>
              <select name="organic" value={form.organic} onChange={handleChange}>
                <option value="">{t("common.select")}</option>
                <option value="yes">{t("common.yes")}</option>
                <option value="no">{t("common.no")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>{t("sell.contactInfo")}</h3>
          <div className="row">
            <div className="field">
              <label>{t("sell.mobile")}</label>
              <input
                type="tel"
                name="mobile"
                placeholder={t("sell.mobilePlaceholder")}
                value={form.mobile}
                onChange={handleChange}
              />
              <small className="helper-text">{t("sell.mobileHint")}</small>
            </div>
          </div>
        </div>

        <button 
          className={`submit-btn ${isLoading ? 'loading' : ''}`} 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              {t("sell.submitting")}
            </>
          ) : (
            t("sell.submit")
          )}
        </button>
      </div>

      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t("sell.selectImages")}</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                max={6 - images.length}
                className="file-input"
              />
              <label htmlFor="image-upload" className="file-label">
                <div className="upload-area">
                  <div className="upload-icon">📁</div>
                  <p>{t("sell.clickToUpload")}</p>
                  <small>
                    {t("sell.remainingImages", { count: 6 - images.length })}
                  </small>
                </div>
              </label>
              
              <div className="modal-footer">
                <p>{t("sell.supportedFormats")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup === 'success' && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup success-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">✅</div>
            <h3>{t("popup.successTitle")}</h3>
            <p>{t("popup.successMessage")}</p>
            <button className="popup-btn" onClick={closePopup}>
              {t("common.ok")}
            </button>
          </div>
        </div>
      )}

      {showPopup === 'error' && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup error-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">⚠️</div>
            <h3>{t("popup.errorTitle")}</h3>
            <p>{t("popup.errorMessage")}</p>
            <button className="popup-btn" onClick={closePopup}>
              {t("common.tryAgain")}
            </button>
          </div>
        </div>
      )}

      <div className="agri-image">
        <img
          src="https://blog.agribazaar.com/wp-content/uploads/2024/01/Happy-Smiling-Indian-farmer-counting-Currency-notes-inside-the-greenhouse-or-polyhouse-concept-of-profit-or-made-made-money-from-greenhouse-farming.jpeg"
          alt="Happy Farmer"
        />

        <div className="agri-info">
          <h3>{t("sell.whyTitle")}</h3>
          <ul>
            <li>{t("sell.why1")}</li>
            <li>{t("sell.why2")}</li>
            <li>{t("sell.why3")}</li>
            <li>{t("sell.why4")}</li>
            <li>{t("sell.why5")}</li>
          </ul>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <span>{t("stats.farmers")}</span>
            </div>
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <span>{t("stats.products")}</span>
            </div>
            <div className="stat-card">
              <div className="stat-number">₹50Cr+</div>
              <span>{t("stats.value")}</span>
            </div>
          </div>

          <div className="category-preview">
            <h4>{t("sell.popularCategories")}</h4>
            <div className="cat-icons">
              <div className="cat-item seeds">🌾 {t("categories.seeds")}</div>
              <div className="cat-item tea">🍵 {t("categories.tea")}</div>
              <div className="cat-item vegetables">🥬 {t("categories.vegetables")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
