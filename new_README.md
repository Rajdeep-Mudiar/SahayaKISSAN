# 🌾 SahayaKISSAN - Smart Agriculture Ecosystem

Integrated platform with three apps: Buyer (5173), Seller (5174), and AI Chatbot (5175). Backends: Node.js marketplace API and FastAPI chatbot API. Single command runs all frontends; backends start separately.

---

## Quick Start (TL;DR)

```bash
git clone <repository-url>
cd SahayaKISSAN

# root deps (installs concurrently)
npm install

# install ALL frontend deps
npm run install:all

# start marketplace backend (terminal 1)
cd SahayaKISSAN-API/backend && npm install && npm start

# create/activate chatbot env (terminal 2)
cd 07_chatbot/backend
conda env create -f environment.yml   # or: conda create -n chatbot python=3.10 && pip install -r requirements.txt
conda activate chatbot
uvicorn app.main:app --reload --port 8000

# start all frontends (terminal 3)
cd SahayaKISSAN
npm run dev
```

Ports: Buyer 5173, Seller 5174, Chatbot 5175, Marketplace API 3000, Chatbot API 8000.

---
