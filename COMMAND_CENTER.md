# AICouncil Command Center – Full Control Dashboard

**Status:** In Development  
**Version:** 2.0-enhanced  
**Date:** 2025-12-03

---

## Overview

The Command Center is a comprehensive administrative dashboard providing **full control** over:

1. **Council Operations** – Real-time deliberation monitoring, agent management, session history
2. **Advanced RAG** – Vector database management, semantic search, document pipelines
3. **Agent Marketplace** – Custom agent creation, workflow scheduling, batch operations
4. **Enterprise Features** – User management, audit logging, data residency, SLAs
5. **Analytics & Insights** – Consensus trends, agent performance, cost forecasting, usage dashboards

---

## Architecture

### Services Added

```
services/
├── command-center/          # NEW: Central admin API
│   ├── main.py              # FastAPI command router
│   ├── models.py            # Command schemas
│   ├── handlers/            # Operation handlers
│   │   ├── council.py       # Council control
│   │   ├── rag.py           # RAG management
│   │   ├── agents.py        # Agent lifecycle
│   │   ├── users.py         # User & tenant management
│   │   └── analytics.py     # Analytics & reporting
│   └── requirements.txt
│
├── vector-db/               # NEW: Vector DB service (Chroma/Weaviate)
│   ├── main.py
│   └── requirements.txt
│
├── analytics/               # NEW: Analytics aggregation
│   ├── main.py
│   ├── models.py
│   └── requirements.txt
│
├── audit-logger/            # NEW: Enterprise audit trail
│   ├── main.py
│   └── requirements.txt
│
└── workflow-scheduler/      # NEW: Batch jobs & scheduling
    ├── main.py
    └── requirements.txt
```

### Frontend Components Added

```
apps/web/src/
├── pages/
│   └── CommandCenter.tsx        # NEW: Main dashboard
│
├── components/
│   ├── CommandCenter/
│   │   ├── Header.tsx           # Title & quick stats
│   │   ├── Navigation.tsx       # Sidebar navigation
│   │   ├── OperationsPanel.tsx  # Council control
│   │   ├── AgentMarketplace.tsx # Agent management
│   │   ├── RAGManager.tsx       # Document & vector DB
│   │   ├── UserManagement.tsx   # SAML/LDAP users
│   │   ├── AnalyticsDash.tsx    # Metrics & insights
│   │   ├── AuditLog.tsx         # Activity trail
│   │   └── WorkflowBuilder.tsx  # Ritual scheduling
│   │
│   └── (existing components)
│
└── (existing structure)
```

---

## API Endpoints (100+)

### 1. COUNCIL OPERATIONS (`/api/commander/council`)

#### Deliberation Control
- `POST /api/commander/council/deliberate` – Trigger deliberation
- `GET /api/commander/council/session/{id}` – Get session details
- `GET /api/commander/council/sessions?status=active` – List sessions
- `PATCH /api/commander/council/session/{id}/pause` – Pause deliberation
- `PATCH /api/commander/council/session/{id}/resume` – Resume deliberation
- `DELETE /api/commander/council/session/{id}` – Cancel session
- `GET /api/commander/council/session/{id}/transcript` – Get full transcript
- `POST /api/commander/council/session/{id}/interrupt` – Force halt
- `POST /api/commander/council/session/{id}/broadcast` – Notify agents

#### Agent Management
- `GET /api/commander/council/agents` – List all agents
- `POST /api/commander/council/agents` – Register custom agent
- `GET /api/commander/council/agents/{id}` – Get agent details
- `PATCH /api/commander/council/agents/{id}` – Update agent config
- `DELETE /api/commander/council/agents/{id}` – Remove agent
- `POST /api/commander/council/agents/{id}/test` – Test agent
- `GET /api/commander/council/agents/{id}/performance` – Agent metrics
- `POST /api/commander/council/agents/{id}/enable` – Enable agent
- `POST /api/commander/council/agents/{id}/disable` – Disable agent
- `GET /api/commander/council/agents/{id}/history` – Agent decisions

#### Voting & Consensus
- `POST /api/commander/council/consensus/recompute` – Recalculate scores
- `GET /api/commander/council/consensus/metrics` – Current metrics
- `PATCH /api/commander/council/consensus/threshold` – Adjust threshold
- `POST /api/commander/council/votes/override` – Admin override
- `GET /api/commander/council/disagreements` – List high-disagreement sessions

---

### 2. RAG MANAGEMENT (`/api/commander/rag`)

