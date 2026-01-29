import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal";
import "./AfterHeroSections.css";

const scenes = [
  {
    id: "smart",
    image: "/images/agroAI.png",
    titleKey: "afterHero.enable.cards.smart.title",
    descKey: "afterHero.enable.cards.smart.desc",
  },
  {
    id: "schemes",
    image: "/images/agroSchemes.jpg",
    titleKey: "afterHero.enable.cards.schemes.title",
    descKey: "afterHero.enable.cards.schemes.desc",
  },
  {
    id: "tech",
    image: "/images/agroAdoption.png",
    titleKey: "afterHero.enable.cards.tech.title",
    descKey: "afterHero.enable.cards.tech.desc",
  },
  {
    id: "sustain",
    image: "/images/sustainable.png",
    titleKey: "afterHero.enable.cards.sustain.title",
    descKey: "afterHero.enable.cards.sustain.desc",
  },
];

export default function AfterHeroSections() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % scenes.length);
    }, 8000); 
    return () => clearInterval(interval);
  }, []);

  const activeScene = scenes[activeIndex];

  return (
    <section className="after-hero">
      <div className="section-row">
        <Reveal>
          <div className="section-text">
            <h2>{t("afterHero.whoWeAre.title")}</h2>
            <p>{t("afterHero.whoWeAre.p1")}</p>
            <p>{t("afterHero.whoWeAre.p2")}</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="section-image">
            <img
              src="/images/who-we-are.avif"
              alt={t("afterHero.whoWeAre.imageAlt")}
            />
          </div>
        </Reveal>
      </div>

      <div className="section-row reverse">
        <Reveal>
          <div className="section-text">
            <h2>{t("afterHero.whyMatters.title")}</h2>
            <p>{t("afterHero.whyMatters.p1")}</p>
            <p>{t("afterHero.whyMatters.p2")}</p>
          </div>
        </Reveal>

        <Reveal>
          <div className="section-image">
            <img
              src="https://pandawaid.com/wp-content/uploads/2024/04/Sustainability-Report-2023_Thumbnail.jpeg"
              alt={t("afterHero.whyMatters.imageAlt")}
              style={{
                width: "100%",
                height: "420px",
                objectFit: "contain",
                backgroundColor: "#f2f7f3",
              }}
            />
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="cinematic-wrapper">
          <video
            className="cinematic-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/agro-placeholder.jpg"
          >
            <source src="/videos/agro-farming.mp4" type="video/mp4" />
            Your browser doesn't support video.
          </video>

          <div className="cinematic-overlay" />

          <div className="cinematic-content">
            <div className="cinematic-header">
              <h2>{t("afterHero.enable.title")}</h2>
              <p>{t("afterHero.enable.subtitle")}</p>
            </div>

            <div className="cinematic-reel">
              <div
                key={activeScene.id}
                className="cinematic-scene cinematic-scene-animate"
              >
                <div className="scene-image cinematic-film-left">
                  <img src={activeScene.image} alt={t(activeScene.titleKey)} />
                </div>

                <div className="scene-text cinematic-film-right">
                  <h3>{t(activeScene.titleKey)}</h3>
                  <p>{t(activeScene.descKey)}</p>
                </div>
              </div>
            </div>

            <div className="cinematic-dots">
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  className={
                    idx === activeIndex
                      ? "cinematic-dot cinematic-dot-active"
                      : "cinematic-dot"
                  }
                  onClick={() => setActiveIndex(idx)}
                  aria-label={scene.id}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
