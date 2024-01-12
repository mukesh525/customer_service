FROM node:16 as builder

WORKDIR /app/

COPY package.json .

USER 0
RUN npm install

COPY . .

FROM node:16-slim

USER node

COPY --from=builder /app /app

WORKDIR /app/


EXPOSE 8001

CMD ["npm", "start"]


# FROM node

# WORKDIR /app/

# COPY package.json .

# RUN npm install

# COPY . .

# EXPOSE 8001

# CMD ["npm", "start"]