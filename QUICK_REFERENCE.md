# Command Center Quick Reference Card

**Essential commands & endpoints at a glance**

---

## Start Everything

```bash
cd AIcouncil
make dev  # Starts all services including command-center on port 8001
```

---

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Command Center UI | `http://localhost:8080/command-center` | Web dashboard |
| API Docs | `http://localhost:8001/docs` | Interactive API docs |
| API Base | `http://localhost:8001/api/commander` | REST API |
| Health Check | `http://localhost:8001/health` | Service status |

---

## Essential API Endpoints

### Council Operations

```bash
# Start deliberation
curl -X POST http://localhost:8001/api/commander/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Your question here",
    "num_agents": 3
  }'

# List sessions
curl http://localhost:8001/api/commander/council/sessions

# Get session details
curl http://localhost:8001/api/commander/council/session/{session_id}

# List agents
curl http://localhost:8001/api/commander/council/agents

# Create custom agent
curl -X POST http://localhost:8001/api/commander/council/agents \
  -d '{
    "name": "Agent Name",
    "description": "What it does",
    "system_prompt": "Instructions",
    "expertise": ["expertise1"]
  }'

# Get agent performance
curl http://localhost:8001/api/commander/council/agents/{agent_id}/performance
```

### RAG Management

```bash
# Upload document
curl -X POST http://localhost:8001/api/commander/rag/documents \
  -d '{
    "name": "document.pdf",
    "content": "file content",
    "collection": "default"
  }'

# List documents
curl http://localhost:8001/api/commander/rag/documents

# Semantic search
curl -X POST http://localhost:8001/api/commander/rag/search \
  -d '{"query": "search terms"}'

# Vector DB health
curl http://localhost:8001/api/commander/rag/vector-db/health
```

### Analytics

```bash
# Consensus trends
curl http://localhost:8001/api/commander/analytics/consensus/trends?days=7

# Agent rankings
curl http://localhost:8001/api/commander/analytics/agents/ranking

# Cost summary
curl http://localhost:8001/api/commander/analytics/costs/summary

# Usage overview
curl http://localhost:8001/api/commander/analytics/usage/overview
```

### Users & Auth

```bash
# List users
curl http://localhost:8001/api/commander/users

# Create user
curl -X POST http://localhost:8001/api/commander/users \
  -d '{
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }'

# Configure SAML
curl -X POST http://localhost:8001/api/commander/auth/saml/config \
  -d '{
    "entity_id": "your-entity-id",
    "sso_url": "https://your-sso-url"
  }'
```

### Audit & Logs

```bash
# View audit logs
curl http://localhost:8001/api/commander/audit/logs

# Filter by action
curl http://localhost:8001/api/commander/audit/logs?action=deliberate

# Export logs
curl -X POST http://localhost:8001/api/commander/audit/logs/export \
  -d '{"format": "csv"}'
```

### System

```bash
# System health
curl http://localhost:8001/api/commander/system/health

# Resource usage
curl http://localhost:8001/api/commander/system/resources

# Configuration
curl http://localhost:8001/api/commander/system/config

# Trigger backup
curl -X POST http://localhost:8001/api/commander/system/backup
```

---

## WebSocket Connections

```bash
# Install wscat
npm install -g wscat

# Council session updates
wscat -c ws://localhost:8001/ws/commander/council/session/{session_id}

# System metrics
wscat -c ws://localhost:8001/ws/commander/system/metrics

# Audit events
wscat -c ws://localhost:8001/ws/commander/audit/live

# RAG indexing progress
wscat -c ws://localhost:8001/ws/commander/rag/indexing/{collection_id}

# Workflow execution
wscat -c ws://localhost:8001/ws/commander/workflow/{workflow_id}
```

---

## Common Tasks

### Start a Deliberation
1. Open `http://localhost:8080/command-center`
2. Go to **Operations** tab
3. Enter topic in text area
4. Set number of agents (1-10)
5. Click **Start Deliberation**
6. Monitor in Operations Panel or via WebSocket

### Create Custom Agent
1. Go to **Agent Marketplace** tab
2. Click **+ Create Custom Agent**
3. Fill in:
   - Name
   - Description
   - System Prompt (instructions)
   - Category
   - Expertise tags
4. Click **Create Agent**

### Upload Documents for RAG
1. Go to **RAG Manager** tab
2. In Upload section:
   - Select file (PDF/TXT/MD)
   - Choose collection
   - Click **Upload Document**
3. Monitor indexing status
4. Search documents with Semantic Search

### Create Scheduled Workflow
1. Go to **Workflows** tab
2. Click **+ Create Workflow**
3. Set:
   - Name
   - Description
   - Schedule (cron format: `0 9 * * *`)
4. Click **Create**
5. Execute manually or wait for schedule

### View Analytics
1. Go to **Analytics** tab
2. View:
   - Consensus trends (7-day average)
   - Agent rankings (top 5)
   - Cost summary (by model)
   - Usage overview (sessions, users)

### Check Audit Log
1. Go to **Audit Log** tab
2. Filter by:
   - Actor
   - Action
   - Date range
3. Click **Export** to download as CSV

---

## Configuration (.env)

```bash
# Copy example
cp .env.example .env

# Set API key
COMMANDER_API_KEY=your-secure-key

# Set ports
COMMANDER_PORT=8001
COUNCIL_PORT=8000
LITELLM_BASE_URL=http://localhost:4000/v1

# Vector DB
CHROMA_HOST=localhost
CHROMA_PORT=8003

# Enterprise
SAML_ENABLED=false
LDAP_ENABLED=false
DATA_RESIDENCY=US  # US or EU

# Database
DATABASE_URL=postgresql://user:password@localhost/aicouncil
REDIS_URL=redis://localhost:6379
```

---

## Common Errors & Fixes

### "Connection refused" on port 8001
```bash
# Check if service is running
docker ps | grep command-center

# Check logs
docker logs aicouncil-command-center

# Restart
make down
make dev
```

### "Vector DB health check failed"
```bash
# Verify Chroma is running
curl http://localhost:8003/health

# Check environment
echo $CHROMA_HOST  # Should be localhost
echo $CHROMA_PORT  # Should be 8003
```

### "Database connection error"
```bash
# Check PostgreSQL
psql -U user -d aicouncil -c "SELECT 1"

# Check connection string
echo $DATABASE_URL
```

### "API returns 401 Unauthorized"
```bash
# Verify API key in request
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:8001/api/commander/system/health
```

---

## Development Commands

```bash
# Start all services
make dev

# Stop all services
make down

# View logs
make logs

# Run tests
make test

# Format code
make format

# Lint code
make lint

# Clean everything
make clean

# Build Docker images
make docker-build
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `COMMAND_CENTER.md` | Overview & features |
| `docs/COMMAND_CENTER_API.md` | Complete API reference |
| `IMPLEMENTATION_GUIDE.md` | Step-by-step roadmap |
| `ENHANCEMENTS_SUMMARY.md` | What's been created |
| `QUICK_REFERENCE.md` | This file |

---

## Response Examples

### Deliberation Response
```json
{
  "session_id": "sess_abc123",
  "topic": "Impact of AI",
  "status": "started",
  "agents_count": 3,
  "started_at": "2025-12-03T10:30:00Z",
  "estimated_duration": 30
}
```

### Agent Performance
```json
{
  "agent_id": "agent_logic",
  "accuracy": 0.94,
  "avg_latency_ms": 450,
  "decision_count": 234,
  "agreement_score": 0.87,
  "trend": "improving"
}
```

### Consensus Metrics
```json
{
  "current_score": 0.78,
  "avg_past_7d": 0.76,
  "sessions_today": 12,
  "high_disagreement_count": 2,
  "threshold": 0.5
}
```

### Search Results
```json
{
  "query": "search terms",
  "results": [
    {
      "document_id": "doc_123",
      "chunk_id": "chunk_45",
      "similarity": 0.92,
      "content": "relevant excerpt..."
    }
  ],
  "total": 3
}
```

---

## Performance Tips

1. **Limit session results:** Use `?limit=50` in list endpoints
2. **Cache searches:** Vector DB caches embeddings
3. **Batch operations:** Use `/batch` endpoints for multiple items
4. **Stream large results:** Use WebSocket for real-time updates
5. **Set appropriate timeouts:** Most operations complete in <5s

---

## Security Notes

- Always use HTTPS in production
- Store API keys securely (use environment variables)
- Enable SAML/LDAP for enterprise
- Set data residency (US/EU compliance)
- Enable audit logging
- Rotate API keys regularly
- Use strong database passwords

---

## Production Deployment

```bash
# Build production images
docker compose -f deploy/docker/docker-compose.yml build

# Start production stack
docker compose -f deploy/docker/docker-compose.yml up -d

# View logs
docker compose -f deploy/docker/docker-compose.yml logs -f

# Deploy to Akash
akash tx deployment create deploy/akash/deploy.production.yaml
```

---

**For complete details, see documentation files in `/docs` and root directory.**

