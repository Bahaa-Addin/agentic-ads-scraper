# Creative Ads Reverse-Prompting Platform

> An agentic platform for scraping creative ads from public sources, extracting visual features, classifying by industry, and generating reverse-prompts for AI image generation.

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 20+](https://img.shields.io/badge/node.js-20+-green.svg)](https://nodejs.org/)
[![Terraform 1.5+](https://img.shields.io/badge/terraform-1.5+-purple.svg)](https://www.terraform.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [Deployment](#-deployment)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Industry Classification](#-industry-classification)
- [Reverse Prompting](#-reverse-prompting)
- [Monitoring](#-monitoring)
- [Scaling](#-scaling)
- [Development](#-development)
- [Contributing](#-contributing)

## 🎯 Overview

The Creative Ads Platform is an end-to-end solution for:

1. **Scraping** creative ads from legal/public sources (Meta Ad Library, Google Ads Transparency, etc.)
2. **Extracting** structured visual features (layout, colors, typography, CTAs)
3. **Classifying** ads by industry (finance, e-commerce, SaaS, etc.)
4. **Generating** reverse-prompts that can recreate similar creatives using AI image generators

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Creative Ads Platform                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │  Agent Brain │────▶│   Pub/Sub    │────▶│    Node.js Scrapers     │ │
│  │   (Python)   │     │  Job Queue   │     │    (Playwright)         │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────┘ │
│         │                    │                         │                 │
│         ▼                    ▼                         ▼                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │   Feature    │     │  Firestore   │     │     Cloud Storage       │ │
│  │  Extraction  │────▶│   (Assets)   │     │    (Raw Images)         │ │
│  └──────────────┘     └──────────────┘     └──────────────────────────┘ │
│         │                    │                                          │
│         ▼                    ▼                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐ │
│  │   Industry   │     │   Reverse    │     │      Vertex AI          │ │
│  │ Classifier   │────▶│   Prompt     │────▶│    (Gemini 1.5)         │ │
│  └──────────────┘     │  Generator   │     └──────────────────────────┘ │
│                       └──────────────┘                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Core Capabilities

- **Multi-source Scraping**: Meta Ad Library, Google Ads Transparency Center, Internet Archive, Wikimedia Commons
- **Visual Feature Extraction**: Layout, focal point, colors, typography, CTAs, composition
- **Industry Classification**: 12+ industry categories with sub-tags
- **Reverse-Prompt Generation**: Vertex AI (Gemini) powered natural language prompts
- **Negative Prompts**: Automatically generate what to avoid

### Infrastructure

- **Fully Cloud-Native**: Designed for Google Cloud Platform
- **Terraform IaC**: Complete infrastructure as code
- **Auto-scaling**: Pub/Sub-driven scaling based on job queue
- **CI/CD Ready**: Bitbucket Pipelines configuration included

### Monitoring & Operations

- **Cloud Logging**: Structured logging for all components
- **Cloud Monitoring**: Custom metrics and dashboards
- **Dead Letter Queue**: Failed job handling and retry
- **Health Checks**: Kubernetes-style probes for Cloud Run

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker
- Google Cloud SDK
- Terraform 1.5+

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/creative-ads-platform.git
cd creative-ads-platform

# Install Python dependencies
python -m venv venv
source venv/bin/activate
pip install -r agent/requirements.txt
pip install -r feature_extraction/requirements.txt
pip install -r reverse_prompt/requirements.txt
pip install -r firestore/requirements.txt

# Install Node.js dependencies
cd scrapers
npm install
npx playwright install
cd ..

# Set environment variables
export GCP_PROJECT_ID=""  # Empty for local development
export LOG_LEVEL=DEBUG

# Run the agent locally
python main.py

# In another terminal, run the scraper server
cd scrapers
npm start
```

### Running with Docker

```bash
# Build images
docker build -t creative-ads-agent -f docker/Dockerfile.agent .
docker build -t creative-ads-scraper -f docker/Dockerfile.scraper .

# Run containers
docker run -p 8080:8080 -e GCP_PROJECT_ID="" creative-ads-agent
docker run -p 8081:8080 creative-ads-scraper
```

## 📁 Project Structure

```
creative-ads-platform/
├── agent/                      # Python Agent Brain & orchestration
│   ├── __init__.py
│   ├── agent_brain.py         # Core orchestration engine
│   ├── api.py                 # FastAPI HTTP interface
│   ├── config.py              # Configuration management
│   ├── job_queue.py           # Pub/Sub job queue
│   └── requirements.txt
│
├── scrapers/                   # Node.js Playwright scrapers
│   ├── scraper.js             # Main scraper with CLI
│   ├── server.js              # HTTP server for Cloud Run
│   ├── utils.js               # Utilities and helpers
│   └── package.json
│
├── feature_extraction/         # Visual feature extraction
│   ├── __init__.py
│   ├── extract_features.py    # Feature extraction pipeline
│   └── requirements.txt
│
├── reverse_prompt/             # Reverse-prompt generation
│   ├── __init__.py
│   ├── generate_prompt.py     # Vertex AI integration
│   └── requirements.txt
│
├── firestore/                  # Storage clients
│   ├── __init__.py
│   ├── firestore_client.py    # Firestore, Storage, BigQuery
│   └── requirements.txt
│
├── terraform/                  # Infrastructure as Code
│   ├── main.tf                # Main configuration
│   ├── variables.tf           # Input variables
│   ├── outputs.tf             # Output values
│   └── modules/
│       ├── cloud_run/         # Cloud Run services
│       ├── pubsub/            # Pub/Sub topics
│       ├── storage/           # Cloud Storage buckets
│       └── vertex_ai/         # Vertex AI resources
│
├── docker/                     # Docker configurations
│   ├── Dockerfile.agent       # Python agent image
│   └── Dockerfile.scraper     # Node.js scraper image
│
├── ci/                         # CI/CD configuration
│   └── bitbucket-pipelines.yml
│
├── main.py                     # Platform entry point
└── README.md
```

## 🧩 Components

### Agent Brain (`agent/`)

The central orchestrator that:
- Dispatches scraping jobs to Node.js scrapers
- Coordinates feature extraction pipeline
- Triggers reverse-prompt generation
- Handles retries and rate limiting
- Reports metrics to Cloud Monitoring

### Scrapers (`scrapers/`)

Playwright-based browser automation for:
- **Meta Ad Library**: Facebook/Instagram ads
- **Google Ads Transparency Center**: Google Display ads
- **Internet Archive**: Historical TV ads
- **Wikimedia Commons**: Public domain creative assets

### Feature Extraction (`feature_extraction/`)

ML-ready pipeline extracting:
- Layout type (hero, grid, split, minimal)
- Focal point (product, person, text, abstract)
- Color palette and contrast
- Typography analysis
- CTA detection
- Composition metrics
- Quality scoring

### Reverse-Prompt Generator (`reverse_prompt/`)

Converts visual features to natural language prompts:
- Positive prompts for image generation
- Negative prompts for what to avoid
- Industry-specific language
- Multiple style presets

## 🚢 Deployment

### 1. Configure GCP Project

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  pubsub.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com
```

### 2. Deploy Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Review changes
terraform plan \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="region=us-central1" \
  -var="environment=development"

# Apply changes
terraform apply \
  -var="project_id=YOUR_PROJECT_ID" \
  -var="region=us-central1" \
  -var="environment=development"
```

### 3. Build and Push Docker Images

```bash
# Configure Docker for Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and push agent
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT/creative-ads/agent:latest \
  -f docker/Dockerfile.agent .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT/creative-ads/agent:latest

# Build and push scraper
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT/creative-ads/scraper:latest \
  -f docker/Dockerfile.scraper .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT/creative-ads/scraper:latest
```

### 4. Deploy to Cloud Run

```bash
# Deploy agent
gcloud run deploy creative-ads-agent \
  --image=us-central1-docker.pkg.dev/YOUR_PROJECT/creative-ads/agent:latest \
  --region=us-central1 \
  --platform=managed

# Deploy scraper
gcloud run deploy creative-ads-scraper \
  --image=us-central1-docker.pkg.dev/YOUR_PROJECT/creative-ads/scraper:latest \
  --region=us-central1 \
  --platform=managed \
  --memory=2Gi \
  --cpu=2
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GCP_PROJECT_ID` | Google Cloud project ID | Required |
| `GCP_REGION` | GCP region | `us-central1` |
| `PUBSUB_TOPIC` | Pub/Sub topic for jobs | `creative-ads-jobs` |
| `PUBSUB_SUBSCRIPTION` | Pub/Sub subscription | `creative-ads-jobs-sub` |
| `STORAGE_BUCKET_RAW` | Raw assets bucket | `{project}-raw-assets` |
| `STORAGE_BUCKET_PROCESSED` | Processed assets bucket | `{project}-processed-assets` |
| `FIRESTORE_COLLECTION_PREFIX` | Firestore collection prefix | `creative_ads` |
| `VERTEX_AI_MODEL` | Vertex AI model | `gemini-1.5-pro` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `MAX_CONCURRENT_JOBS` | Max concurrent jobs | `10` |

### Terraform Variables

See `terraform/variables.tf` for all available configuration options.

## 📡 API Reference

### Agent API

#### Health Check
```http
GET /health
```

#### Trigger Full Pipeline
```http
POST /trigger
Content-Type: application/json

{
  "sources": ["meta_ad_library", "google_ads_transparency"],
  "industries": ["finance", "ecommerce"],
  "max_items_per_source": 100
}
```

#### Create Scraping Job
```http
POST /scrape
Content-Type: application/json

{
  "source": "meta_ad_library",
  "query": "fintech",
  "max_items": 50
}
```

#### Get Pipeline Status
```http
GET /status
```

#### Get Metrics
```http
GET /metrics
```

### Scraper API

#### Scrape Source
```http
POST /scrape
Content-Type: application/json

{
  "source": "meta_ad_library",
  "query": "SaaS",
  "filters": {"country": "US"},
  "maxItems": 100
}
```

## 🏷️ Industry Classification

### Primary Categories

| Category | Description |
|----------|-------------|
| `finance` | Banking, insurance, fintech |
| `ecommerce` | Online retail, marketplaces |
| `saas` | Software as a Service |
| `healthcare` | Medical, wellness, pharma |
| `education` | EdTech, courses, training |
| `entertainment` | Streaming, gaming, media |
| `food_beverage` | Restaurants, CPG, delivery |
| `travel` | Hotels, airlines, tourism |
| `automotive` | Cars, dealerships, mobility |
| `real_estate` | Property, rentals, mortgages |
| `fashion` | Apparel, accessories, luxury |
| `technology` | Hardware, devices, tech services |

### Sub-Tags

- **CTA Type**: shop_now, learn_more, sign_up, get_started, etc.
- **Focal Object**: product, person, text, abstract, logo
- **Tone/Mood**: professional, playful, urgent, luxurious, friendly
- **Format**: banner, square, story, carousel

## 🎨 Reverse Prompting

### How It Works

1. **Feature Extraction**: Analyze image for visual characteristics
2. **Industry Mapping**: Apply industry-specific language
3. **Prompt Assembly**: Combine features into natural language
4. **AI Enhancement**: Use Vertex AI for refined prompts

### Example Output

```json
{
  "positive": "Advertisement creative: split screen composition, focus on product, color palette featuring #2980b9, #ffffff, high contrast, professional, trustworthy, corporate, clean graphs, confident people, prominent headline text, clear CTA button: 'Get Started', rule of thirds composition",
  "negative": "blurry, low quality, distorted, watermark, amateur, cluttered, poor composition, informal imagery, bright saturated colors",
  "metadata": {
    "generation_method": "vertex_ai",
    "model": "gemini-1.5-pro",
    "industry": "finance",
    "confidence": 0.85
  }
}
```

### Style Presets

- **photorealistic**: High-quality, DSLR-style output
- **digital_art**: Artistic, trending on ArtStation
- **minimalist**: Clean, simple, elegant
- **corporate**: Professional business aesthetic
- **vibrant**: Bold colors, eye-catching

## 📊 Monitoring

### Cloud Logging

All components log structured JSON:

```json
{
  "severity": "INFO",
  "message": "Scraped 25 assets from meta_ad_library",
  "source": "agent_brain",
  "job_id": "abc123",
  "processing_time_ms": 5420
}
```

### Metrics

Available in Cloud Monitoring:

- `creative_ads/assets_scraped`
- `creative_ads/features_extracted`
- `creative_ads/prompts_generated`
- `creative_ads/job_success_rate`
- `creative_ads/processing_time`

### Dashboards

Recommended Looker Studio / Grafana dashboards:

1. **Pipeline Overview**: Job throughput, success rates
2. **Source Metrics**: Assets per source, error rates
3. **Industry Distribution**: Classification breakdown
4. **Quality Metrics**: Feature extraction accuracy

### Alerts

Pre-configured alerts for:

- High error rate (> 5%)
- Dead letter queue messages
- Processing latency spikes
- Queue backlog

## 📈 Scaling

### Current Capacity

- **Development**: ~5,000 creatives/day
- **Staging**: ~25,000 creatives/day
- **Production**: ~100,000+ creatives/day

### Scaling Strategies

1. **Horizontal Scaling**: Increase Cloud Run max instances
2. **Queue Partitioning**: Separate topics per source
3. **Feature Store**: Cache extracted features
4. **CDN Integration**: Serve processed assets via Cloud CDN

### Resource Recommendations

| Environment | Agent Instances | Scraper Instances | Memory |
|-------------|-----------------|-------------------|--------|
| Development | 0-2 | 0-5 | 512Mi / 1Gi |
| Staging | 1-5 | 2-10 | 512Mi / 2Gi |
| Production | 2-20 | 5-50 | 1Gi / 4Gi |

## 🛠️ Development

### Running Tests

```bash
# Python tests
pytest tests/ -v --cov

# Node.js tests
cd scrapers && npm test

# Type checking
mypy agent/ --ignore-missing-imports
```

### Code Style

```bash
# Format Python
black agent/ feature_extraction/ reverse_prompt/ firestore/

# Lint Python
flake8 --max-line-length=100

# Format Node.js
cd scrapers && npm run format
```

### Local Firestore Emulator

```bash
# Start emulator
gcloud emulators firestore start

# Set environment
export FIRESTORE_EMULATOR_HOST=localhost:8080
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

### Code Review Checklist

- [ ] Tests pass
- [ ] Type hints added
- [ ] Documentation updated
- [ ] No sensitive data committed
- [ ] Follows existing code style

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Playwright](https://playwright.dev/) for browser automation
- [Vertex AI](https://cloud.google.com/vertex-ai) for AI capabilities
- [FastAPI](https://fastapi.tiangolo.com/) for Python API framework

---

**Built with ❤️ for the creative advertising industry**

