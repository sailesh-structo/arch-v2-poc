FROM node:18 AS builder
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./
RUN yarn --frozen-lockfile
COPY . .
RUN SKIP_ENV_VALIDATION=1 yarn build


FROM node:18 AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
