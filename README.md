# Public Ads Platform

Public Ads Platform is a local-first, cloud-optional system for collecting public advertising creatives, extracting structured features, classifying industries, and generating reusable reverse prompts.

The repository brings together browser automation, Python orchestration, dashboard monitoring, validation workflows, and deployment infrastructure in a single project. The primary application source lives in [`platform/`](./platform/README.md); this root document serves as the official repository overview and documentation index.

## Overview

The platform is designed to support an end-to-end workflow for public ad analysis:

1. collect public creatives from multiple sources
2. store assets and metadata through local or cloud-backed adapters
3. extract reusable visual and structural features
4. classify industries and creative patterns
5. generate reverse prompts from structured signals
6. inspect pipeline activity through APIs, dashboards, logs, and validation tooling

## Project Goals

- provide a local-first development experience with no mandatory cloud dependency
- support a cloud deployment path without maintaining a separate codebase
- make scraping and processing pipelines observable, testable, and reproducible
- keep the system usable on constrained development environments
- document architecture, validation, and operational workflows clearly

## Key Capabilities

- Multi-source scraping: Node.js and Playwright-based scrapers for public ad and asset collection
- Processing pipeline: Python services for orchestration, feature extraction, industry classification, and reverse prompting
- Local and cloud modes: interchangeable adapters for storage, queueing, monitoring, and inference
- Observability: dashboard views, WebSocket streaming, screenshot capture, health checks, and metrics endpoints
- Developer workflow: setup scripts, validation guides, manual testing procedures, and automated tests

## Engineering Scope

This repository covers substantially more than a standalone scraper. It includes:

- browser automation and streaming capture for real-world scraping workflows
- backend orchestration and API layers built around async Python services
- frontend dashboard work for monitoring jobs, assets, metrics, and logs
- deterministic local execution paths alongside optional cloud-integrated infrastructure
- testing, validation, and documentation needed to operate the system with confidence

## Technology Stack

- Scraping and automation: Playwright, `playwright-extra`, stealth plugins, Node.js, WebSocket-based session streaming
- Backend services: FastAPI, Uvicorn, Pydantic, async Python, local and cloud adapter patterns
- Frontend: React, TypeScript, Vite, React Router, TanStack Query, Zustand, Recharts
- Testing and quality: pytest, pytest-asyncio, Vitest, Playwright E2E, Ruff, Black, isort, mypy, ESLint, Prettier
- Infrastructure: Docker, Docker Compose, Terraform, Firebase emulators, Firestore, Pub/Sub, Cloud Storage, Vertex AI

## Repository Layout

- [`platform/README.md`](./platform/README.md): main application overview, setup, modes, and deployment
- [`platform/scrapers/package.json`](./platform/scrapers/package.json): scraper scripts and Node.js dependencies
- [`platform/dashboard/README.md`](./platform/dashboard/README.md): dashboard architecture and deployment notes
- [`platform/LOCAL_VALIDATION.md`](./platform/LOCAL_VALIDATION.md): local stack validation and service bring-up
- [`platform/MANUAL_TESTING.md`](./platform/MANUAL_TESTING.md): guided manual verification flow

## Quick Start

```bash
cd platform
./scripts/setup.sh --quick

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd scrapers && npm install && cd ..
cp env.example .env

pytest tests/test_feature_extraction.py tests/test_reverse_prompt.py
python main.py
```

For full setup, architecture, dashboard, and deployment guidance, continue with [`platform/README.md`](./platform/README.md).

## Documentation Index

Core project documentation:

- Platform overview and main setup guide: [`platform/README.md`](./platform/README.md)
- Local validation and service startup: [`platform/LOCAL_VALIDATION.md`](./platform/LOCAL_VALIDATION.md)
- Manual testing walkthrough: [`platform/MANUAL_TESTING.md`](./platform/MANUAL_TESTING.md)
- Local runtime data guidance: [`platform/data/README.md`](./platform/data/README.md)

Dashboard documentation:

- Dashboard overview, architecture, and deployment notes: [`platform/dashboard/README.md`](./platform/dashboard/README.md)
- Dashboard usage guide: [`platform/dashboard/frontend/DASHBOARD_GUIDE.md`](./platform/dashboard/frontend/DASHBOARD_GUIDE.md)

Architecture documentation:

- System architecture: [`platform/docs/architecture.md`](./platform/docs/architecture.md)
- Pipeline data flow: [`platform/docs/data_flow.md`](./platform/docs/data_flow.md)
- Local versus cloud mode comparison: [`platform/docs/local_vs_cloud.md`](./platform/docs/local_vs_cloud.md)
- Agent pipeline state machine: [`platform/docs/state_machine.md`](./platform/docs/state_machine.md)

Contribution and governance:

- Contribution guidelines: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Code of conduct: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- Security policy: [`SECURITY.md`](./SECURITY.md)
- License: [`LICENSE`](./LICENSE)

## Responsible Use

- Respect the terms of service, robots rules, rate limits, and legal requirements that apply to each public source.
- Keep credentials, service-account files, and private datasets out of version control.
- Review logs, fixtures, and exported data before publishing or sharing generated artifacts.

## Contributing

Contributors should begin with [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`platform/README.md`](./platform/README.md). Changes that affect setup, runtime behavior, scraping workflows, or deployment paths should include corresponding documentation updates.
