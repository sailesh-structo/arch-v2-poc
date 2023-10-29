# FROM node:18-alpine AS builder
# RUN apk add --no-cache libc6-compat openssl1.1-compat
# WORKDIR /app
# COPY . .
# RUN yarn --frozen-lockfile
# RUN SKIP_ENV_VALIDATION=1 yarn build


# FROM node:18-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV production
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs
# EXPOSE 3000
# ENV PORT 3000

# CMD ["node", "server.js"]

FROM node:18
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3000
CMD npm run dev