# Local Setup Guide - AICouncil Command Center

**Run AICouncil Command Center on your local machine**

---

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ & npm
- Python 3.11+
- Git

---

## Installation Steps

### 1. Clone the Repository

```bash
cd ~/projects
git clone https://github.com/jbino85/Council.git AIcouncil
cd AIcouncil
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -e .
```

### 3. Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings (optional - defaults work for local dev)
nano .env
```

Key variables:
```bash
COUNCIL_PORT=8000
COMMANDER_PORT=8001
OPENWEBUI_PORT=8080
LITELLM_BASE_URL=http://localhost:4000/v1
DATABASE_URL=postgresql://user:password@localhost/aicouncil
REDIS_URL=redis://localhost:6379
```

### 4. Start Development Stack

```bash
# Start all services with Docker Compose
make dev

# Or manually with Docker:
docker compose -f deploy/docker/docker-compose.dev.yml up
```

You'll see output like:
```
🏛️  AICouncil Service starting...
🎛️  Command Center starting...
⚡ OpenWebUI starting...
```

---

## Access Points

Once everything is running:

| Service | URL | Port |
|---------|-----|------|
| **Command Center UI** | http://localhost:8080/command-center | 8080 |
| **Council API** | http://localhost:8000 | 8000 |
| **Command Center API** | http://localhost:8001 | 8001 |
| **OpenWebUI** | http://localhost:8080 | 8080 |
| **LiteLLM Proxy** | http://localhost:4000 | 4000 |
| **Ollama** | http://localhost:11434 | 11434 |

---

## Quick Test

### 1. Check Services Are Running

```bash
# In another terminal
curl http://localhost:8001/health

# Should return:
# {"status":"healthy","service":"command-center"}
```

### 2. Access Command Center UI

```bash
# Open in browser
open http://localhost:8080/command-center

# Or on Linux:
xdg-open http://localhost:8080/command-center

# Or Windows:
start http://localhost:8080/command-center
```

### 3. Try First API Call

```bash
# Start a deliberation
curl -X POST http://localhost:8001/api/commander/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "What is the impact of AI on society?",
    "num_agents": 3
  }'

# Should return:
# {
#   "session_id": "sess_abc123",
#   "topic": "What is the impact of AI on society?",
#   "status": "started",
#   "agents_count": 3
# }
```

---

## Common Commands

```bash
# View logs
make logs

# View specific service logs
make logs-council
make logs-litellm

# Stop all services
make down

# Stop and clean everything
make clean

# View running services
make ps

# Access service shell
make shell-council
make shell-python
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find what's using port 8001
lsof -i :8001

# Kill the process
kill -9 <PID>

# Or use different ports in .env
COUNCIL_PORT=8002
COMMANDER_PORT=8003
```

### Docker Daemon Not Running

```bash
# On Mac
open /Applications/Docker.app

# On Linux
sudo systemctl start docker

# On Windows
# Start Docker Desktop from Start menu
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U user -d aicouncil -c "SELECT 1"

# Or use the included postgres container
docker compose up -d postgres
```

### Out of Memory

```bash
# Increase Docker memory limit
# Docker Desktop → Preferences → Resources → Memory
# Set to at least 4GB
```

---

## Development Workflow

### 1. Make Code Changes

Edit files in:
- `services/command-center/main.py` – API endpoints
- `apps/web/src/components/CommandCenter/` – UI components
- `apps/web/src/styles/CommandCenter.css` – Styling

### 2. Hot Reload

Changes automatically reload:
- Python: FastAPI auto-reloads
- React: Vite hot module replacement

### 3. Test Changes

```bash
# Test API endpoint
curl http://localhost:8001/api/commander/council/status

# Check UI in browser
# Refresh the page (Ctrl+R or Cmd+R)
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature-branch
```

---

## Docker Compose Services

The dev environment starts these services:

```yaml
Services:
├── postgres         (Database)
├── redis            (Cache)
├── ollama           (Local LLM)
├── litellm          (API proxy)
├── council          (Council service)
├── command-center   (New! Admin API)
├── openwebui        (Web UI)
└── anything-llm     (RAG service)
```

---

## Environment Variables

### Essential for Command Center

```bash
# Command Center API
COMMANDER_PORT=8001
COMMANDER_API_KEY=your-secure-key
COMMANDER_DEBUG=false

# Council Service
COUNCIL_URL=http://localhost:8000
COUNCIL_PORT=8000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aicouncil
REDIS_URL=redis://localhost:6379

# LiteLLM Proxy
LITELLM_BASE_URL=http://localhost:4000/v1
LITELLM_API_KEY=test-key

# Vector DB
CHROMA_HOST=localhost
CHROMA_PORT=8003

# Features
AUDIT_ENABLED=true
SAML_ENABLED=false
LDAP_ENABLED=false
DATA_RESIDENCY=US
```

---

## Production Deployment

For production on Akash:

```bash
# Build images
make docker-build

# Deploy to Akash testnet
akash tx deployment create deploy/akash/deploy.foundation.yaml

# Deploy to Akash mainnet
akash tx deployment create deploy/akash/deploy.production.yaml
```

See `IMPLEMENTATION_GUIDE.md` for full deployment instructions.

---

## Documentation

| File | Purpose |
|------|---------|
| `START_HERE.md` | Quick start guide |
| `QUICK_REFERENCE.md` | Essential commands |
| `COMMAND_CENTER.md` | Feature overview |
| `docs/COMMAND_CENTER_API.md` | Complete API reference |
| `IMPLEMENTATION_GUIDE.md` | Build remaining services |

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4 GB | 8 GB |
| Disk | 10 GB | 30 GB |
| Docker | 20.10+ | Latest |
| Node.js | 18.0 | 18.18+ |
| Python | 3.11 | 3.11+ |

---

## Getting Help

1. Check logs: `make logs`
2. Read docs: `QUICK_REFERENCE.md`
3. Test API: `curl http://localhost:8001/docs`
4. Check service health: `curl http://localhost:8001/health`

---

## Next Steps

1. ✅ Run `make dev` on your machine
2. ✅ Open http://localhost:8080/command-center
3. ✅ Read `START_HERE.md`
4. ✅ Try first deliberation in UI
5. ✅ Review `IMPLEMENTATION_GUIDE.md` for next phases

---

**Everything is ready. Start with `make dev` on your local machine.**
