# AICouncil + Command Center - Deployment Guide

**Version:** 2.0.0  
**Last Updated:** December 3, 2025

---

## Quick Deploy (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
- 4GB+ RAM available
- Ports 8080, 8001, 8000, 4000, 11434, 8003, 5432, 6379 free

### Step 1: Setup Environment
```bash
cd /data/data/com.termux/files/home/AIcouncil
cp .env.example .env
```

### Step 2: Start All Services
```bash
docker-compose -f deploy/docker/docker-compose.dev.yml up -d
```

### Step 3: Verify Services
```bash
# Wait 30 seconds for services to initialize
sleep 30

# Check all services are running
docker ps

# Verify connectivity
curl -s http://localhost:8001/api/commander/health
```

### Step 4: Access Dashboard
```
http://localhost:8080/command-center
```

---

## Service Startup Sequence

Services start in this order (with dependencies):

```
1. Redis (6379)
   ├─ No dependencies
   
2. Ollama (11434)
   ├─ No dependencies
   
3. PostgreSQL (5432)
   ├─ No dependencies
   
4. Chroma Vector DB (8003)
   ├─ No dependencies
   
5. LiteLLM (4000)
   ├─ Depends on: Ollama
   
6. OpenWebUI (8080)
   ├─ Depends on: LiteLLM, Ollama
   
7. Council API (8000)
   ├─ Depends on: LiteLLM, Ollama
   
8. Commander API (8001)
   ├─ Depends on: Council API, Redis, PostgreSQL
```

**Typical startup time:** 45-60 seconds

---

## Deployment Options

### Option 1: Local Development (Recommended for Testing)
```bash
docker-compose -f deploy/docker/docker-compose.dev.yml up
```
- Development settings
- Debug logging enabled
- Hot reload for code changes
- Suitable for: Development, testing, demos

### Option 2: Production (For Deployment)
```bash
docker-compose -f deploy/docker/docker-compose.yml up -d
```
- Production optimizations
- Minimal logging
- Health checks enabled
- Suitable for: Staging, production

### Option 3: Testing (For CI/CD)
```bash
docker-compose -f deploy/docker/docker-compose.test.yml up
pytest tests/integration/ -v
```
- Isolated test environment
- In-memory databases where possible
- Comprehensive logging
- Suitable for: Automated testing, CI/CD

---

## Health Check

### Endpoint Health
```bash
# Commander API health
curl http://localhost:8001/api/commander/health

# Full system status
curl http://localhost:8001/api/commander/status

# Service connectivity
curl http://localhost:8001/api/commander/system/services

# Resource usage
curl http://localhost:8001/api/commander/system/resources
```

### Expected Responses

**Health Check:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-03T10:00:00",
  "version": "2.0.0"
}
```

**Status:**
```json
{
  "status": "operational",
  "services": {
    "council": "active",
    "rag": "active",
    "agents": "active",
    "analytics": "active",
    "audit": "active",
    "users": "active",
    "workflows": "active"
  }
}
```

---

## Configuration

### .env File

**Core Settings:**
```bash
# API Keys
VENICE_API_KEY=your-venice-key
LITELLM_MASTER_KEY=your-litellm-key
COMMANDER_API_KEY=your-commander-key

# Ports
OPENWEBUI_PORT=8080
COUNCIL_PORT=8000
COMMANDER_PORT=8001
LITELLM_PORT=4000
OLLAMA_PORT=11434
CHROMA_PORT=8003
POSTGRES_PORT=5432
REDIS_PORT=6379

# Database
POSTGRES_USER=aicouncil
POSTGRES_PASSWORD=secure-password-here
POSTGRES_DB=aicouncil_db

# Debugging
COUNCIL_DEBUG=true
COMMANDER_DEBUG=true
LITELLM_LOG=debug

# Features
REFUSAL_ENABLED=true
JAILBREAK_THRESHOLD=0.7
```

### Scaling Configuration

**For 10+ concurrent users:**
```yaml
# docker-compose.yml
council:
  deploy:
    replicas: 3
    
command-center:
  deploy:
    replicas: 2
    
openwebui:
  deploy:
    replicas: 2
