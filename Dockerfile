## stage 1
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --save --legacy--peer-deps
COPY . .
RUN npm run build

## stage 2
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/swe-angular /usr/share/nginx/html
