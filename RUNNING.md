# AICouncil - System Running

## ✅ Status: OPERATIONAL

AICouncil is currently running on your local machine with all core services active.

### Active Services

#### 1. Council Service (FastAPI)
- **Port:** 8000
- **Status:** ✅ Running
- **URL:** http://localhost:8000
- **Health Check:** http://localhost:8000/health
- **API Docs:** http://localhost:8000/docs
- **Log:** `tail ~/council.log`

#### 2. Web Frontend (React/Vite)
- **Port:** 5173
- **Status:** ✅ Running
- **URL:** http://localhost:5173
- **Dev Server:** Hot reload enabled
- **Log:** `tail ~/web.log`

## 🌐 Quick Access

### In Your Browser
1. **Frontend:** http://localhost:5173
2. **API Docs:** http://localhost:8000/docs (interactive testing)

### From Command Line
```bash
# Test health
curl http://localhost:8000/health

# Get agents
curl http://localhost:8000/api/council/agents

# Test deliberation
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","num_agents":3}'
```

## 📊 API Endpoints

### Council Operations
- `GET /api/council/agents` - List available agents
- `GET /api/council/status` - Service status
- `POST /api/council/deliberate` - Run deliberation
- `POST /api/council/debate` - Start debate mode

### Health & Info
- `GET /health` - Health check
- `GET /` - Root info
- `GET /docs` - Swagger UI documentation

## 📝 Logs

```bash
# Council service logs
tail -f ~/council.log

# Frontend logs
tail -f ~/web.log

# Watch both
watch -n 0.5 'echo "=== COUNCIL ===" && tail -5 ~/council.log && echo "" && echo "=== FRONTEND ===" && tail -5 ~/web.log'
```

## 🛑 Control Services

### Stop
```bash
killall python node
```

### Restart
```bash
./start-local.sh
```

### Check Status
```bash
ps aux | grep -E "python|node" | grep -v grep
```

## 🔍 Verify Everything Works

Run this test script:
```bash
#!/bin/bash
echo "Testing AICouncil..."
echo ""

echo "1. Health Check"
curl -s http://localhost:8000/health | python3 -m json.tool
echo ""

echo "2. Agent List"
curl -s http://localhost:8000/api/council/agents | python3 -m json.tool | head -20
echo ""

echo "3. Deliberation Test"
curl -s -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test Topic","num_agents":3}' | python3 -m json.tool
echo ""

echo "✅ All tests passed!"
```

## 🚀 Next Steps

1. **Explore the UI**
   - Open http://localhost:5173
   - Check the frontend design

2. **Test the API**
   - Open http://localhost:8000/docs
   - Use Swagger UI to test endpoints

3. **Review the Code**
   - Backend: `cat services/council/main.py`
   - Frontend: `cat apps/web/src/`

4. **Monitor Performance**
   - Check logs in real-time
   - Use `curl` to measure response times

## 📚 Documentation

- **Setup:** `LOCALHOST_SETUP.md`
- **Status:** `PROJECT_STATUS.md`
- **Architecture:** `docs/ARCHITECTURE.md`
- **Deployment:** `docs/DEPLOYMENT.md`

## ⚙️ Configuration

Edit `.env` to customize:
```bash
COUNCIL_PORT=8000
COUNCIL_DEBUG=false
COUNCIL_DELIBERATION_TIMEOUT=30
COUNCIL_MIN_CONSENSUS=0.5
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
lsof -i :8000
lsof -i :5173
# Then killall python node
```

### Services Not Responding
```bash
# Check logs
tail ~/council.log
tail ~/web.log

# Verify running
ps aux | grep -E "python|node" | grep -v grep

# Restart if needed
killall python node
./start-local.sh
```

### Frontend Blank
1. Check console (F12)
2. Hard refresh (Ctrl+Shift+R)
3. Check `tail ~/web.log` for errors
4. Restart: `killall node && cd apps/web && npm run dev`

## 📦 System Requirements

- Python 3.10+
- Node.js 18+
- npm or yarn
- 2GB RAM available
- Ports 8000 and 5173 available

## 🎯 Current Implementation

**Phase 1 & 2: Complete**
- ✅ FastAPI deliberation engine
- ✅ Multi-agent consensus system
- ✅ RESTful API (5+ endpoints)
- ✅ React frontend framework
- ✅ Real-time API responses
- ✅ Health checks and monitoring

**Phase 3 & 4: Structures Ready**
- Framework for RAG (AnythingLLM)
- Configuration for blockchain (Arweave, Sui)
- Auth structure (Supabase)
- Rate limiting design

When Docker becomes available:
- Run `docker compose up` for full stack
- All microservices will be containerized
- Additional services (RAG, archival, blockchain) will be activated

## 💻 System Info

```bash
# Your system details
python3 --version
node --version
npm --version

# Verify running processes
ps aux | grep -E "python main.py|vite" | grep -v grep
```

## 🚪 Access Points

| Service | URL | Type | Status |
|---------|-----|------|--------|
| Frontend | http://localhost:5173 | UI | ✅ Running |
| API Base | http://localhost:8000 | REST | ✅ Running |
| API Docs | http://localhost:8000/docs | Swagger | ✅ Ready |
| Health | http://localhost:8000/health | JSON | ✅ Healthy |

## 📞 Support

If systems stop working:
1. Check logs: `tail ~/council.log` and `tail ~/web.log`
2. Restart: `killall python node && ./start-local.sh`
3. Verify ports: `lsof -i :8000 && lsof -i :5173`
4. Review: `docs/DEPLOYMENT.md` for setup details

---

**System Status:** ✅ OPERATIONAL
**Last Updated:** 2025-12-03
**Edition:** Localhost (Non-Docker)

For more details, see LOCALHOST_SETUP.md
