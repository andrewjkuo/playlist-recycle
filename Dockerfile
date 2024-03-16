FROM node:16 as build-stage

WORKDIR /app

COPY package.json ./

RUN npm install

# Copy the rest of your application code
COPY src src
COPY public public

# Build your Vuepress project
RUN npm run build

# Use nginx as a lightweight web server
FROM nginx:alpine as production-stage

COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the built Vuepress project from the previous stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