#### Document Management
- `POST /api/commander/rag/documents` – Upload document
- `GET /api/commander/rag/documents` – List documents
- `GET /api/commander/rag/documents/{id}` – Get document metadata
- `PATCH /api/commander/rag/documents/{id}` – Update metadata
- `DELETE /api/commander/rag/documents/{id}` – Delete document
- `POST /api/commander/rag/documents/{id}/index` – Re-index document
- `GET /api/commander/rag/documents/{id}/chunks` – Get chunks
- `POST /api/commander/rag/documents/batch` – Batch upload
- `GET /api/commander/rag/documents?indexed=true` – Filter by status
- `POST /api/commander/rag/documents/{id}/extract-metadata` – Auto-metadata

#### Vector Database
- `POST /api/commander/rag/collections` – Create collection
- `GET /api/commander/rag/collections` – List collections
- `DELETE /api/commander/rag/collections/{id}` – Delete collection
- `POST /api/commander/rag/collections/{id}/sync` – Sync to vector DB
- `GET /api/commander/rag/collections/{id}/stats` – Collection stats
- `POST /api/commander/rag/search` – Semantic search
- `POST /api/commander/rag/search/hybrid` – Hybrid search (keyword + semantic)
- `GET /api/commander/rag/search/suggestions` – Query suggestions
- `POST /api/commander/rag/embeddings/recompute` – Recompute embeddings
- `GET /api/commander/rag/vector-db/health` – Vector DB status

#### RAG Pipelines
- `POST /api/commander/rag/pipelines` – Create pipeline
- `GET /api/commander/rag/pipelines` – List pipelines
- `PATCH /api/commander/rag/pipelines/{id}` – Update pipeline
- `DELETE /api/commander/rag/pipelines/{id}` – Delete pipeline
- `POST /api/commander/rag/pipelines/{id}/execute` – Run pipeline
- `GET /api/commander/rag/pipelines/{id}/logs` – Pipeline logs
- `POST /api/commander/rag/pipelines/{id}/schedule` – Schedule pipeline
- `GET /api/commander/rag/extraction/status` – PDF extraction status

---

### 3. AGENT MARKETPLACE (`/api/commander/marketplace`)

#### Agent Templates
- `POST /api/commander/marketplace/agents` – Create custom agent
- `GET /api/commander/marketplace/agents` – List agents
- `GET /api/commander/marketplace/agents?category=logic` – Filter by category
- `GET /api/commander/marketplace/agents/{id}` – Get agent definition
- `PATCH /api/commander/marketplace/agents/{id}` – Update agent
- `DELETE /api/commander/marketplace/agents/{id}` – Delete agent
- `POST /api/commander/marketplace/agents/{id}/clone` – Clone agent template
- `POST /api/commander/marketplace/agents/{id}/test` – Test agent
- `POST /api/commander/marketplace/agents/{id}/publish` – Publish to marketplace

#### Custom Workflows
- `POST /api/commander/marketplace/workflows` – Create workflow
- `GET /api/commander/marketplace/workflows` – List workflows
- `PATCH /api/commander/marketplace/workflows/{id}` – Update workflow
- `DELETE /api/commander/marketplace/workflows/{id}` – Delete workflow
- `POST /api/commander/marketplace/workflows/{id}/execute` – Execute workflow
- `GET /api/commander/marketplace/workflows/{id}/executions` – Get history
- `POST /api/commander/marketplace/workflows/{id}/schedule` – Schedule workflow
- `GET /api/commander/marketplace/workflows/{id}/logs` – Workflow logs

#### Batch Operations
- `POST /api/commander/marketplace/batch-jobs` – Create batch job
- `GET /api/commander/marketplace/batch-jobs` – List jobs
- `GET /api/commander/marketplace/batch-jobs/{id}` – Get job details
- `PATCH /api/commander/marketplace/batch-jobs/{id}` – Update job config
- `POST /api/commander/marketplace/batch-jobs/{id}/start` – Start job
- `POST /api/commander/marketplace/batch-jobs/{id}/cancel` – Cancel job
- `GET /api/commander/marketplace/batch-jobs/{id}/progress` – Get progress
- `GET /api/commander/marketplace/batch-jobs/{id}/results` – Download results

---

### 4. USER & TENANT MANAGEMENT (`/api/commander/users`)

#### User Administration
- `GET /api/commander/users` – List users
- `GET /api/commander/users/{id}` – Get user details
- `POST /api/commander/users` – Create user
- `PATCH /api/commander/users/{id}` – Update user
- `DELETE /api/commander/users/{id}` – Delete user
- `POST /api/commander/users/{id}/reset-password` – Reset password
- `POST /api/commander/users/{id}/revoke-keys` – Revoke API keys
- `PATCH /api/commander/users/{id}/role` – Update role/permissions
- `GET /api/commander/users/{id}/sessions` – User sessions
- `POST /api/commander/users/{id}/logout-all` – Force logout

