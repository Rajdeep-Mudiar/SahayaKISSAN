import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import "./HomeExtraSections.css";

export default function HomeExtraSections() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:5000/api/buy/low-price-random");
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Product fetch failed", err);
    }
  }

  fetchProducts();
}, []);

  return (
    <section className="home-extra">
      <Reveal>
        <div className="impact-section">
          <div className="section-header">
            <h2>{t("impact.title")}</h2>
            <p>{t("impact.subtitle")}</p>
          </div>
          <div className="impact-grid">
            <div className="impact-card" data-count="500">
              <h3>0</h3>
              <p>{t("impact.farmers")}</p>
            </div>
            <div className="impact-card" data-count="20">
              <h3>0</h3>
              <p>{t("impact.districts")}</p>
            </div>
            <div className="impact-card" data-count="10000">
              <h3>0</h3>
              <p>{t("impact.dataPoints")}</p>
            </div>
            <div className="impact-card" data-count="25">
              <h3>1</h3>
              <p>{t("impact.iot")}</p>
            </div>
          </div>
        </div>
      </Reveal>



      <Reveal>
        <div className="products-section">
          <div className="section-header">
            <h2>{t("products.title")}</h2>
            <p>{t("products.subtitle")}</p>
          </div>

          <div className="products-grid">
            {products.map((item) => (
              <div key={item._id} className="product-placeholder">
                <div className="product-image">
                  <img
                    src={item.images?.[0] || "/images/placeholder.png"}
                    alt={item.cropName}
                  />
                </div>

                <h4>{item.cropName}</h4>
                <p>
                  ₹{item.price} / {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>



      <Reveal>
        <div className="sdg-poster-wrapper">
          <div 
            className="sdg-hero-bg"
            style={{
              backgroundImage: `url('/images/sdg.jpeg')`
            }}
          >
            <div className="sdg-dark-overlay"></div>
          </div>
          
          <div className="sdg-poster-inner">
            <div className="sdg-poster-header">
              <h2>{t("sdg.title")}</h2>
              <p>{t("sdg.desc")}</p>
            </div>
            
            <div className="sdg-goals-grid">
              <div className="sdg-goal-card sdg-goal-2">
                <div className="sdg-goal-number">2</div>
                <span>Zero Hunger</span>
                <p>Ending hunger, achieving food security</p>
              </div>
              
              <div className="sdg-goal-card sdg-goal-8">
                <div className="sdg-goal-number">8</div>
                <span>Decent Work</span>
                <p>Decent work and economic growth</p>
              </div>
              
              <div className="sdg-goal-card sdg-goal-13">
                <div className="sdg-goal-number">13</div>
                <span>Climate Action</span>
                <p>Take urgent action on climate change</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>


      <Reveal>
        <div className="cta-section">
          <div className="cta-content">
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.desc")}</p>

            <div className="cta-buttons">
              <a href="tel:7099774852" className="cta-primary">
                {t("cta.button2")}
              </a>
            </div>
          </div>
        </div>
      </Reveal>

    </section>
  );
}
