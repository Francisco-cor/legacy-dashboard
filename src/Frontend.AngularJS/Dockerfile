FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
ARG VITE_API_BASE=http://localhost:5080
ENV VITE_API_BASE=$VITE_API_BASE
RUN VITE_API_BASE=$VITE_API_BASE npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
