
FROM node:20-alpine AS builder


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .

RUN npm run build


FROM node:20-alpine

# Set working directory
WORKDIR /app


COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