#### Authentication & SAML/LDAP
- `POST /api/commander/auth/saml/config` – Configure SAML
- `GET /api/commander/auth/saml/config` – Get SAML config
- `POST /api/commander/auth/ldap/config` – Configure LDAP
- `GET /api/commander/auth/ldap/config` – Get LDAP config
- `POST /api/commander/auth/mfa/enable` – Enable MFA
- `POST /api/commander/auth/mfa/disable` – Disable MFA
- `GET /api/commander/auth/providers` – List auth providers
- `POST /api/commander/auth/providers/{id}/test` – Test provider

#### Tenant Management
- `GET /api/commander/tenants` – List tenants
- `POST /api/commander/tenants` – Create tenant
- `GET /api/commander/tenants/{id}` – Get tenant details
- `PATCH /api/commander/tenants/{id}` – Update tenant
- `DELETE /api/commander/tenants/{id}` – Delete tenant
- `PATCH /api/commander/tenants/{id}/data-residency` – Set data location
- `GET /api/commander/tenants/{id}/sla` – Get SLA terms
- `PATCH /api/commander/tenants/{id}/sla` – Update SLA
- `GET /api/commander/tenants/{id}/usage` – Usage metrics

---

### 5. ANALYTICS & REPORTING (`/api/commander/analytics`)

#### Consensus Analytics
- `GET /api/commander/analytics/consensus/trends` – Consensus over time
- `GET /api/commander/analytics/consensus/by-topic` – By topic analysis
- `GET /api/commander/analytics/consensus/distribution` – Score distribution
- `GET /api/commander/analytics/consensus/outliers` – Anomaly detection
- `POST /api/commander/analytics/consensus/forecast` – Forecast trends

#### Agent Performance
- `GET /api/commander/analytics/agents/ranking` – Agent rankings
- `GET /api/commander/analytics/agents/{id}/performance` – Specific agent
- `GET /api/commander/analytics/agents/agreement-matrix` – Agent agreement patterns
- `GET /api/commander/analytics/agents/expertise` – Expertise by topic
- `POST /api/commander/analytics/agents/compare` – Compare agents

#### Cost Tracking
- `GET /api/commander/analytics/costs/summary` – Cost overview
- `GET /api/commander/analytics/costs/by-model` – Costs by model
- `GET /api/commander/analytics/costs/by-user` – Costs by user
- `GET /api/commander/analytics/costs/by-date` – Time-series costs
- `GET /api/commander/analytics/costs/forecast` – Cost projections
- `POST /api/commander/analytics/costs/export` – Export cost data

#### Usage Analytics
- `GET /api/commander/analytics/usage/overview` – Usage summary
- `GET /api/commander/analytics/usage/by-user` – Per-user usage
- `GET /api/commander/analytics/usage/by-feature` – By feature breakdown
- `GET /api/commander/analytics/usage/heatmap` – Usage patterns
- `GET /api/commander/analytics/usage/export` – Export usage data

#### Reports
- `POST /api/commander/analytics/reports/generate` – Generate report
- `GET /api/commander/analytics/reports` – List reports
- `GET /api/commander/analytics/reports/{id}` – Get report
- `POST /api/commander/analytics/reports/{id}/export` – Export format
- `POST /api/commander/analytics/reports/schedule` – Schedule report
- `GET /api/commander/analytics/reports/templates` – Report templates

---

### 6. AUDIT LOGGING (`/api/commander/audit`)

#### Activity Log
- `GET /api/commander/audit/logs` – List audit logs
- `GET /api/commander/audit/logs?actor=user123` – Filter by actor
- `GET /api/commander/audit/logs?action=deliberate` – Filter by action
- `GET /api/commander/audit/logs?date_range=7d` – Filter by date
- `GET /api/commander/audit/logs/{id}` – Get specific log
- `POST /api/commander/audit/logs/search` – Full-text search logs
- `POST /api/commander/audit/logs/export` – Export logs
- `POST /api/commander/audit/logs/archive` – Archive logs

#### Compliance
- `POST /api/commander/audit/compliance/check` – Run compliance check
- `GET /api/commander/audit/compliance/status` – Compliance status
- `POST /api/commander/audit/compliance/export` – Export compliance report
- `GET /api/commander/audit/compliance/policies` – List policies
- `PATCH /api/commander/audit/compliance/policies/{id}` – Update policy