```

**For 100+ concurrent users:**
Deploy with Kubernetes or Akash (see below)

---

## Advanced Deployments

### Akash Testnet
```bash
# 1. Install Akash CLI
curl https://raw.githubusercontent.com/akash-network/akash/master/install.sh | bash

# 2. Deploy
akash tx deployment create deploy/akash/deploy.foundation.yaml \
  --from <your-wallet> \
  --chain-id testnet-01

# 3. Monitor
akash query deployment list --owner <your-address>
```

### Akash Mainnet
```bash
akash tx deployment create deploy/akash/deploy.production.yaml \
  --from <your-wallet> \
  --chain-id mainnet-01
```

### Kubernetes
```bash
# 1. Build images
docker build -t aicouncil/council services/council/
docker build -t aicouncil/commander services/command-center/

# 2. Deploy
kubectl apply -f deploy/k8s/

# 3. Port forward
kubectl port-forward svc/commander 8001:8001
```

### AWS ECS
```bash
# Use deploy/ecs/task-definition.json
aws ecs register-task-definition --cli-input-json file://deploy/ecs/task-definition.json
aws ecs create-service --cluster aicouncil --task-definition aicouncil:1
```

---

## Database Setup

### PostgreSQL Initialization
```bash
# Access database
docker exec -it aicouncil-postgres-dev psql -U aicouncil -d aicouncil_db

# Create tables (done automatically on first run)
\dt

# Check data
SELECT * FROM council_sessions LIMIT 5;
SELECT * FROM agents;
SELECT * FROM users;
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

### Backup Database
```bash
docker exec aicouncil-postgres-dev pg_dump -U aicouncil -d aicouncil_db > backup.sql
```

### Restore Database
```bash
docker exec -i aicouncil-postgres-dev psql -U aicouncil -d aicouncil_db < backup.sql
```

---

## Redis Configuration

### Cache Keys
```bash
# Connect to Redis
docker exec -it aicouncil-redis-dev redis-cli

# View all keys
KEYS *

# Get session cache
GET council:session:abc123

# Monitor live updates
MONITOR

# Flush cache (be careful!)
FLUSHALL
```

---

## Vector DB (Chroma) Setup

### Collections
```bash
# Connect to Chroma API
curl http://localhost:8003/api/v1/collections

# Create collection
curl -X POST http://localhost:8003/api/v1/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "documents",
    "metadata": {"description": "Main document collection"}
  }'

# List collections
curl http://localhost:8003/api/v1/collections

# Delete collection
curl -X DELETE http://localhost:8003/api/v1/collections/documents
```

---

## Monitoring

### Docker Logs
```bash
# All services
docker-compose -f deploy/docker/docker-compose.dev.yml logs -f

# Specific service
docker-compose -f deploy/docker/docker-compose.dev.yml logs -f commander

# Last 100 lines
docker-compose -f deploy/docker/docker-compose.dev.yml logs -n 100
```

### Prometheus Metrics (Optional)
```bash
# Enable in .env
PROMETHEUS_ENABLED=true

# Access metrics
http://localhost:9090
```

### Grafana Dashboards (Optional)
```bash
# Enable in docker-compose.yml
# Access dashboards
http://localhost:3000
```

---

## Troubleshooting

### Issue: Services won't start
```bash
# Clear old containers
docker-compose -f deploy/docker/docker-compose.dev.yml down -v

# Restart
docker-compose -f deploy/docker/docker-compose.dev.yml up
```

### Issue: Port already in use
```bash
# Find what's using the port (e.g., 8001)
lsof -i :8001

# Kill the process
kill -9 <PID>
```

### Issue: Database connection failed
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Reset database
docker volume rm aicouncil_postgres_data_dev
docker-compose up postgres
```

### Issue: API not responding
```bash
# Check Commander service logs
docker logs aicouncil-commander-dev

# Test connectivity
curl -v http://localhost:8001/api/commander/health

# Check network
docker network inspect aicouncil-dev
```

### Issue: Memory usage high
```bash
# Check container stats
docker stats

