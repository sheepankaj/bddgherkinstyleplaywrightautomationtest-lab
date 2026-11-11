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

# bddgen runs at container startup via CMD ["npm", "test"] = "bddgen && playwright test"
# Do NOT run bddgen here — it loads testData.ts which needs TEST_PASSWORD,
# a runtime secret that must not be baked into the image layer.

# Override at runtime via K8s ConfigMap/Secret or docker run -e
ENV CI=true
ENV BASE_URL=https://parabank.parasoft.com

CMD ["npm", "test"]
