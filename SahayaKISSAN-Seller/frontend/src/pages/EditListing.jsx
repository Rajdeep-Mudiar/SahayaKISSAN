import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./SellForm.css";
import api from "../api/axios"

const API = "http://localhost:5000/api/listings/edit";

export default function EditListing() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

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
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`${API}/${id}`);
        const data = res.data;

        setForm({
          cropName: data.cropName || "",
          category: data.category || "",
          variety: data.variety || "",
          description: data.description || "",
          quantity: data.quantity || "",
          unit: data.unit || "kg",
          price: data.price || "",
          minOrder: data.minOrder || "",
          state: data.state || "",
          city: data.city || "",
          harvestDate: data.harvestDate ? data.harvestDate.slice(0, 10) : "",
          organic: data.organic || "",
          mobile: data.mobile || ""
        });

        setExistingImages(data.images || []);
      } catch (err) {
        console.error("Failed to load listing", err);
        setShowPopup("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const availableSlots = 6 - existingImages.length - newImages.length;
    
    const newFiles = files.filter((file, index) => 
      index < availableSlots && 
      file.type.startsWith('image/') && 
      file.size < 5 * 1024 * 1024
    );
    
    setNewImages(prev => [...prev, ...newFiles]);
    setShowImageModal(false);
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl, index) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const restoreImage = (imageUrl) => {
    setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
    // Re-add to existing images (you'd need to track original index)
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setShowPopup(null);

      const formData = new FormData();
      
      // Append updated form fields
      Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
      });
      
      // Append new images
      newImages.forEach((image) => {
        formData.append('images', image);
      });
      
      // Append images to delete
      imagesToDelete.forEach(imageUrl => {
        formData.append('deleteImages', imageUrl);
      });

      const res = await api.patch(
        `${API}/${id}`,
        formData
      );

      console.log("✅ Listing updated:", res.data);
      setShowPopup('success');
      setTimeout(() => navigate("/seller/my-sells"), 1500);
      
    } catch (error) {
      console.error("❌ Update error:", error.response?.data || error.message);
      setShowPopup('error');
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  if (isLoading) {
    return (
      <div className="agri-page pt-20">
        <div className="agri-form">
          <p className="empty">{t("common.loading") || "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agri-page pt-20">
      <div className="agri-form">
        <h1>{t("edit.title") || "Edit Listing"}</h1>
        <p className="subtitle">{t("edit.subtitle") || "Update your product details"}</p>

        {/* ================= IMAGE UPLOAD SECTION ================= */}
        <div className="section image-upload-section">
          <h3>{t("sell.images") || "Product Images"} <span className="required">*</span></h3>
          <p className="image-hint">
            {existingImages.length + newImages.length}/{6} images ({6 - existingImages.length - newImages.length} slots left)
          </p>
          
          <div className="image-grid">
            {/* Existing Images */}
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className="image-slot filled">
                <img src={img} alt={`Existing ${index + 1}`} loading="lazy" />
                <button 
                  className="remove-image"
                  onClick={() => removeExistingImage(img, index)}
                  type="button"
                  title="Remove image"
                >
                  ❌
                </button>
                <span className="image-count">E{index + 1}</span>
              </div>
            ))}

            {/* New Images */}
            {newImages.map((image, index) => (
              <div key={`new-${index}`} className="image-slot filled">
                <img 
                  src={URL.createObjectURL(image)} 
                  alt={`New ${index + 1}`}
                  loading="lazy"
                />
                <button 
                  className="remove-image"
                  onClick={() => removeNewImage(index)}
                  type="button"
                  title="Remove image"
                >
                  ❌
                </button>
                <span className="image-count">N{index + 1}</span>
              </div>
            ))}
            
            {existingImages.length + newImages.length < 6 && (
              <div 
                className="image-slot add-slot"
                onClick={() => setShowImageModal(true)}
              >
                <div className="add-icon">+</div>
                <span>{t("sell.addImages") || "Add Images"}</span>
              </div>
            )}
          </div>
          
          {(existingImages.length + newImages.length > 0) && (
            <p className="image-limit">
              {6 - existingImages.length - newImages.length > 0 
                ? `${6 - existingImages.length - newImages.length} slots remaining`
                : "Maximum images reached"
              }
            </p>
          )}
        </div>

        {/* ================= CROP DETAILS ================= */}
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
              />
            </div>

            <div className="field">
              <label>{t("sell.category")} <span className="required">*</span></label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">{t("common.select")}</option>
                <option value="seeds">{t("categories.seeds")}</option>
                <option value="tea">{t("categories.tea")}</option>
                <option value="vegetables">{t("categories.vegetables")}</option>
                <option value="fruits">{t("categories.fruits")}</option>
                <option value="grains">{t("categories.grains")}</option>
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

        {/* ================= PRICING ================= */}
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

        {/* ================= LOCATION ================= */}
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

        {/* ================= CONTACT ================= */}
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
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              {t("sell.submitting") || "Updating..."}
            </>
          ) : (
            t("edit.save") || "Save Changes"
          )}
        </button>
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t("sell.selectImages") || "Select New Images"}</h3>
              <button className="modal-close" onClick={() => setShowImageModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageUpload}
                className="file-input"
              />
              <label htmlFor="image-upload" className="file-label">
                <div className="upload-area">
                  <div className="upload-icon">📁</div>
                  <p>{t("sell.clickToUpload") || "Click to upload"}</p>
                  <small>
                    {6 - existingImages.length - newImages.length} slots remaining (5MB each)
                  </small>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ================= POPUPS ================= */}
      {showPopup === 'success' && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup success-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">✅</div>
            <h3>{t("popup.successTitle") || "Success!"}</h3>
            <p>{t("popup.successMessage") || "Listing updated successfully"}</p>
            <button className="popup-btn" onClick={closePopup}>
              {t("common.ok") || "OK"}
            </button>
          </div>
        </div>
      )}

      {showPopup === 'error' && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup error-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">⚠️</div>
            <h3>{t("popup.errorTitle") || "Error"}</h3>
            <p>{t("popup.errorMessage") || "Something went wrong"}</p>
            <button className="popup-btn" onClick={closePopup}>
              {t("common.tryAgain") || "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* ================= SIDE INFO ================= */}
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
