# AICouncil – Epistemic Consensus Engine

A distributed, decentralized system for consensus-driven decision making powered by Venice AI, Ollama, and on-chain provenance. Run locally, scale to mainnet.

## Vision

AICouncil orchestrates multiple AI agents to deliberate, disagree, and reach consensus—all while maintaining cryptographic proof of discourse on Sui & Arweave. Think: a council chamber for AI systems, with a UI as sleek as Venice.

## Quick Start

```bash
# Clone & navigate
git clone https://github.com/jbino85/AIcouncil.git
cd AIcouncil

# Spin up the full stack (OpenWebUI + LiteLLM + Ollama + Council service)
docker compose up

# Visit the UI
open http://localhost:8080
```

## What's Inside

| Component | Purpose | Status |
|-----------|---------|--------|
| **OpenWebUI** | Sleek chat interface (Venice-themed) | Phase 2 |
| **LiteLLM** | API proxy with Venice + local fallback | Phase 1 |
| **Ollama** | Local model runtime (Llama, Mistral, etc.) | Phase 1 |
| **Council Service** | FastAPI deliberation engine | Phase 2 |
| **AnythingLLM** | RAG + document retrieval | Phase 3 |
| **Flowise** | Drag-and-drop ritual builder | Phase 3 |
| **Arweave** | Permanent session archival | Phase 3 |
| **Sui** | On-chain NFT provenance | Phase 3 |
| **Supabase** | User auth & multi-tenancy | Phase 4 |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│           OpenWebUI (Port 8080)                     │
│         Venice-themed chat interface                │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│    LiteLLM Proxy (Port 4000)                        │
│  Venice API ◄──fallback──► Ollama local models     │
│  Rate limiting • Cost tracking • Guardrails         │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  Venice  │   │  Ollama  │   │  Council │
   │   API    │   │  Local   │   │ Service  │
   └─────────┘   └──────────┘   └────┬────┘
                                      │
                    ┌─────────────────┼──────────────┐
                    │                 │              │
               ┌────▼────┐        ┌───▼──┐      ┌──▼────┐
               │AnythingLM│        │Flowise│     │Arweave│
               │   (RAG)  │        │Builder│     │Archive│
               └──────────┘        └───────┘     └───┬───┘
                                                      │
                                                 ┌────▼────┐
                                                 │  Sui    │
                                                 │  NFTs   │
                                                 └─────────┘
```

## Roadmap

### Phase 1: Foundation (Days 1–4)
- [x] Repository & monorepo skeleton
- [x] Docker Compose (OpenWebUI + LiteLLM + Ollama)
- [ ] Venice API integration
- [ ] GitHub Actions CI/CD setup

### Phase 2: Intelligence (Days 5–9)
- [ ] Venice aesthetic theming
- [ ] Local test & Akash SDL draft
- [ ] Council service as FastAPI microservice
- [ ] Council button in OpenWebUI

### Phase 3: Provenance (Days 10–14)
- [ ] AnythingLLM RAG microservice
- [ ] RAG-before-council pipeline
- [ ] Flowise ritual builder
- [ ] Arweave permanent storage
- [ ] Sui NFT minting

### Phase 4: Production (Days 15–20)
- [ ] Supabase auth + OAuth
- [ ] Rate limiting & cost tracking
- [ ] Akash production deployment
- [ ] Hard refusal guardrails

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build & push Docker images
docker compose build
docker compose push
```

## Configuration

See `.env.example` for all configuration options. Key vars:

```bash
VENICE_API_KEY=<your-api-key>
OLLAMA_ENDPOINT=http://ollama:11434
LITELLM_MASTER_KEY=<secure-key>
COUNCIL_MODE=enabled
```

## Licensing & Attribution

This project builds on excellent open-source foundations:

- **OpenWebUI** (MIT) – Chat interface base
- **LiteLLM** (MIT) – API proxy by BerriAI
- **Ollama** (MIT) – Local model runtime
- **jbino85/council** (MIT) – Epistemic engine
- **AnythingLLM** (MIT) – RAG by Mintplex Labs
- **Flowise** (Apache 2.0) – Agent builder
- **Sui SDK** (Apache 2.0) – On-chain provenance
- **Arweave** (Apache 2.0) – Permanent storage
- **shadcn/ui** (MIT) – UI components
- **Supabase** (Apache 2.0) – Auth infrastructure

See `ATTRIBUTION.md` for full details.

## Contributing

We welcome contributions! See `CONTRIBUTING.md` for guidelines.

```bash
git checkout -b feature/your-feature
# Make changes, commit, push
git push origin feature/your-feature
# Open a PR
```

## Security & Guardrails

AICouncil enforces hard refusal guardrails at the LiteLLM middleware level:

- **Keyword detection** for CSAM, bioweapon synthesis, mass harassment
- **Embedding-based jailbreak detection** (cosine similarity to known attack patterns)
- **Per-user rate limits** to prevent abuse
- **Session archival** on Arweave for audit trails

See `docs/GUARDRAILS.md` for implementation details.

## Support

- **Docs:** See `/docs` folder for deep dives
- **Issues:** Report bugs on GitHub
- **Discord:** [Join our community](https://discord.gg/aicouncil)

## License

MIT License – see `LICENSE` file.

---

Built with ⚡ by Ọbàtálá & AIcouncil Contributors
