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

# start all frontends (terminal 1)
cd SahayaKISSAN
npm install concurrently --save-dev
npm run dev


# start marketplace backend (terminal 2)
cd SahayaKISSAN-API/backend && npm install && nodemon server.js


#you need python 3.10.11 and go to 07_chatbot/backend
py -3.10 -m venv chatbot_env
source chatbot_env/Scripts/activate
pip install --upgrade pip setuptools wheel

# create/activate chatbot env (terminal 3)
cd 07_chatbot/backend
conda env create -f environment.yml   # or: conda create -n chatbot python=3.10 && pip install -r requirements.txt
conda activate chatbot
uvicorn app.main:app --reload --port 8000
#or
python -m uvicorn app.main:app --reload --port 8000



```

Ports: Buyer 5173, Seller 5174, Chatbot 5175, Marketplace API 3000, Chatbot API 8000.

---
