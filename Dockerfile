# ── Stage: test runner ───────────────────────────────────────────────────────
FROM mcr.microsoft.com/playwright:v1.64.1-jammy

LABEL org.opencontainers.image.title="ParaBank BDD Tests"
LABEL org.opencontainers.image.description="Playwright BDD automation tests for ParaBank"

WORKDIR /app

# Install Node dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Pre-generate BDD test files so the image is self-contained
RUN npm run bddgen

# Override at runtime via K8s ConfigMap/Secret or docker run -e
ENV CI=true
ENV BASE_URL=https://parabank.parasoft.com

CMD ["npm", "test"]
