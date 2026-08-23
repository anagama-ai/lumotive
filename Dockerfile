FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_PB_URL
RUN test -n "$PUBLIC_PB_URL" || (echo >&2 "ERROR: PUBLIC_PB_URL build argument is required"; exit 1)
ENV PUBLIC_PB_URL=${PUBLIC_PB_URL}
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV BODY_SIZE_LIMIT=33554432

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force && rm package-lock.json
COPY --from=build --chown=node:node /app/build ./build

USER node

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:3000/robots.txt').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"]

CMD ["node", "build"]