# Reduce cache size
docker exec aicouncil-redis-dev redis-cli CONFIG SET maxmemory 500mb
```

---

## Testing the Deployment

### Unit Tests
```bash
cd services/command-center
python -m pytest tests/unit/ -v
```

### Integration Tests
```bash
docker-compose -f deploy/docker/docker-compose.test.yml up
pytest tests/integration/ -v
```

### API Tests
```bash
# Health check
curl http://localhost:8001/api/commander/health

# Create deliberation
curl -X POST http://localhost:8001/api/commander/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{"question":"Test question","agent_count":3}'

# List documents
curl http://localhost:8001/api/commander/rag/documents

# Get users
curl http://localhost:8001/api/commander/users

# Check audit logs
curl http://localhost:8001/api/commander/audit/logs
```

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Run benchmark
ab -n 1000 -c 10 http://localhost:8001/api/commander/health

# Or use wrk
brew install wrk
wrk -t4 -c100 -d30s http://localhost:8001/api/commander/health
```

---

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Change LITELLM_MASTER_KEY
- [ ] Set strong COMMANDER_API_KEY
- [ ] Enable HTTPS/TLS in production
- [ ] Configure firewall rules
- [ ] Set up authentication (OAuth, LDAP)
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set data residency policies
- [ ] Enable backups
- [ ] Set up monitoring/alerting

---

## Scaling Strategy

### Stage 1: Single Server (Dev/Test)
- All services on one machine
- Suitable for: Development, testing, demos
- Resources: 2GB RAM minimum

### Stage 2: Multi-Container (Production Ready)
- Services spread across 3-5 machines
- Suitable for: Production, 10-100 users
- Resources: 8GB RAM, 4 CPUs recommended

### Stage 3: Kubernetes (Enterprise)
- Auto-scaling, multi-region failover
- Suitable for: 100+ users, high availability
- Resources: 3+ nodes, 4GB+ RAM each

### Stage 4: Akash Decentralized (Maximum Availability)
- Deployed across decentralized cloud
- Suitable for: Global, 24/7, censorship-resistant
- Resources: Flexible, on-demand pricing

---

## Performance Tuning

### PostgreSQL
```sql
-- Increase connection pool
-- In .env: POSTGRES_MAX_CONNECTIONS=200

-- Add indexes for common queries
CREATE INDEX idx_sessions_status ON council_sessions(status);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

### Redis
```bash
# Increase maxmemory
docker exec aicouncil-redis-dev redis-cli CONFIG SET maxmemory 1gb

# Enable persistence
docker exec aicouncil-redis-dev redis-cli CONFIG SET appendonly yes
```

### Ollama
```bash
# Enable GPU acceleration (if available)
# In docker-compose.yml:
# environment:
#   - CUDA_VISIBLE_DEVICES=0

# Increase context size
export OLLAMA_NUM_PARALLEL=4
```

---

## Backup & Recovery

### Daily Backups
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/aicouncil"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL
docker exec aicouncil-postgres-dev pg_dump -U aicouncil -d aicouncil_db > $BACKUP_DIR/db_$DATE.sql

# Redis
docker exec aicouncil-redis-dev redis-cli --rdb $BACKUP_DIR/redis_$DATE.rdb

echo "Backup complete: $DATE"
```

### Disaster Recovery
```bash
# 1. Stop services
docker-compose down

# 2. Restore database
docker exec -i aicouncil-postgres-dev psql -U aicouncil -d aicouncil_db < backup.sql

# 3. Restore Redis
docker cp redis_backup.rdb aicouncil-redis-dev:/data/

# 4. Restart services
docker-compose up -d
```

---

## Support & Issues

For issues:
1. Check logs: `docker-compose logs -f`
2. Review INTEGRATION_COMPLETE.md
3. Check API docs: http://localhost:8001/api/commander/docs
4. Read troubleshooting section above

---

## Summary

AICouncil + Command Center is ready to deploy:

✅ All services configured  
✅ Health checks enabled  
✅ Database initialized  
✅ API fully functional  
✅ WebSocket streaming ready  
✅ Admin dashboard included  

**Deploy with confidence:**
```bash
docker-compose -f deploy/docker/docker-compose.dev.yml up
```

---

**Built with ⚡ AICouncil**  
**December 3, 2025**
