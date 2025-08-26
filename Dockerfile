#section build
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# Section development
FROM node:20 AS development
WORKDIR /app
COPY package*.json ./
RUN npm  ci
COPY . .

# copia l'entrypoint fuori da /app per evitare che il bind-mount lo sovrascriva
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000
# usa l'exec form con sh (niente shell form implicita)
ENTRYPOINT ["sh", "/usr/local/bin/entrypoint.sh"]

# Section production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]


FROM nginx
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf
