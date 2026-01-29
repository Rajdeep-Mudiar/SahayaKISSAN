import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import AfterHeroSections from "../components/AfterHeroSections";
import HomeExtraSections from "../components/HomeExtraSections";

export default function Home() {

  useEffect(() => {
    let currentSlide = 0;
    const slides = document.querySelectorAll(".agri-hero-slide");
    const dots = document.querySelectorAll(".agri-hero-dot");
    const totalSlides = slides.length;

    const nextSlide = () => {
      slides[currentSlide].classList.remove("active");
      dots[currentSlide].classList.remove("active");

      currentSlide = (currentSlide + 1) % totalSlides;

      slides[currentSlide].classList.add("active");
      dots[currentSlide].classList.add("active");
    };

    const initSlider = () => {
      if (slides.length > 0 && dots.length > 0) {
        slides[0].classList.add("active");
        dots[0].classList.add("active");

        dots.forEach((dot, index) => {
          dot.addEventListener("click", () => {
            slides[currentSlide].classList.remove("active");
            dots[currentSlide].classList.remove("active");

            currentSlide = index;

            slides[currentSlide].classList.add("active");
            dots[currentSlide].classList.add("active");
          });
        });
      }
    };

    initSlider();
    const interval = setInterval(nextSlide, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="agriculture-home">
      <div className="agri-hero">
        <div className="agri-hero-slides">

          <div className="agri-hero-slide active">
            <img src="/images/Agri1.png" alt="Agriculture overview 1" />
            <svg className="agri-lines" viewBox="0 0 400 260" preserveAspectRatio="none">
              <path className="draw-line line1" d="M50 50 L100 200 L200 80 L350 220" stroke="#FFFFFF" strokeWidth="2" fill="none" />
              <path className="draw-line line2" d="M20 240 Q150 100 300 240" stroke="#FFFFFF" strokeWidth="3" fill="none" />
              <path className="draw-line line3" d="M380 20 L250 150 L180 30" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="agri-hero-slide">
            <img
              src="https://geographicbook.com/wp-content/uploads/2024/02/Agriculture-in-India-1.jpeg"
              alt="Agriculture overview 2"
            />
          </div>

          <div className="agri-hero-slide">
            <img src="/images/landing3.png" alt="Agriculture overview 3" />
          </div>

          <div className="agri-hero-slide clickable-slide">
            <Link to="http://localhost:5174/seller/my-sells" className="hero-clickable">
              <img src="/images/sell.png" alt="Emergency Selling" />
            </Link>
          </div>


        </div>

        <div className="agri-hero-indicators">
          <span className="agri-hero-dot active"></span>
          <span className="agri-hero-dot"></span>
          <span className="agri-hero-dot"></span>
          <span className="agri-hero-dot"></span>
        </div>
      </div>

      <AfterHeroSections />
      <HomeExtraSections />
    </div>
  );
}