#### Data Protection
- `POST /api/commander/audit/data-retention/policy` – Set retention policy
- `GET /api/commander/audit/data-retention/status` – Retention status
- `POST /api/commander/audit/data-deletion` – Request data deletion
- `GET /api/commander/audit/data-deletion/{id}` – Check deletion status
- `POST /api/commander/audit/gdpr/export` – GDPR data export

---

### 7. SYSTEM ADMINISTRATION (`/api/commander/system`)

#### Configuration
- `GET /api/commander/system/config` – Get config
- `PATCH /api/commander/system/config` – Update config
- `GET /api/commander/system/config/defaults` – Get defaults
- `POST /api/commander/system/config/reset` – Reset config
- `GET /api/commander/system/environment` – Get environment variables
- `POST /api/commander/system/environment/{key}` – Update env var

#### Health & Monitoring
- `GET /api/commander/system/health` – System health
- `GET /api/commander/system/services` – Service status
- `GET /api/commander/system/resources` – Resource usage (CPU, memory, disk)
- `GET /api/commander/system/databases` – DB connection status
- `GET /api/commander/system/alerts` – Active alerts
- `POST /api/commander/system/alerts/{id}/acknowledge` – Acknowledge alert

#### Maintenance
- `POST /api/commander/system/backup` – Trigger backup
- `GET /api/commander/system/backups` – List backups
- `POST /api/commander/system/restore` – Restore from backup
- `POST /api/commander/system/migrate` – Run migrations
- `POST /api/commander/system/gc` – Garbage collection
- `GET /api/commander/system/logs` – System logs

---

## WebSocket Connections

Real-time streaming for:

```
ws://localhost:8001/ws/commander/council/session/{id}
  ↳ Real-time deliberation updates

ws://localhost:8001/ws/commander/rag/indexing/{collection-id}
  ↳ Real-time document indexing progress

ws://localhost:8001/ws/commander/workflow/{workflow-id}
  ↳ Real-time workflow execution status

ws://localhost:8001/ws/commander/system/metrics
  ↳ Real-time system metrics stream

ws://localhost:8001/ws/commander/audit/live
  ↳ Live audit event stream
```

---

## Quick Start

### 1. Start Services
```bash
cd AIcouncil
make dev  # Starts all services including command-center
```

### 2. Access Command Center
```
http://localhost:8080/command-center
```

### 3. First Steps
- [ ] Setup authentication (SAML/LDAP if using enterprise)
- [ ] Configure data residency (EU/US)
- [ ] Upload documents for RAG
- [ ] Create custom agents in marketplace
- [ ] Run first deliberation via operations panel
- [ ] Monitor via analytics dashboard

---

## Configuration

### .env additions
```bash
# Command Center API
COMMANDER_PORT=8001
COMMANDER_API_KEY=your-secure-key
COMMANDER_DEBUG=false

# Vector DB (Chroma)
CHROMA_HOST=localhost
CHROMA_PORT=8003
CHROMA_PERSIST_DIR=/data/chroma

# Audit Logger
AUDIT_LOG_DB=postgresql://user:pass@postgres:5432/audit
AUDIT_RETENTION_DAYS=365

# Workflow Scheduler
SCHEDULER_DATABASE_URL=postgresql://user:pass@postgres:5432/scheduler

# Analytics
ANALYTICS_DATABASE_URL=postgresql://user:pass@postgres:5432/analytics

# Enterprise
SAML_ENABLED=false
LDAP_ENABLED=false
DATA_RESIDENCY=US  # US or EU
```

---

## Phase Implementation Timeline

| Phase | Tasks | Timeline |
|-------|-------|----------|
| **3b** | Vector DB, semantic search, multi-language, PDF extraction | Days 1-3 |
| **3c** | Custom agents, marketplace, scheduling, batch ops | Days 4-6 |
| **4b** | SAML/LDAP, audit logging, data residency, SLAs | Days 7-9 |
| **4c** | Analytics dashboard, consensus trends, agent ranking, cost forecasting | Days 10-12 |

---

## Success Criteria

- ✅ 100+ API endpoints fully documented
- ✅ Command Center UI fully functional
- ✅ All CRUD operations for agents, documents, workflows
- ✅ Real-time WebSocket connections
- ✅ Analytics aggregation & reporting
- ✅ Enterprise security & compliance
- ✅ Full test coverage (unit, integration, E2E)
- ✅ Production-ready deployment

---

## Next: Implement all services and UI components

Ready to build? Will start with:
1. Command Center API foundation + all 100+ endpoints
2. Command Center React dashboard
3. Vector DB integration
4. Workflow scheduler
5. Analytics aggregation
6. Audit logging
7. Full test suite

**Estimated effort:** 40-50 hours of development

