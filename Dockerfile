FROM node:24-alpine AS build
WORKDIR /dlr-fin
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY --from=build /dlr-fin/dist/dlr-fin/browser /usr/share/nginx/html
COPY default.conf /etc/nginx/templates/default.conf.template

ENV PORT=8080 \
    API_URL=http://localhost:8080

EXPOSE 8080
STOPSIGNAL SIGQUIT

CMD ["/bin/sh", "-c", "envsubst '${PORT} ${API_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]