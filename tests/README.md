# Z Car Rental — Test Suite

## Test Architecture

| Layer | Tool | Command |
|-------|------|---------|
| Unit | Vitest | `npm run test:unit` |
| Integration | Vitest + test DB | `npm run test:integration` |
| E2E | Playwright | `npm run test:e2e` |
| Coverage | v8 | `npm run test:coverage` |
| Full CI Gate | — | `npm run ci` |

## Running Tests

### Unit Tests (fast, no DB)
```bash
npm run test:unit
```

### Integration Tests (requires test DB)
```bash
# Start test database
docker compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration

# Stop test database
docker compose -f docker-compose.test.yml down
```

### E2E Tests (requires dev server)
```bash
npm run test:e2e
# Or with UI:
npm run test:e2e:ui
```

### Full CI Gate (runs all checks)
```bash
npm run ci
```

## Test Database

The integration tests use a Dockerized PostgreSQL instance running on port `5433`.

Configuration: `.env.test`

## Git Hooks

- **pre-commit**: Runs `lint-staged` (ESLint + Prettier on changed files)
- **pre-push**: Runs the full `npm run ci` gate (lint, typecheck, tests, build)
