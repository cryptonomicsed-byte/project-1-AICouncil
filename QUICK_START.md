# Quick Start Guide – AICouncil

Get the system running in 5 minutes.

## Prerequisites

- Docker & Docker Compose installed
- Git
- 8GB RAM, 10GB disk space

## 1. Clone & Setup

```bash
cd /data/data/com.termux/files/home
git clone https://github.com/jbino85/AIcouncil.git
cd AIcouncil
cp .env.example .env
```

## 2. Configure

Edit `.env` with your API keys:

```bash
nano .env
```

**Required:**
```bash
VENICE_API_KEY=sk-your-key-here      # Get from venice.ai
LITELLM_MASTER_KEY=your-secure-key   # Any random string
```

**Optional (use defaults for testing):**
```bash
SUPABASE_URL=...                      # For authentication
JWT_SECRET=...                        # For tokens
```

## 3. Start Services

```bash
docker compose up
```

Wait 2-3 minutes for services to initialize. You'll see:
```
council       | 🏛️  AICouncil Service starting...
litellm       | INFO:     Uvicorn running on http://0.0.0.0:4000
ollama        | ...
openwebui     | ...
```

## 4. Access Services

| Service | URL | Purpose |
|---------|-----|---------|
| **OpenWebUI** | http://localhost:8080 | Chat interface |
| **Council API** | http://localhost:8000/docs | Deliberation |
| **LiteLLM** | http://localhost:4000/health | API proxy |
| **Ollama** | http://localhost:11434/api/tags | Models |

## 5. Test the Stack

### In Another Terminal:

```bash
# Test Council API
curl http://localhost:8000/health

# Test OpenWebUI
curl http://localhost:8080

# Test deliberation
curl -X POST http://localhost:8000/api/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Should we use automated testing?",
    "context": "We currently have no tests.",
    "num_agents": 3
  }'

# Expected response:
# {
#   "topic": "Should we use automated testing?",
#   "consensus_score": 0.75,
#   "consensus_reached": true,
#   "votes": [...],
#   "chairman_summary": "..."
# }
```

## 6. Use the UI

1. Open http://localhost:8080
2. Type a message: "What is consensus?"
3. Response comes from local Ollama (Venice API as primary)
4. Click ⚡ **Council Mode** button
5. Select agent count (1-10)
6. Ask a question: "Should AI be regulated?"
7. Watch deliberation in real-time
8. See consensus gauge & agent votes

## 7. Run Tests

```bash
# Unit tests
npm test

# Integration tests (requires docker-compose running)
pytest tests/integration/ -v

# Full validation
make test
```

## Common Issues

### Port already in use
```bash
# Find what's using port 8080
lsof -i :8080

# Use different port
OPENWEBUI_PORT=8081 docker compose up
```

### Out of memory
```bash
# Increase Docker memory (Desktop)
# Settings → Resources → Memory: 8GB

# Or reduce model size
OLLAMA_MODELS=mistral docker compose up
```

### Venice API timeout
```bash
# Ensure you have correct API key in .env
VENICE_API_KEY=sk-your-actual-key

# Increase timeout (in services/council/main.py)
COUNCIL_DELIBERATION_TIMEOUT=60
```

### Services won't start
```bash
# Check logs
docker compose logs -f

# Clean rebuild
docker compose down -v
docker compose build --no-cache
docker compose up
```

## Next Steps

1. **Read documentation:** Start with `/docs/ARCHITECTURE.md`
2. **Try local testing:** Run `pytest tests/integration/ -v`
3. **Deploy to testnet:** Follow `/docs/DEPLOYMENT.md`
4. **Add features:** See `/CONTRIBUTING.md`

## Project Structure

```
AICouncil/
├── apps/web/              # Frontend (React)
├── services/              # 7 microservices
├── deploy/docker/         # Docker Compose configs
├── docs/                  # Documentation
├── tests/                 # Test suites
└── Makefile              # Dev commands
```

## Useful Commands

```bash
make dev              # Start development stack
make test             # Run all tests
make lint             # Check code quality
make logs             # View service logs
make clean            # Reset everything
```

## Production Deployment

When ready for production:

```bash
# 1. Review configuration
less docs/DEPLOYMENT.md

# 2. Deploy to Akash
akash tx deployment create deploy/akash/deploy.production.yaml

# 3. Monitor
akash provider lease-status $DEPLOYMENT_ID $PROVIDER
```

## Support

- **Docs:** Check `/docs` folder
- **Issues:** GitHub issues page
- **Discord:** Community channel
- **Email:** support@aicouncil.dev

---

**That's it! You now have AICouncil running locally. 🎉**

Next: Read `/docs/ARCHITECTURE.md` to understand the system.
