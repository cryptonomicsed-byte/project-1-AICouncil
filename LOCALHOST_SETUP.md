# AICouncil - Running on Localhost

AICouncil is now running locally without Docker. Here's the complete setup and usage guide.

## ✅ Services Running

### Council Service (FastAPI)
- **URL:** http://localhost:8000
- **Health Check:** http://localhost:8000/health
- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **Process:** Python/Uvicorn
- **Log:** `tail ~/council.log`

### Web Frontend (React + Vite)
- **URL:** http://localhost:5173
- **Dev Server:** Vite with hot reload
- **Process:** Node.js
- **Log:** `tail ~/web.log`

## 🌐 Access the System

### In Your Browser
1. **Frontend:** http://localhost:5173
2. **API Documentation:** http://localhost:8000/docs

### Via Command Line

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Get Available Agents:**
```bash
curl http://localhost:8000/api/council/agents
```

**Get Service Status:**
```bash
curl http://localhost:8000/api/council/status
```

**Run Council Deliberation:**
```bash
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should AI systems be regulated?",
    "context": "Discussion on government oversight",
    "num_agents": 3
  }'
```

## 📝 Monitor Logs

**Council Service logs:**
```bash
tail -f ~/council.log
```

**Frontend logs:**
```bash
tail -f ~/web.log
```

**Check running processes:**
```bash
ps aux | grep -E "python|node" | grep -v grep
```

## 🛑 Stop Services

**Stop all services:**
```bash
killall python node
```

**Or restart using the startup script:**
```bash
cd /data/data/com.termux/files/home/AIcouncil
./start-local.sh
```

## 🚀 Restart Services

**To restart everything:**
```bash
killall python node 2>/dev/null || true
sleep 2
./start-local.sh
```

## 📊 API Endpoints

### Council Deliberation
- **POST** `/api/council/deliberate` - Run deliberation on a topic
- **GET** `/api/council/agents` - List available agents
- **GET** `/api/council/status` - Service status
- **GET** `/api/council/debate` - Start focused debate mode

### Health & Status
- **GET** `/health` - Health check
- **GET** `/` - Root endpoint info
- **GET** `/docs` - Swagger UI documentation

## 🔧 Configuration

Environment variables are loaded from `.env` file. Key variables:

```bash
# Council Service
COUNCIL_PORT=8000                    # Service port (default: 8000)
COUNCIL_DEBUG=false                  # Debug mode (default: false)
COUNCIL_DELIBERATION_TIMEOUT=30      # Timeout in seconds
COUNCIL_MIN_CONSENSUS=0.5            # Minimum consensus score

# API Configuration
LITELLM_BASE_URL=http://localhost:4000/v1
LITELLM_API_KEY=test-key
FALLBACK_MODEL=ollama/llama2
```

## 📦 Dependencies

**Python (Council Service):**
- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- python-dotenv - Environment variables

**Node.js (Frontend):**
- React 18 - UI library
- Vite - Build tool
- Tailwind CSS - Styling
- Axios - HTTP client

## 🧪 Test the System

### 1. Check Health
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy","service":"council","debug":false}
```

### 2. List Agents
```bash
curl http://localhost:8000/api/council/agents | python3 -m json.tool
# Expected: List of 3 agents (Logical Analyzer, Pragmatist, Devil's Advocate)
```

### 3. Run Deliberation
```bash
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test Topic",
    "context": "Test context",
    "num_agents": 3
  }' | python3 -m json.tool
# Expected: Deliberation response with votes, consensus score, and chairman summary
```

### 4. Access API Docs
Open http://localhost:8000/docs in your browser to interactively test all endpoints.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Check what's using port 5173
lsof -i :5173

# Kill and restart
killall python node
sleep 2
./start-local.sh
```

### Services Not Starting
Check the logs:
```bash
cat ~/council.log
cat ~/web.log
```

### Frontend Shows Blank Page
1. Check browser console for errors (F12)
2. Ensure Vite dev server is running: `tail ~/web.log`
3. Try refreshing the page (Cmd/Ctrl + Shift + R)

### API Not Responding
1. Check if Council service is running: `curl http://localhost:8000/health`
2. Check logs: `tail ~/council.log`
3. Restart: `killall python && python services/council/main.py`

## 📚 Documentation

- **Architecture:** See `/docs/ARCHITECTURE.md`
- **API Details:** See `/docs/DEPLOYMENT.md` (includes localhost setup)
- **Testing:** See `/docs/TESTING.md`
- **Contributing:** See `CONTRIBUTING.md`

## 🎯 What's Implemented

### Phase 1: Foundation ✅
- FastAPI Council service with deliberation engine
- Mock agent responses with consensus scoring
- RESTful API with multiple endpoints
- Health check and status endpoints

### Phase 2: Intelligence ✅
- Agent management (list, select by count)
- Confidence metrics for each vote
- Chairman summary generation
- Disagreement severity calculation

### Phase 3-4: Future Enhancements
When Docker is available:
- Document RAG (AnythingLLM)
- Blockchain integration (Arweave, Sui)
- Authentication (Supabase)
- Rate limiting and cost tracking

## 💡 Next Steps

1. **Explore the API:**
   - Open http://localhost:8000/docs
   - Try different endpoints with Swagger UI

2. **Check the Frontend:**
   - Open http://localhost:5173
   - See the React UI in development

3. **Review the Code:**
   - Backend: `/services/council/main.py`
   - Frontend: `/apps/web/src/`

4. **Deploy to Production:**
   - When Docker is available, use `make dev` or `docker compose up`
   - See `docs/DEPLOYMENT.md` for Akash decentralized deployment

## 📞 Support

For issues or questions:
- Check logs: `tail ~/council.log` and `tail ~/web.log`
- Review API docs: http://localhost:8000/docs
- See troubleshooting section above

---

**Status:** ✅ All systems operational on localhost
**Started:** Using startup script: `./start-local.sh`
**Last Updated:** 2025-12-03
