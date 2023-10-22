FROM node:18-alpine3.17 as build

WORKDIR /app
COPY . /app

RUN yarn
RUN yarn build

# Use an official Nginx image as a parent image
FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will listen on (usually 80 by default)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
