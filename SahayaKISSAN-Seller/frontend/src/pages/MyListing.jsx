import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyListing.css";
import api from "../api/axios";

const API = "http://localhost:5000/api/listings";

export default function MyListing() {
  const { t } = useTranslation();
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("active");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async (status) => {
    try {
      setLoading(true);
      const res = await api.get(`${API}/my?status=${status}`);
      setListings(res.data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(activeTab);
  }, [activeTab]);

  const changeStatus = async (id, newStatus) => {
    try {
      await api.patch(`${API}/${id}/status`, { status: newStatus });
      fetchListings(activeTab);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteItem = async (id) => {
    const confirmDelete = window.confirm(
      t("myListing.actions.confirmDelete")
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`${API}/${id}`);
      fetchListings(activeTab);
    } catch (err) {
      console.error("Failed to delete listing", err);
    }
  };

  return (
    <div className="container">
      <h2>{t("myListing.title")}</h2>
      <p className="subtitle">{t("myListing.subtitle")}</p>

      <div className="tabs">
        {[
          { label: t("myListing.tabs.active"), value: "active" },
          { label: t("myListing.tabs.paused"), value: "paused" },
          { label: t("myListing.tabs.sold"), value: "sold" }
        ].map(tab => (
          <span
            key={tab.value}
            className={`tab ${activeTab === tab.value ? "active" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </span>
        ))}
      </div>

      {!loading && listings.length === 0 && (
        <p className="empty">{t("myListing.empty")}</p>
      )}

      {loading && <p className="empty">{t("myListing.loading")}</p>}

      {!loading &&
        listings.map(item => (
          <div className="listing-card" key={item._id}>
            <img
              src={item.images?.[0] || "/images/default-product-1.jpg"}
              alt={item.cropName}
            />

            <div className="listing-info">
              <h3>{item.cropName}</h3>

              <p className="price">
                {t("myListing.priceUnit", {
                  price: item.price,
                  unit: item.unit
                })}
              </p>

              <p className="details">
                {t("myListing.details", {
                  quantity: item.quantity,
                  unit: item.unit,
                  city: item.city,
                  state: item.state
                })}
              </p>
            </div>

            <div className="listing-actions">
              <span className={`status ${item.status}`}>
                {t(`myListing.status.${item.status}`)}
              </span>

              <button onClick={() => navigate(`/seller/listings/edit/${item._id}`)}>
                {t("myListing.actions.edit")}
              </button>


              {item.status === "active" && (
                <button
                  className="pause"
                  onClick={() => changeStatus(item._id, "paused")}
                >
                  {t("myListing.actions.pause")}
                </button>
              )}

              {item.status === "paused" && (
                <button
                  className="resume"
                  onClick={() => changeStatus(item._id, "active")}
                >
                  {t("myListing.actions.resume")}
                </button>
              )}

              <button
                className="delete"
                onClick={() => deleteItem(item._id)}
              >
                {t("myListing.actions.delete")}
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
