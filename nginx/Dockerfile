# Étape 1 : builder le front
FROM node:22.14.0-alpine3.21 as build
WORKDIR /app
COPY ../front/package*.json ./
RUN npm install
COPY ../front .
RUN npm run build

# Étape 2 : copier le build dans Nginx
FROM nginx:stable-alpine as production
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
