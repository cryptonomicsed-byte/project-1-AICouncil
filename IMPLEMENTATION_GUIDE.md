# Command Center Implementation Guide

**Complete roadmap for deploying all enhancements**

---

## Overview

This guide walks through implementing all enhancements including:

- ✅ **Phase 3b** – Advanced RAG (vector DB, semantic search, multi-language, PDF extraction)
- ✅ **Phase 3c** – Advanced Rituals (custom agents, marketplace, scheduling, batch)
- ✅ **Phase 4b** – Enterprise Features (SAML/LDAP, audit logging, data residency, SLAs)
- ✅ **Phase 4c** – Analytics (consensus trends, agent ranking, cost forecasting)

**Total:** 100+ API endpoints, 8 React components, 5 microservices

---

## Architecture

### New Services

```
services/
├── command-center/          ✅ CREATED
│   ├── main.py              - FastAPI with 100+ endpoints
│   ├── requirements.txt
│   └── Dockerfile
│
├── vector-db/               📝 TODO
│   ├── main.py              - Chroma wrapper service
│   └── requirements.txt
│
├── analytics/               📝 TODO
│   ├── main.py              - Metrics aggregation
│   ├── models.py            - Data models
│   └── requirements.txt
│
├── audit-logger/            📝 TODO
│   ├── main.py              - Activity tracking
│   └── requirements.txt
│
└── workflow-scheduler/      📝 TODO
    ├── main.py              - Job scheduling
    └── requirements.txt
```

### Frontend Components

```
apps/web/src/
├── pages/
│   └── CommandCenter.tsx     ✅ CREATED
│
└── components/CommandCenter/
    ├── Header.tsx           ✅ CREATED
    ├── Navigation.tsx       ✅ CREATED
    ├── OperationsPanel.tsx  ✅ CREATED
    ├── AgentMarketplace.tsx ✅ CREATED
    ├── RAGManager.tsx       ✅ CREATED
    ├── UserManagement.tsx   ✅ CREATED
    ├── AnalyticsDash.tsx    ✅ CREATED
    ├── AuditLog.tsx         ✅ CREATED
    └── WorkflowBuilder.tsx  ✅ CREATED
```

---

## Implementation Phases

### Phase 1: Foundation (Already Complete)
- ✅ Command Center API (`services/command-center`)
- ✅ Command Center UI (all 8 React components)
- ✅ 100+ endpoint specifications
- ✅ Comprehensive API documentation

**Status:** Ready to extend with microservices

---

### Phase 2: Vector Database Service (Days 1-3)

#### 2.1 Create Vector DB Service

```bash
mkdir -p services/vector-db
touch services/vector-db/{main.py,requirements.txt,Dockerfile}
```

**services/vector-db/requirements.txt:**
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
chromadb==0.4.11
sentence-transformers==2.2.2
pydantic==2.5.0
python-dotenv==1.0.0
```

**services/vector-db/main.py:**
```python
"""Vector Database Service - Chroma wrapper"""

from fastapi import FastAPI
import chromadb
from chromadb.config import Settings

app = FastAPI(title="Vector DB Service")

# Initialize Chroma client
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="/data/chroma",
    anonymized_telemetry=False
))

@app.post("/collections")
async def create_collection(name: str):
    """Create vector collection"""
    collection = client.create_collection(name=name)
    return {"id": name, "status": "created"}

@app.post("/collections/{name}/add")
async def add_embeddings(name: str, documents: list, embeddings: list):
    """Add embeddings to collection"""
    collection = client.get_collection(name=name)
    collection.add(
        documents=documents,
        embeddings=embeddings,
        ids=[f"doc_{i}" for i in range(len(documents))]
    )
    return {"status": "added", "count": len(documents)}

@app.post("/search")
async def search(collection: str, query_embedding: list, n_results: int = 10):
    """Semantic search"""
    coll = client.get_collection(collection)
    results = coll.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )
    return results

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}
```

#### 2.2 Integrate with Command Center

Update `services/command-center/main.py`:

```python
# Add to imports
import httpx

# Add endpoint
@app.post("/rag/documents/{doc_id}/index")
async def index_document_in_vector_db(doc_id: str):
    """Index document in vector DB"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{config.vector_db_url}/collections/default/add",
            json={"documents": [doc_id], "embeddings": []}
        )
    return response.json()
```

---

### Phase 3: Analytics Service (Days 4-6)

#### 3.1 Create Analytics Service

**services/analytics/main.py:**

```python
"""Analytics Service - Metrics aggregation"""

from fastapi import FastAPI
from datetime import datetime, timedelta
import asyncpg

app = FastAPI(title="Analytics Service")

class Analytics:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
    
    async def get_consensus_trends(self, days: int = 7):
        """Fetch consensus trends over time"""
        conn = await asyncpg.connect(self.db_url)
        rows = await conn.fetch("""
            SELECT DATE(created_at) as date, AVG(consensus_score) as score
            FROM sessions
            WHERE created_at > NOW() - INTERVAL '{} days'
            GROUP BY DATE(created_at)
            ORDER BY date
        """.format(days))
        await conn.close()
        return rows
    
    async def get_agent_rankings(self):
        """Get agent performance ranking"""
        conn = await asyncpg.connect(self.db_url)
        rows = await conn.fetch("""
            SELECT 
                agent_id,
                AVG(confidence) as score,
                COUNT(*) as decisions
            FROM votes
            GROUP BY agent_id
            ORDER BY score DESC
            LIMIT 10
        """)
        await conn.close()
        return rows
    
    async def get_cost_summary(self):
        """Calculate costs by model"""
        conn = await asyncpg.connect(self.db_url)
        rows = await conn.fetch("""
            SELECT 
                model,
                SUM(cost) as total_cost,
                COUNT(*) as requests
            FROM api_calls
            WHERE DATE(created_at) = CURRENT_DATE
            GROUP BY model
        """)
        await conn.close()
        return rows

analytics = Analytics()

@app.get("/consensus/trends")
async def consensus_trends(days: int = 7):
    """Get consensus trends"""
    data = await analytics.get_consensus_trends(days)
    return {"data": data, "period_days": days}

@app.get("/agents/ranking")
async def agent_ranking():
    """Get agent performance ranking"""
    data = await analytics.get_agent_rankings()
    return {"ranking": data}

@app.get("/costs/summary")
async def cost_summary():
    """Get cost summary"""
    data = await analytics.get_cost_summary()
    return {"costs": data}
```

---

### Phase 4: Audit Logger Service (Days 7-9)

#### 4.1 Create Audit Service

**services/audit-logger/main.py:**

```python
"""Audit Logger Service - Compliance & activity tracking"""

from fastapi import FastAPI
import asyncpg
from datetime import datetime

app = FastAPI(title="Audit Logger")

class AuditLog:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
    
    async def log_action(self, actor: str, action: str, resource: str, status: str, details: dict = None):
        """Log action to database"""
        conn = await asyncpg.connect(self.db_url)
        await conn.execute("""
            INSERT INTO audit_logs (actor, action, resource, status, details, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6)
        """, actor, action, resource, status, details, datetime.utcnow())
        await conn.close()
    
    async def get_logs(self, limit: int = 100, actor: str = None, action: str = None):
        """Retrieve audit logs"""
        conn = await asyncpg.connect(self.db_url)
        
        query = "SELECT * FROM audit_logs WHERE 1=1"
        params = []
        
        if actor:
            query += " AND actor = ${}".format(len(params) + 1)
            params.append(actor)
        
        if action:
            query += " AND action = ${}".format(len(params) + 1)
            params.append(action)
        
        query += " ORDER BY timestamp DESC LIMIT {}".format(limit)
        
        rows = await conn.fetch(query, *params)
        await conn.close()
        return rows

logger = AuditLog()

@app.post("/log")
async def log_action(actor: str, action: str, resource: str, status: str, details: dict = None):
    """Log an action"""
    await logger.log_action(actor, action, resource, status, details)
    return {"status": "logged"}

@app.get("/logs")
async def get_logs(limit: int = 100, actor: str = None, action: str = None):
    """Get audit logs"""
    data = await logger.get_logs(limit, actor, action)
    return {"logs": data, "total": len(data)}

@app.post("/export")
async def export_logs(format: str = "csv"):
    """Export logs"""
    # Implementation for CSV/JSON export
    return {"status": "exporting", "format": format}
```

---

### Phase 5: Workflow Scheduler (Days 10-12)

#### 5.1 Create Scheduler Service

**services/workflow-scheduler/main.py:**

```python
"""Workflow Scheduler Service - Job scheduling & execution"""

from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
import asyncpg
from croniter import croniter

app = FastAPI(title="Workflow Scheduler")

scheduler = BackgroundScheduler()

class WorkflowScheduler:
    def __init__(self):
        self.db_url = os.getenv("DATABASE_URL")
    
    async def create_workflow(self, name: str, schedule: str, steps: list):
        """Create scheduled workflow"""
        conn = await asyncpg.connect(self.db_url)
        workflow_id = await conn.fetchval("""
            INSERT INTO workflows (name, schedule, steps, enabled)
            VALUES ($1, $2, $3, true)
            RETURNING id
        """, name, schedule, steps)
        
        # Schedule the job
        self.schedule_workflow(workflow_id, schedule)
        
        await conn.close()
        return workflow_id
    
    def schedule_workflow(self, workflow_id: str, cron_expr: str):
        """Schedule workflow with cron expression"""
        cron = croniter(cron_expr)
        next_run = cron.get_next(datetime)
        
        scheduler.add_job(
            self.execute_workflow,
            'cron',
            **croniter(cron_expr).get_cron_fields(),
            args=[workflow_id]
        )
    
    async def execute_workflow(self, workflow_id: str):
        """Execute workflow"""
        # Call council service for deliberation, RAG for search, etc.
        pass

scheduler_service = WorkflowScheduler()

@app.post("/workflows")
async def create_workflow(name: str, schedule: str, steps: list):
    """Create workflow"""
    workflow_id = await scheduler_service.create_workflow(name, schedule, steps)
    return {"id": workflow_id, "status": "scheduled"}

@app.post("/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str):
    """Execute workflow immediately"""
    await scheduler_service.execute_workflow(workflow_id)
    return {"workflow_id": workflow_id, "status": "started"}

scheduler.start()
```

---

## Docker Compose Updates

Update `deploy/docker/docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  # ... existing services ...

  # Command Center
  command-center:
    build: ../../services/command-center
    ports:
      - "8001:8001"
    environment:
      COMMANDER_PORT: 8001
      COMMANDER_DEBUG: "true"
      COUNCIL_URL: http://council:8000
      CHROMA_HOST: chroma
      CHROMA_PORT: 8003
    depends_on:
      - postgres
      - redis
      - chroma
    networks:
      - aicouncil

  # Vector Database
  chroma:
    image: chromadb/chroma:latest
    ports:
      - "8003:8000"
    environment:
      CHROMA_DB_IMPL: "duckdb+parquet"
      PERSIST_DIRECTORY: "/data/chroma"
    volumes:
      - chroma_data:/data/chroma
    networks:
      - aicouncil

  # Analytics Service
  analytics:
    build: ../../services/analytics
    ports:
      - "8005:8000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/aicouncil
    depends_on:
      - postgres
    networks:
      - aicouncil

  # Audit Logger
  audit-logger:
    build: ../../services/audit-logger
    ports:
      - "8006:8000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/aicouncil
    depends_on:
      - postgres
    networks:
      - aicouncil

  # Workflow Scheduler
  workflow-scheduler:
    build: ../../services/workflow-scheduler
    ports:
      - "8007:8000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/aicouncil
    depends_on:
      - postgres
    networks:
      - aicouncil

volumes:
  chroma_data:

networks:
  aicouncil:
    driver: bridge
```

---

## Environment Variables

Add to `.env.example`:

```bash
# Command Center
COMMANDER_PORT=8001
COMMANDER_API_KEY=your-secure-key
COMMANDER_DEBUG=false

# Vector Database
CHROMA_HOST=localhost
CHROMA_PORT=8003
CHROMA_PERSIST_DIR=/data/chroma

# Analytics
ANALYTICS_PORT=8005

# Audit
AUDIT_PORT=8006
AUDIT_RETENTION_DAYS=365

# Workflow
SCHEDULER_PORT=8007

# Enterprise
SAML_ENABLED=false
LDAP_ENABLED=false
DATA_RESIDENCY=US

# Databases
ANALYTICS_DATABASE_URL=postgresql://user:pass@localhost/analytics
AUDIT_DATABASE_URL=postgresql://user:pass@localhost/audit
SCHEDULER_DATABASE_URL=postgresql://user:pass@localhost/scheduler
```

---

## Database Migrations

Create schema for analytics, audit, scheduler:

```sql
-- analytics.sql
CREATE TABLE IF NOT EXISTS consensus_trends (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- audit_logs.sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor VARCHAR(255),
    action VARCHAR(255),
    resource VARCHAR(255),
    status VARCHAR(255),
    details JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- workflows.sql
CREATE TABLE IF NOT EXISTS workflows (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    schedule VARCHAR(255),
    steps JSONB,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Testing

### Unit Tests

```bash
# Test command center
pytest services/command-center/tests/test_main.py -v

# Test analytics
pytest services/analytics/tests/test_analytics.py -v

# Test audit logger
pytest services/audit-logger/tests/test_audit.py -v
```

### Integration Tests

```bash
# Full stack
docker compose -f deploy/docker/docker-compose.test.yml up

# Run tests
pytest tests/integration/ -v
```

---

## Deployment

### Local Development

```bash
# Start all services
make dev

# Access Command Center
open http://localhost:8080/command-center
```

### Production (Akash)

Update `deploy/akash/deploy.production.yaml` with new services:

```yaml
services:
  command-center:
    image: your-registry/command-center:latest
    expose:
      - port: 8001
        as: 8001
        to:
          - global: true
    
  chroma:
    image: chromadb/chroma:latest
    expose:
      - port: 8000
        as: 8003
        to:
          - global: true

  # ... other services ...
```

Deploy:
```bash
akash tx deployment create deploy/akash/deploy.production.yaml
```

---

## Verification Checklist

- [ ] All 100+ API endpoints working
- [ ] Command Center UI fully functional
- [ ] Vector DB indexing documents
- [ ] Analytics aggregating metrics
- [ ] Audit logging all actions
- [ ] Workflow scheduler executing jobs
- [ ] All components integrated
- [ ] Tests passing (unit + integration)
- [ ] Documentation complete
- [ ] Docker images building
- [ ] Environment variables configured
- [ ] Akash deployment tested

---

## Next Steps

1. **Day 1-3:** Implement Vector DB service & Chroma integration
2. **Day 4-6:** Build Analytics service with PostgreSQL
3. **Day 7-9:** Create Audit Logger with compliance features
4. **Day 10-12:** Implement Workflow Scheduler with cron support
5. **Day 13-15:** Integration testing & debugging
6. **Day 16-20:** Production hardening & deployment

---

## Support & Troubleshooting

### Common Issues

**Command Center API not starting:**
```bash
# Check logs
docker logs aicouncil-command-center

# Verify port not in use
lsof -i :8001
```

**Vector DB connection error:**
```bash
# Verify Chroma is running
curl http://localhost:8003/health

# Check environment variables
docker exec aicouncil-command-center env | grep CHROMA
```

**Database migrations failed:**
```bash
# Run migrations manually
psql -U user -d aicouncil -f services/audit-logger/migrations.sql
```

---

**Ready to implement all enhancements for complete council control.**

