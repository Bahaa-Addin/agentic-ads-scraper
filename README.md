# Creative Ads Platform

Creative Ads Platform is a local-first, cloud-optional toolkit for scraping public advertising creatives, extracting structured features, and generating reusable reverse prompts.

The application source currently lives in [`platform/`](./platform/README.md). This repository root now contains the collaboration and governance files expected for an open-source project.

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

If you want the full project walkthrough, deployment notes, and architecture docs, start with [`platform/README.md`](./platform/README.md).

## Responsible Use

- Respect the terms of service, robots rules, rate limits, and legal requirements that apply to each data source.
- Keep local credentials, service-account files, and private datasets out of version control.
- Avoid publishing fixtures or logs that contain personal, proprietary, or non-public data.

## Repository Guide

- Contributor workflow: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Code of conduct: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- Security policy: [`SECURITY.md`](./SECURITY.md)
- Project license: [`LICENSE`](./LICENSE)
