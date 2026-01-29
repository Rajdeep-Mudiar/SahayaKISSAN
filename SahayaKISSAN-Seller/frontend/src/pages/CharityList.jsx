import "./CharityList.css";
export default function ComingSoon() {
  return (
    <div className="coming-container">
      <div className="glass-card">
        <div className="icon">♻️</div>

        <h1>Coming Soon</h1>

        <p className="main-text">
          We are working on connecting nearby ashrams, temples, NGOs,
          and community kitchens.
        </p>

        <p className="sub-text">
          This feature will be live very soon.
        </p>

        <button className="notify-btn">Notify Me</button>
      </div>
    </div>
  );
}
