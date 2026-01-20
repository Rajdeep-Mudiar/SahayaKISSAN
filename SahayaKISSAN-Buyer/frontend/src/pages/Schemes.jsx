import "./Schemes.css";
import Reveal from "../components/Reveal";
export default function Info() {
const schemes = [
  {
    id: 1,
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description:
      "Provides ₹6,000 per year as income support to eligible farmer families in Assam.",
    category: "Financial Support",
    link: "https://pmkisan.gov.in/",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description:
      "Crop insurance scheme protecting farmers against crop loss due to floods, droughts, pests, and diseases.",
    category: "Crop Insurance",
    link: "https://pmfby.gov.in/",
  },
  {
    id: 3,
    name: "Soil Health Card Scheme",
    description:
      "Provides soil testing and recommendations for balanced fertilizer use to improve crop yield.",
    category: "Soil Health",
    link: "https://soilhealth.dac.gov.in/",
  },
  {
    id: 4,
    name: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
    description:
      "Focuses on improving irrigation facilities and water-use efficiency for farms in Assam.",
    category: "Irrigation",
    link: "https://pmksy.gov.in/",
  },
  {
    id: 5,
    name: "Kisan Credit Card (KCC)",
    description:
      "Provides affordable short-term credit to farmers for agriculture and allied activities.",
    category: "Credit Facility",
    link: "https://www.myscheme.gov.in/schemes/kcc",
  },
  {
    id: 6,
    name: "National Mission on Sustainable Agriculture (NMSA)",
    description:
      "Encourages climate-resilient farming practices and sustainable land and water management.",
    category: "Sustainable Agriculture",
    link: "https://nmsa.dac.gov.in/",
  },
  {
    id: 7,
    name: "Assam State Agriculture Mission (ASAM)",
    description:
      "State government scheme aimed at increasing agricultural productivity and farmers’ income in Assam.",
    category: "State Scheme",
    link: "https://agri-horti.assam.gov.in/",
  },
  {
    id: 8,
    name: "National Food Security Mission (NFSM)",
    description:
      "Aims to increase production of rice, pulses, and coarse cereals in Assam.",
    category: "Food Security",
    link: "https://nfsm.gov.in/",
  },
  {
    id: 9,
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description:
      "Promotes organic farming through cluster-based certification and support.",
    category: "Organic Farming",
    link: "https://pgsindia-ncof.gov.in/PKVY.aspx",
  },
  {
    id: 10,
    name: "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
    description:
      "Supports agri-infrastructure, innovation, and farmer entrepreneurship in Assam.",
    category: "Infrastructure & Innovation",
    link: "https://rkvy.nic.in/",
  },
  {
    id: 11,
    name: "Sub-Mission on Agricultural Mechanization (SMAM)",
    description:
      "Provides subsidies on farm machinery to reduce manual labor and increase efficiency.",
    category: "Farm Mechanization",
    link: "https://agrimachinery.nic.in/",
  },
  {
    id: 12,
    name: "Mission Organic Value Chain Development for North Eastern Region (MOVCD-NER)",
    description:
      "Promotes organic farming in the North-East including Assam with market linkages.",
    category: "NER Scheme",
    link: "https://movcdner.dac.gov.in/",
  },
];
  return (
    <div className="page-wrapper">
      {/* HERO */}
      <Reveal>
        <header className="hero">
        <h1>Agriculture Schemes – Assam</h1>
        <p>
          Official government schemes supporting farmers, tea growers, and
          sustainable agriculture in Assam
        </p>
      </header>

      {/* CONTENT */}
      <section className="content">
        <div className="scheme-grid">
          {schemes.map((scheme) => (
            <div className="scheme-card" key={scheme.id}>
              <div className="card-header">
                <h2>{scheme.name}</h2>
                <span className="tag">{scheme.category}</span>
              </div>

              <p className="desc">{scheme.description}</p>

              <div className="card-footer">
                <span className="gov-badge">Govt. of India / Assam</span>
                <button
                  onClick={() => window.open(scheme.link, "_blank")}
                >
                  View Official Scheme →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      </Reveal>
      
    </div>
  );
}