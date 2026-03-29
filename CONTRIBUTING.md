# Contributing

Thanks for helping improve Creative Ads Platform.

## Before You Start

- Read [`platform/README.md`](./platform/README.md) for local setup and architecture context.
- Use local or placeholder credentials only. Never commit `.env` files, service-account keys, or private datasets.
- Prefer small, reviewable pull requests over large mixed changes.

## Local Development

```bash
cd platform
./scripts/setup.sh --quick

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd scrapers && npm install && cd ..
cp env.example .env
```

Run the fast deterministic test suite before opening a pull request:

```bash
cd platform
pytest tests/test_feature_extraction.py tests/test_reverse_prompt.py
```

## Project Expectations

- Keep the local-first development story working without mandatory cloud dependencies.
- Do not introduce committed secrets, service-account material, or non-public sample data.
- Update documentation when setup steps, interfaces, or workflows change.
- Call out scraping, policy, or legal considerations when a change affects how data is collected.

## Pull Request Checklist

- Explain the user-facing or developer-facing impact.
- Include verification steps or test output.
- Mention any follow-up work that should happen after merge.
