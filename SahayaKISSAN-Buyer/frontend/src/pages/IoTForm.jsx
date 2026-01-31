import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./IoTForm.css";
import { useTranslation } from 'react-i18next';

export default function IoTForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    location: "",
    devices: {
      soil: false,
      weather: false,
      pest: false,
      scanner: false,
    },
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeviceChange = (e) => {
    setFormData({
      ...formData,
      devices: {
        ...formData.devices,
        [e.target.name]: e.target.checked,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowError(false);

    try {
      await axios.post("http://localhost:5000/iot/request", formData);
      setShowSuccess(true);
      
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        location: "",
        devices: {
          soil: false,
          weather: false,
          pest: false,
          scanner: false,
        },
        message: "",
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || t('form.errorGeneric'));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  return (
    <div className="page">
      <div className="dashboardHeroBtn">
        <Link to="/dashboard" className="dashboardBtn">
          {t('form.goToDashboard')}
        </Link>
      </div>

      <div className="headingSection">
        <h1 className="mainHeading">
          {t('hero.title')}{" "}
          <span className="assamText">{t('hero.assamText')}</span>
        </h1>
        <p className="subHeading">
          {t('hero.subHeading')}
        </p>
      </div>

      <div className="heroImage"></div>

      <div className="whyIoTSection">
        <h2 className="sectionTitle">{t('whyIoT.title')}</h2>
        
        <div className="whyIoTContent">
          <div className="whyIoTText">
            <p className="whyLead">
              {t('whyIoT.lead')}
            </p>
            
            <div className="whyStats">
              <div className="statItem">
                <div className="statNumber">{t('whyIoT.stats.lossPerAcre')}</div>
                <div className="statLabel">{t('whyIoT.stats.lossPerAcreLabel')}</div>
              </div>
              <div className="statItem">
                <div className="statNumber">{t('whyIoT.stats.noTech')}</div>
                <div className="statLabel">{t('whyIoT.stats.noTechLabel')}</div>
              </div>
              <div className="statItem">
                <div className="statNumber">{t('whyIoT.stats.yieldIncrease')}</div>
                <div className="statLabel">{t('whyIoT.stats.yieldIncreaseLabel')}</div>
              </div>
            </div>

            <div className="whyBenefits">
              <h3 className="benefitsTitle">{t('whyIoT.benefitsTitle')}</h3>
              <div className="benefitList">
                <div className="benefitItem">
                  <span className="benefitIcon"></span>
                  <div>
                    <strong>{t('whyIoT.benefits.irrigation.title')}:</strong> {t('whyIoT.benefits.irrigation.desc')}
                  </div>
                </div>
                <div className="benefitItem">
                  <span className="benefitIcon"></span>
                  <div>
                    <strong>{t('whyIoT.benefits.pest.title')}:</strong> {t('whyIoT.benefits.pest.desc')}
                  </div>
                </div>
                <div className="benefitItem">
                  <span className="benefitIcon"></span>
                  <div>
                    <strong>{t('whyIoT.benefits.weather.title')}:</strong> {t('whyIoT.benefits.weather.desc')}
                  </div>
                </div>
                <div className="benefitItem">
                  <span className="benefitIcon"></span>
                  <div>
                    <strong>{t('whyIoT.benefits.dashboard.title')}:</strong> {t('whyIoT.benefits.dashboard.desc')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="devicesSection">
        <h2 className="sectionTitle">{t('devices.title')}</h2>
        <div className="deviceGrid">
          <div className="deviceCard available">
            <div className="deviceImgWrapper">
              <img
                src="https://images.unsplash.com/photo-1598514982845-23f4f5c7aa0a"
                alt={t('devices.soil.alt')}
                className="deviceImg"
              />
              <span className="deviceBadge available">{t('devices.availableNow')}</span>
            </div>
            <h3>{t('devices.soil.title')}</h3>
            <p>{t('devices.soil.desc')}</p>
            <div className="devicePrice">{t('devices.soil.price')}</div>
          </div>

          <div className="deviceCard">
            <div className="deviceImgWrapper">
              <img
                src="https://images.unsplash.com/photo-1581091215367-59ab6c4d5b44"
                alt={t('devices.weather.alt')}
                className="deviceImg"
              />
              <span className="deviceBadge comingSoon">{t('devices.q2_2026')}</span>
            </div>
            <h3>{t('devices.weather.title')}</h3>
            <p>{t('devices.weather.desc')}</p>
            <div className="devicePrice coming">{t('devices.weather.price')}</div>
          </div>

          <div className="deviceCard">
            <div className="deviceImgWrapper">
              <img
                src="https://images.unsplash.com/photo-1615671524827-c1fe3973b648"
                alt={t('devices.pest.alt')}
                className="deviceImg"
              />
              <span className="deviceBadge comingSoon">{t('devices.q3_2026')}</span>
            </div>
            <h3>{t('devices.pest.title')}</h3>
            <p>{t('devices.pest.desc')}</p>
            <div className="devicePrice coming">{t('devices.pest.price')}</div>
          </div>

          <div className="deviceCard">
            <div className="deviceImgWrapper">
              <img
                src="https://images.unsplash.com/photo-1623874514711-0f321325f318"
                alt={t('devices.scanner.alt')}
                className="deviceImg"
              />
              <span className="deviceBadge comingSoon">{t('devices.q4_2026')}</span>
            </div>
            <h3>{t('devices.scanner.title')}</h3>
            <p>{t('devices.scanner.desc')}</p>
            <div className="devicePrice coming">{t('devices.scanner.price')}</div>
          </div>
        </div>
      </div>

      <div className="ctaSection">
        <div className="ctaContent">
          <p className="ctaText">
            {t('cta.text')}
          </p>
          <p className="ctaSubtext">
            {t('cta.subtext')}
          </p>
        </div>
      </div>

      <div className="formSection">
        <h2 className="sectionTitle">{t('form.title')}</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="formRow">
            <input
              type="text"
              name="fullName"
              placeholder={t('form.fullName')}
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder={t('form.phone')}
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder={t('form.email')}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder={t('form.location')}
            value={formData.location}
            onChange={handleChange}
            required
          />

          <div className="formGroup">
            <label className="formLabel">{t('form.devicesLabel')}</label>

            <div className="deviceSelectBox">
              <label className="checkboxItem">
                <input
                  type="checkbox"
                  name="soil"
                  checked={formData.devices.soil}
                  onChange={handleDeviceChange}
                />
                <span>{t('form.devices.soil')}</span>
              </label>

              <label className="checkboxItem">
                <input
                  type="checkbox"
                  name="weather"
                  checked={formData.devices.weather}
                  onChange={handleDeviceChange}
                />
                <span>{t('form.devices.weather')}</span>
              </label>

              <label className="checkboxItem">
                <input
                  type="checkbox"
                  name="pest"
                  checked={formData.devices.pest}
                  onChange={handleDeviceChange}
                />
                <span>{t('form.devices.pest')}</span>
              </label>

              <label className="checkboxItem">
                <input
                  type="checkbox"
                  name="scanner"
                  checked={formData.devices.scanner}
                  onChange={handleDeviceChange}
                />
                <span>{t('form.devices.scanner')}</span>
              </label>
            </div>
          </div>

          <textarea
            name="message"
            placeholder={t('form.message')}
            rows="4"
            className="formTextarea"
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit" className="submitBtn" disabled={loading}>
            {loading ? t('form.submitting') : t('form.submitBtn')}
          </button>
        </form>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup success-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">✅</div>
            <h3>{t('popup.success.title')}</h3>
            <p>{t('popup.success.message')}</p>
            <button className="popup-btn" onClick={closePopup}>{t('popup.gotIt')}</button>
          </div>
        </div>
      )}

      {/* ERROR POPUP */}
      {showError && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup error-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">❌</div>
            <h3>{t('popup.error.title')}</h3>
            <p>{errorMsg}</p>
            <button className="popup-btn" onClick={closePopup}>{t('popup.tryAgain')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
